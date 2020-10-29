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
router.post('/user',async  (req, res) => {
  const { dpi,nombre,fechanac,correo,contraseña,roles} = req.body;
  const val=[ dpi,nombre,fechanac,correo,contraseña];
  const query = `INSERT INTO usuario(dpi,nombre,fechanac,correo,contraseña) VALUES (?,?,?,?,?)`;
  
  await mysqlConnection.query(query, val, (err, rows, fields) => {
    if(!err) {
    //roles
    if(roles ==undefined)
      res.status(200).json({status: true});
    else{  
      try {
        const rolesArray = roles.split(',');        
        rolesArray.forEach(element => {
        const query = `INSERT INTO asignacion_rol(CodigoUsuario,CodigoRol) VALUES ((select Codigousuario from usuario where dpi=? limit 1),?)`;
         mysqlConnection.query(query, [dpi,element], (err, rows, fields) => {
          if(!err) {
          } else {
            console.log(err);
          }
        });
      });      
      res.status(200).json({status: true});
      } catch (error) {
        
        res.status(409).send({ status: false});
      }
    }

    } else {      
      console.log(err);
      res.status(409).send({ status: false});
    }
  });
});

//login
router.post('/login', (req, res) => {
  const { correo, contraseña} = req.body;
  const val=[ correo, contraseña];
  console.log(val);
  const query = `SELECT * FROM usuario WHERE correo = ? AND contraseña=?`;
  
  mysqlConnection.query(query, val, (err, rows, fields) => {
    if(!err) {
      const usuario=rows[0];
      console.log('**',usuario);
      if(usuario==undefined){            
          res.status(409).send({ message: 'Error al ingresar credenciales.' });
      }
      res.status(200).json(usuario);
    } else {
      console.log(err);
      res.status(409).send({ message: 'Problemas al iniciar sesión.' });
    }
  });
});


module.exports = router;