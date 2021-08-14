require('dotenv').config();

const Server = require('./models/server');

//instanciamos la clase Server
const server = new Server();

//Llamamos al método listen de la instancia server
server.listen();


 

 
