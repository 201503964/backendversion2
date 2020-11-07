const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');


//obtener roles
router.get('/getroles',(req,res) => {
  const { identificador} = req.body;
const valores=[  identificador];
  mysqlConnection.query('SELECT * FROM rol', (err, rows, fields) => {
      if(!err) {
        res.status(200).json(rows);
      } else {
        console.log(err);
        res.status(409).send({ message: 'Problema al solicitar roles.' });
      }
    });  
});


//asignar rol a usuario
router.post('/asignarrol',async  (req, res) => {

  const { CodigoUsuario,CodigoRol} = req.body;
  const val=[CodigoUsuario,CodigoRol];
  
  const query = `INSERT INTO asignacion_rol(CodigoUsuario,CodigoRol) VALUES (?,?)`;
  
  await mysqlConnection.query(query, val, (err, rows, fields) => {
    if(!err) {
      res.status(200).json({estado: true});
    } else {      
      console.log(err);
      res.status(409).send({ estado: false});
    }
  });
});

//obtener roles de usuario
router.get('/rolesasignados/:identificador',(req,res) => {
  let codusuario= req.params.identificador;
  mysqlConnection.query('select * from asignacion_rol where CodigoUsuario=?', codusuario,(err, rows, fields) => {
      if(!err) {
        res.status(200).json(rows);
      } else {
        console.log(err);
        res.status(409).send({estado: false});
      }
    });  
});


module.exports = router;