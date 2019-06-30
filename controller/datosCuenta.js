var meli 		= require('mercadolibre');
var client      = require('../config/mlClient'); 
var config      = require('../config/database'); 
var mongoose    = require('mongoose');
var UserML      = require('../models/userML');

mongoose.connect(config.database);


module.exports.dameToken = function (req, res ) {
    UserML.findOne( {  }, 'token', function (err, user) {
    	if (err) res.json({success: false, msg: 'Hubo un problema con ML para registrar la cuenta. Por favor pruebe mas tarde'});
    	else res.json({success: true, token: user.token });
	})  
}


module.exports.cuentas = (req, res ) => {
  UserML.find( { } , (err, usersML) => {
    res.json({success: true, data: usersML})
  })

}



