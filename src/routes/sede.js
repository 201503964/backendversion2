const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');

//obtener sede
router.get('/getsede/:identificador',(req,res) => {
    let idprod= req.params.identificador;
    mysqlConnection.query('SELECT * FROM sede where codigosede=?', idprod,(err, rows, fields) => {
        if(!err) {
          res.status(200).json(rows);
        } else {
          console.log(err);
          res.status(409).send({ message: 'Problema al solicitar sede' });
        }
      });  
});

//obtener sedes
router.get('/getsedes',(req,res) => {
  const { identificador} = req.body;
const valores=[  identificador];
  mysqlConnection.query('SELECT * FROM sede', (err, rows, fields) => {
      if(!err) {
        res.status(200).json(rows);
      } else {
        console.log(err);
        res.status(409).send({ message: 'Problema al solicitar productos.' });
      }
    });  
});

//ingresar sede
router.post('/insertarsede',async  (req, res) => {

  const {aliassede,direccionsede,departamento,municipio,codigousuario} = req.body;
  const val=[aliassede,direccionsede,departamento,municipio,codigousuario];
  
  const query = `INSERT INTO sede(aliassede,direccionsede,departamento,municipio,codigousuario) VALUES (?,?,?,?,?)`;
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

//actualizar sede
router.post('/actualizarsede',async  (req, res) => {

  const { aliassede,direccionsede,departamento,municipio,codigousuario,codigosede} = req.body;
  const val=[aliassede,direccionsede,departamento,municipio,codigousuario,codigosede];
  
  const query = `UPDATE sede set aliassede=?, direccionsede=?, departamento=?, municipio=?, codigousuario=? where codigosede=?`;
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
router.delete('/borrarsede/:identificador',(req,res) => {
  let idsede= req.params.identificador;
  mysqlConnection.query('delete from sede where codigosede=?', idsede,(err, rows, fields) => {
      if(!err) {
        res.status(200).json({estado: true});
      } else {
        console.log(err);
        res.status(409).send({estado: false});
      }
    });  
});


module.exports = router;