
// 3.1 hacer el import de express de forma tradicional
// const express = require('express')

//3.2 hacer el import normal, agregamos el "type":"module", en el package.json
import Express from "express";

// im portar libreria de mongo, para poder conectarnos a la base de datos
import { MongoClient } from "mongodb";

// String de conexion
const stringConexion = 'mongodb+srv://alramirez:alramirez@testproyectobd.nz3yg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


// instncia mongoclient para definir el cliente
const client = new MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Variable global
let conexion;


// poner app como funcion de express()
const app = Express();

// cuando nos llega una solicitud tipo json en un request, convierte el body en un abjeto que pdemos utilizar.
app.use(Express.json());

// Peticion tipo GET en el link /Vehiculos
app.get('/vehiculos', (req, res)=>{
    console.log('alguien hizo get en la ruta /vehiculos');
    conexion.collection("vehiculo").find({}).limit(50).toArray((err, result)=>{
        if (err){
            res.status(400).send('Error Consultando los vehiculos');
        } else {
            res.json(result);
        }
    });
 });

// Peticion tipo POST en el link /vehiculos/nuevos
app.post('/vehiculos/nuevo', (req, res) =>{
    console.log(req);
    const datosVehiculo = req.body;
    console.log('Llaves: ', Object.keys(datosVehiculo));
    try{
        if (
            Object.keys(datosVehiculo).includes('nombre') && 
            Object.keys(datosVehiculo).includes('marca') && 
            Object.keys(datosVehiculo).includes('modelo')
            ){
            // implementar codigo para crear vehiculo creado a la BD
            conexion.collection('vehiculo').insertOne(datosVehiculo, (err, result)=>{
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                  } else {
                    console.log(result);
                    res.sendStatus(200);
                  }
            }); 
        } else {
            res.sendStatus(500);
        }
    }
    catch{
        res.sendStatus(500);
    }
});


// primero se conecta a la base de datos y luiego retorna una escucha en el puerto 5000
const main = () =>{
    // conectarme a la base de datos
    client.connect((err, db)=>{
        if (err){
            console.error('Erro conectando a la base de datos');
            return 'error';
        }
        conexion = db.db('concesionario');
        console.log('Conexion Exitosa');
        // 5. agregar puerto de escucha
        return app.listen(5000, () =>{
            console.log('Escuchando Puerto 5000')
        });
    });

};

main();
