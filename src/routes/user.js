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



module.exports = router;