var UserML      = require('../models/userML');
const cargarPreguntas = require('../utils/cargarPreguntas')
const responder = require('../utils/responder')
const csv= require('csvtojson')
const fs = require('fs')


module.exports.create = function(req, res) {
	
	var csvFileHead = "ID-PREGUNTA, Cuenta propia, SKU Producto, Titulo producto, Link Producto, $ Producto, Forma de envio, Tipo de Publicacion, Fecha/hora: , Pregunta, USUARIO-Pregunta, Puntaje Usuario-Pregunta, Link a Perfil usuario que pregunta, Ubicacion del Usuario, Respuesta";
	
	fs.writeFile("resultado/retorno.csv", csvFileHead, (err) => {
	  if (err) console.log(err);
	});
  
  fs.writeFile("resultado/statusActualizar.csv", "Cuenta, Estado" , (err) => {
    if (err) console.log(err);
  });

	UserML.find( {} , (err, usersML) => {
        usersML.forEach( (cuenta) => {
          cargarPreguntas(cuenta.nickname, cuenta.token,0)
        })
    })

   res.json({success: true, message: "Se esta generando el CSV."}); 
}


module.exports.get = function(req, res) {
  res.download('resultado/retorno.csv', 'retorno.csv')
}


module.exports.status = async function(req, res) {
  var input = await fs.createReadStream("resultado/statusActualizar.csv", 'utf8')
  var jsonArrayActualizar = await csv({delimiter: ','}).fromStream(input)

  var cuentasActualizadas = 0

  for (var i = 0; i < jsonArrayActualizar.length; i++) {
      if (jsonArrayActualizar[i]["Estado"] == "GENERADO") {
        cuentasActualizadas++
      }
  }

  var inputResp = await fs.createReadStream("resultado/statusRespuestas.csv", 'utf8')
  var jsonArrayResp = await csv({delimiter: ','}).fromStream(inputResp)
  var respuestasConError = 0;
  var respuestasEnviadas = 0;
  console.log(jsonArrayResp)
  for (var i = 0; i < jsonArrayResp.length; i++) {
      if (jsonArrayResp[i]["Estado"] == "ANSWERED") {
        console.log(respuestasEnviadas)
        respuestasEnviadas++
      }
      else {
        respuestasConError++
      }
  }

  var jsonStatus = {
    cuentasActualizadas: cuentasActualizadas,
    respuestasEnviadas: respuestasEnviadas,
    respuestasConError: respuestasConError
  }
  console.log(jsonStatus)
  res.json(jsonStatus);
}


module.exports.post = async function (req,res) {
  fs.writeFile("resultado/statusRespuestas.csv", "Id Pregunta, Estado" , (err) => {
    if (err) console.log(err);
  }); 

  var input = await fs.createReadStream(req.files.file.path, 'utf8')
  var jsonArray = await csv({delimiter: ','}).fromStream(input)
  

  for (var i = 0; i < jsonArray.length; i++) { 
    var idPregunta= jsonArray[i]["ID-PREGUNTA"]
    var respuesta= jsonArray[i]["Respuesta"]
    var nickname= jsonArray[i]["Cuenta propia"]
    responder(nickname, idPregunta, respuesta)
  }
}