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
          var row = "\n"+pregunta.id+","+nickname+","+item.seller_custom_field+","+item.title+","+item.permalink+","+item.price+","+item.shipping.mode+","+item.listing_type_id+","+pregunta.date_created+","+pregunta.text+","+from.nickname+","+from.points+","+from.permalink+","+from.address.city+",respuesta"
          fs.appendFile("resultado/retorno.csv", row, "utf8", (err) =>{ if (err) console.log(err)})
        
        }
        else {
          console.log("ERROR: Falló en la solicitud de item de la pregunta.")
          guardarEnCSV(req, respuesta, pregunta, nickname, token)
        }
      })
  })
}