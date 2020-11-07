const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');


//ingresar bodega
router.post('/bodega',  (req, res) => {

    const {nombre,direccion,estado,codigousuario,codigosede} = req.body;
    const val=[nombre,direccion,estado,codigousuario,codigosede];
    
    const query = `INSERT INTO bodega(nombre,direccion,estado,codigousuario,codigosede) VALUES (?,?,?,?,?)`;
    //console.log(req.body);
    mysqlConnection.query(query, val, (err, rows, fields) => {
      if(!err) {
        res.status(200).json({status: true});
      } else {      
        console.log(err);
        res.status(409).send({ status: false});
      }
    });
});


//actualizar bodega
router.put('/bodega',async  (req, res) => {

    const {codigobodega,nombre,direccion,estado,codigousuario,codigosede} = req.body;
    const val=[nombre,direccion,estado,codigousuario,codigosede,codigobodega];
    
    const query = `update bodega set nombre=?, direccion=?,estado=?,codigousuario=?,codigosede=? where codigobodega=?;`;
    await mysqlConnection.query(query, val, (err, rows, fields) => {
      if(!err) {
        res.status(200).json({status: true});
      } else {      
        console.log(err);
        res.status(409).send({ status: false});
      }
    });
  });

//eliminar bodega
router.delete('/bodega/:codigobodega',(req,res) => {
    const {codigobodega} = req.params;;
    mysqlConnection.query('delete from bodega where codigobodega=? limit 1 ',codigobodega, (err) => {
        if(!err) {
          res.status(200).send({ status: true });
        } else {
          console.log(err);
          res.status(409).send({ status: false });
        }
      });  
  });

//obtener bodegas
router.get('/bodega',(req,res) => {
    mysqlConnection.query('SELECT * FROM bodega', (err, rows, fields) => {
        if(!err) {
          res.status(200).json(rows);
        } else {
          console.log(err);
          res.status(409).send({ message: 'Problema al solicitar bodega.' });
        }
      });  
});

//botener una bodega
router.get('/bodega/:codigobodega',(req,res) => {
    const {codigobodega} = req.params;;
    mysqlConnection.query('select * from bodega where codigobodega=? limit 1 ',codigobodega, (err,rows) => {
        if(!err) {
            res.status(200).json(rows[0]);
        } else {
          console.log(err);
          res.status(409).send({ message: 'Problema al solicitar bodega' });
        }
      });  
  });

module.exports = router;