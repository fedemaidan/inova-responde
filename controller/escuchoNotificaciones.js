var mongoose    = require('mongoose');
var Notificacion      = require('../models/notificacion');
var UserML      = require('../models/userML');
var Accion      = require('../models/accion');
var meli 		= require('mercadolibre');
var client      = require('../config/mlClient'); 
var meliObject	= new meli.Meli(client.id, client.secret);
var needle      = require('needle');

module.exports.escuchoNotificaciones = function (req, res ) {
	//guardarNotificacion(req, res)
  procesarAccion(req, res)
  res.json({success: true});
}

function procesarAccion(req, res) {
	UserML.findOne({
    	id_ml: req.body.user_id
  	  }, (err, user) => {
      if (user) {
			meliObject.get( req.body.resource, { access_token: user.token}, (request, datos ) => {
				//guardarDatosAccion(datos)
				ejecutarAccion(datos, user.id_cuenta)
			})
		}
	})
}

function ejecutarAccion(datos, cuenta_id) {

  //agregar pregunta al csv
  console.log(datos)
}