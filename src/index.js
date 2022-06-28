import { MongoClient } from 'mongodb';
import { app } from "./server.js";
import 'dotenv/config'

const port = process.env.PORT || 3001; 
const URI = process.env.MONGO_URI
export const client = new MongoClient(URI);

async function start(){
    try{
        await client.connect(); // 1. conectamos el cliente
        app.locals.ddbbClient = client; // 2. lo guardamos en el locals para que se acceda desde las rutas
        app.listen(port, () => console.log(`Servidor levantado en el puerto ${port}`));
    }catch(err){
        console.log('Error en el servidor: ', err);
    }
}


async function stop(){
    console.log('Cerrando el servidor');
    await client.close(); // cerramos al conexión con la BBDD
}

process.on('SIGINT', stop); // eventos del SO cuando hacemos ctrl+c
process.on('SIGTERM', stop);

start(); // lamamos a la función start que inicia todo (BBDD y Server de express)