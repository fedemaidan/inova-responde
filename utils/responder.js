var UserML      = require('../models/userML');
var meli 		= require('mercadolibre');
var client      = require('../config/mlClient'); 
var meliObject	= new meli.Meli(client.id, client.secret);
const fs = require('fs')

module.exports = (nickname, idPregunta, respuesta) => {
	UserML.findOne({
	    nickname: nickname
	  }, function(err, user) {
	    if (err) throw err;
	    
	    if (!user) {
          	fs.appendFile("resultado/statusRespuestas.csv", "\n"+idPregunta+",nickname no encontrado "+nickname, "utf8", (err) =>{ if (err) console.log(err)})
	    } else {

	      meliObject.post('answers?access_token='+user.token, { question_id: idPregunta, text: respuesta }, {} , 
	        (req2, pregunta) => {
	          	fs.appendFile("resultado/statusRespuestas.csv", "\n"+idPregunta+","+pregunta.status, "utf8", (err) =>{ if (err) console.log(err)})
	        })
	    }
	  });
}