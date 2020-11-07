const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');

//Ingreso Cliente
router.post('/insertClient', (req,res)=>{
    
    const { nombre,nit,dpi,direccion,codigosede } = req.body;
    const val=[ nombre,nit,dpi,direccion,codigosede ];
    const query = `INSERT INTO cliente(nombre,nit,dpi,direccion,codigosede) VALUES (?,?,?,?,?)`;

    mysqlConnection.query(query,val, (err, rows, fields) =>{
        if(!err){
            res.status(200).json({status:true});
        }else{
            console.log(err);
            res.status(409).send({message: 'Problema al agregar el cliente.'});
        }
    });

});

//Obtener todos los clientes
router.get('/getClients',(req,res)=>{
    mysqlConnection.query('SELECT * FROM cliente', (err, rows, fields) => {
        if(!err) {
          res.status(200).json(rows);
        } else {
          console.log(err);
          res.status(409).send({ message: 'Problema al solicitar clientes.' });
        }
      });  
});

//Obtener un cliente
router.get('/getOnlyClient',(req,res)=>{
    const { codigocliente } = req.body;
    const val = [codigocliente ];
    const query = 'SELECT * FROM cliente WHERE codigocliente = ? ';
    mysqlConnection.query(query, val,(err, rows, fields) => {
        if(!err){

            if( rows  == 0 ){
                res.status(200).json({status:'vacio'});
            }else{
                res.status(200).json(rows);
            }
            

        }else{
            console.log(err);
            res.status(409).send({message: 'Problema al agregar categorias.'});
        }
    });
});

//Eliminar un cliente
router.delete('/deleteClient',(req,res)=>{
    const { codigocliente } = req.body;
    const val = [codigocliente ];
    const query = 'delete from cliente WHERE codigocliente = ? limit 1';
    mysqlConnection.query(query,codigocliente, (err)=>{
        if(!err) {
            res.status(200).send({ status: true });
          } else {
            console.log(err);
            res.status(409).send({ status: false });
          }
    });
});

//Actualizar un cliente
router.post('/updateClient',(req, res)=>{

    const { codigocliente,nombre,nit,dpi,direccion,codigosede } = req.body;
    const val=[ codigocliente,nombre,nit,dpi,direccion,codigosede ];
    const query = 'select codigocliente,nombre,nit,dpi,direccion,codigosede from cliente where codigocliente = ? ';
    mysqlConnection.query(query,codigocliente,(err, rows, fields) => {
        if(!err) {

            if(rows==0){
                res.status(200).json({ status: 'vacio'});
            }else{
                let resul=rows[0];
                if( nombre == undefined )
                    nombre = result.nombre;
                if( nit == undefined )
                    nit = result.nit;
                if( dpi == undefined )
                    dpi = result.dpi;
                if( direccion == undefined )
                    direccion = result.direccion;
                if( codigosede == undefined )
                    codigosede = result.codigosede;
                
                let newArr = [nombre,nit,dpi,direccion,codigosede,codigocliente];

                const newQuery = 'update cliente set nombre = ? , nit = ? , dpi = ?, direccion = ?, codigosede = ? where codigocliente = ?';
                mysqlConnection.query(newQuery,newArr, (err, rows, fields) =>{

                    if(!err) {            
                        res.status(200).send({ status: true });
                    } else {
                        console.log(err);
                        res.status(409).send({ status: false });
                    }

                });
            }

        }else{
            console.log(err);
            res.status(409).send({ status: false });
        }
    });
});

module.exports = router;