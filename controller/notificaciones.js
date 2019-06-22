var meli 		= require('mercadolibre');
var client      = require('../config/mlClient'); 
var config      = require('../config/database'); 
var mongoose    = require('mongoose');
var Notificacion= require('../models/notificacion');

mongoose.connect(config.database);

module.exports.get = (req, res) => {
	Notificacion.find().limit(20).exec((err, notificaciones) => {
      res.json({success: true, data: notificaciones})
    })
}