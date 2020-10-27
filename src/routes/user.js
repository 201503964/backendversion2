const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');

//obtener todos los usuarios
router.get('/user',(req,res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows, fields) => {
        if(!err) {
          res.status(200).json(rows);
        } else {
          console.log(err);
          res.status(409).send({ message: 'Problema al solicitar usuarios.' });
        }
      });  
});
//ingresar usuario
router.post('/user', (req, res) => {
  const { dpi,nombre,fechanac,correo,contraseña} = req.body;
  const val=[ dpi,nombre,fechanac,correo,contraseña];
  console.log(val);
  const query = `INSERT INTO usuario(dpi,nombre,fechanac,correo,contraseña) VALUES (?,?,?,?,?)`;
  
  mysqlConnection.query(query, val, (err, rows, fields) => {
    if(!err) {
      res.status(200).json({status: 'Usuario guardado'});
    } else {
      console.log(err);
      res.status(409).send({ message: 'Problema al registrarse.' });
    }
  });

});


module.exports = router;