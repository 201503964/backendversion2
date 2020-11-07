const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');

//obtener producto
router.get('/getproducto/:identificador',(req,res) => {
    let idprod= req.params.identificador;
    mysqlConnection.query('SELECT * FROM producto where codigoproducto=?', idprod,(err, rows, fields) => {
        if(!err) {
          res.status(200).json(rows);
        } else {
          console.log(err);
          res.status(409).send({ message: 'Problema al solicitar producto' });
        }
      });  
});

//obtener productos
router.get('/getproductos',(req,res) => {
  const { identificador} = req.body;
const valores=[  identificador];
  mysqlConnection.query('SELECT * FROM producto', (err, rows, fields) => {
      if(!err) {
        res.status(200).json(rows);
      } else {
        console.log(err);
        res.status(409).send({ message: 'Problema al solicitar productos.' });
      }
    });  
});


//ingresar producto
router.post('/insertarproducto',async  (req, res) => {

  const { sku,codigobarras,nombreproducto,descripcion,precio} = req.body;
  const val=[ sku,codigobarras,nombreproducto,descripcion,precio];
  
  const query = `INSERT INTO producto(sku,codigobarras,nombreproducto,descripcion,precio) VALUES (?,?,?,?,?)`;
  console.log(req.body);
  await mysqlConnection.query(query, val, (err, rows, fields) => {
    if(!err) {
      res.status(200).json({estado: true});
    } else {      
      console.log(err);
      res.status(409).send({ estado: false});
    }
  });
});

//actualizar producto
router.post('/actualizarproducto',async  (req, res) => {

  const { sku,codigobarras,nombreproducto,descripcion,precio,codigoproducto} = req.body;
  const val=[ sku,codigobarras,nombreproducto,descripcion,precio,codigoproducto];
  
  const query = `UPDATE producto set sku=?, codigobarras=?, nombreproducto=?, descripcion=?, precio=? where codigoproducto=?`;
  await mysqlConnection.query(query, val, (err, rows, fields) => {
    if(!err) {
      res.status(200).json({estado: true});
    } else {      
      console.log(err);
      res.status(409).send({ estado: false});
    }
  });
});

//eliminar producto
router.delete('/borrarproducto/:identificador',(req,res) => {
  let idprod= req.params.identificador;
  mysqlConnection.query('delete from producto where codigoproducto=?', idprod,(err, rows, fields) => {
      if(!err) {
        res.status(200).json({estado: true});
      } else {
        console.log(err);
        res.status(409).send({estado: false});
      }
    });  
});


module.exports = router;