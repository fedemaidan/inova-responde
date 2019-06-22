var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificacionSchema = new Schema({
  resource: {
        type: String,
    },
  user_id: {
        type: String,
    },
  topic: {
        type: String,
  },
  application_id: {
  		type: String,
  },
  attempts: {
      type: String,
  },
  sent: {
      type: [Date],
  },
  received: {
      type: [Date],
  },
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);