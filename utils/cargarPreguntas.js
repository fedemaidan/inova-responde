var meli 		= require('mercadolibre');
var client      = require('../config/mlClient'); 
var meliObject	= new meli.Meli(client.id, client.secret);
var validador   = require('./erroresEnPeticiones')
const fs = require('fs')

module.exports = (nickname, token, offset) =>  {
  cargar(nickname,token,offset)
}

function cargar(nickname, token, offset)  {
  var limit = 50
  var total = 0
  var preguntasCargadas = offset
  
  meliObject.get('my/received_questions/search', { access_token: token, status: 'UNANSWERED', limit: limit , offset: offset }, (req, respuesta ) => {
    if (!(validador.errorEnPeticion(req, respuesta))) {
        total = respuesta.total
        respuesta.questions.forEach( (pregunta) => {
            guardarEnCSV(req, respuesta, pregunta, nickname, token)
            preguntasCargadas++
        })

        console.log( "Carga preguntas")
        console.log("OFFSET:" + offset)
        console.log("TOTAL:" + total)

        if (preguntasCargadas < total) {
          cargar(nickname, token, preguntasCargadas)
        } else {
          fs.appendFile("resultado/statusActualizar.csv", "\n"+nickname+",GENERADO", "utf8", (err) =>{ if (err) console.log(err)})
        }
      }
    else {
          console.log("ERROR: Falló en la solicitud de preguntas.")
          console.log("OFFSET:" + offset)
          console.log("TOTAL:" + total)
          cargar(username, token, offset)
        }
  })
}

function guardarEnCSV(req, respuesta, pregunta, nickname, token) {
  meliObject.get('items/'+pregunta.item_id, {token: token}, (req2, item) => {
      meliObject.get('users/'+pregunta.from.id, {}, (req3, from) => {
          if (!(validador.errorEnPeticion(req, respuesta))) {
                var args = {  
                              item: pregunta.item_id, 
                              from: pregunta.from.id,
                              access_token: token,
                              sort: 'date_created_asc'
                            }
                meliObject.get('questions/search', args, (req2, preguntasPrevias) => {
                      var preguntasExt = ""
                      for (var i = 0; i < preguntasPrevias.length; i++) {
                            preguntasExt = preguntasPrevias[i].text + ","
                      }

                      var shipping = typeof item.shipping !== "undefined" ? item.shipping.mode : "" 
                      var row = "\n"+pregunta.id+","+nickname+","+_(item.seller_custom_field)+","+_(item.title)+","+_(item.permalink)+","+item.price+","+_(shipping)+","+_(item.listing_type_id)+","+pregunta.date_created+","+_(pregunta.text)+","+_(from.nickname)+","+from.points+","+_(from.permalink)+","+_(from.address.city)+",respuesta,"+preguntasPrevias.questions.length+","+preguntasExt
                      fs.appendFile("resultado/retorno.csv", row, "utf8", (err) =>{ if (err) console.log(err)})
                  })   
        }
        else {
          console.log("ERROR: Falló en la solicitud de item de la pregunta.")
          guardarEnCSV(req, respuesta, pregunta, nickname, token)
        }
      })
  })
}

function _(texto) {
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

  var str = ""
  if (texto)
    str = texto.replaceAll('"',"'") 
  
  return '"'+str+'"' 
}

function cargarPreguntasPrevias(req, respuesta, pregunta, username, token) {

  
}