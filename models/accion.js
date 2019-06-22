var mongoose = require('mongoose');
var accionSchema = new mongoose.Schema({}, { strict: false })

module.exports = mongoose.model('Accion', accionSchema)