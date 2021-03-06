
// 3.1 hacer el import de express de forma tradicional
// const express = require('express')

//3.2 hacer el import normal, agregamos el "type":"module", en el package.json
import Express, { response } from "express";

// im portar libreria de mongo, para poder conectarnos a la base de datos
import { MongoClient, ObjectId } from "mongodb";

// importar cors para la comunicacion entre el bak y el front
import Cors from "cors";


// String de conexion
const stringConexion = 'mongodb+srv://alramirez:alramirez@testproyectobd.nz3yg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


// instncia mongoclient para definir el cliente
const client = new MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Variable global
let baseDeDatos;


// poner app como funcion de express()
const app = Express();

// cuando nos llega una solicitud tipo json en un request, convierte el body en un abjeto que pdemos utilizar.
app.use(Express.json());

//usar el cors para la comunicacion al backend desde cualquier lado html etc
app.use(Cors());

// Peticion tipo GET en el link /Vehiculos
app.get('/vehiculos', (req, res)=>{
    console.log('alguien hizo get en la ruta /vehiculos');
    baseDeDatos.collection("vehiculo").find({}).limit(50).toArray((err, result)=>{
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
            baseDeDatos.collection('vehiculo').insertOne(datosVehiculo, (err, result)=>{
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

// Peticion tipo Pach en ekl link: /vehiculos/editar
app.patch('/vehiculos/editar', (req, res) => {
    const edicion = req.body;
    console.log(edicion);
    const filtroVehiculo = { _id: new ObjectId(edicion.id)};
    delete edicion.id;
    const operacion = {
        $set: edicion,
    };
    baseDeDatos.collection('vehiculo').findOneAndUpdate(filtroVehiculo, operacion, { upsert: true, returnOriginal: true }, (err, result) => {
        if (err){
            console.error("Error actualizando el vehiculo ", err);
            res.sendStatus(500);
        } else {
            console.log("Actualizado Con Exito");
            res.sendStatus(200);
        }
    });
});


// Peticion tipo DELETE en ekl link:
app.delete('/vehiculos/eliminar', (req, res) => {
    const filtroVehiculo = { _id: new ObjectId(req.body.id)};
    baseDeDatos.collection('vehiculo').deleteOne(filtroVehiculo, (err, result) => {
        if (err){
            console.error(err);
            response.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// primero se conecta a la base de datos y luiego retorna una escucha en el puerto 5000
const main = () =>{
    // conectarme a la base de datos
    client.connect((err, db)=>{
        if (err){
            console.error('Error conectando a la base de datos');
            return 'error';
        }
        baseDeDatos = db.db('concesionario');
        console.log('Conexion Exitosa');
        // 5. agregar puerto de escucha
        return app.listen(5000, () =>{
            console.log('Escuchando Puerto 5000')
        });
    });

};

main();
