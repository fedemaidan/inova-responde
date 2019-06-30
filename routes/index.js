const express 				= require('express');
const router 				= express.Router();
var agregarCuentaController = require('../controller/agregarCuenta.js'); 
var datosCuenta = require('../controller/datosCuenta.js'); 
var csv						= require('../controller/csv.js');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.get('/cuentas', 			datosCuenta.cuentas);

router.get('/iniciarConML', 	agregarCuentaController.iniciarMl);
router.get('/auth_ml', 			agregarCuentaController.authMl);

router.get('/csv/preguntas', 			csv.get);
router.post('/csv/preguntas', multipartMiddleware, csv.post);

router.get('/csv/create', 				csv.create );
router.get('/csv/status', 				csv.status );

module.exports = router;