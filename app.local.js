var cron = require('node-cron');
const fs = require('fs')

const app = require('./app')
var refrescarToken = require('./utils/refrescarToken')


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

fs.writeFile("resultado/statusActualizar.csv", "Cuenta, Estado", (err) => {
    if (err) console.log(err);
  });

fs.writeFile("resultado/statusRespuestas.csv", "Id Pregunta, Estado" , (err) => {
    if (err) console.log(err);
  });

cron.schedule('* * * * *', function(){
  refrescarToken()
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
