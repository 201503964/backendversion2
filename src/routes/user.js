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
router.get('/login', (req, res) => {
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

//getUsuario
router.get('/getUsuario/:CodigoUsuario',(req,res) => {
  const {CodigoUsuario} = req.params;
  mysqlConnection.query('select u.CodigoUsuario,dpi,nombre,fechanac,correo,codigorol from usuario u left join  asignacion_rol a ON u.CodigoUsuario=a.CodigoUsuario where u.CodigoUsuario=?',CodigoUsuario, (err, rows, fields) => {
      if(!err) {
        if(rows==0){
          res.status(200).json({ status: 'vacio'});
        }else{
          let roles='' ;
          if(rows.length>1){          
            rows.forEach(e => {
              roles+=e.codigorol+",";
            });
          }
          let resul=rows[0];
          resul.codigorol=roles;
          res.status(200).json(resul);
        }
        
      } else {
        console.log(err);
        res.status(409).send({ status: false});
      }
    });  
});

//getUsuarios
router.get('/getUsuarios', (req,res) => {
  
  mysqlConnection.query('SELECT * FROM usuario',(err, rows, fields) => {
    if(!err) {
      res.status(200).json(rows);
    } else {
      console.log(err);
      res.status(409).send({ status: false });
    }
  });  
   
});

//eliminar usuario
router.delete('/deleteUser',(req,res) => {
  const {CodigoUsuario} = req.body;
  mysqlConnection.query('delete from usuario where CodigoUsuario=? limit 1 ',CodigoUsuario, (err) => {
      if(!err) {
        res.status(200).send({ status: true });
      } else {
        console.log(err);
        res.status(409).send({ status: false });
      }
    });  
});

//editar usuario
router.put('/updateUser',(req,res) => {
  let {CodigoUsuario,dpi,nombre,fechanac,correo,contraseña} = req.body;
  mysqlConnection.query('select CodigoUsuario,dpi,nombre,fechanac,correo,contraseña from usuario where CodigoUsuario=?',CodigoUsuario, (err, rows, fields) => {
    if(!err) {
      if(rows==0){
        res.status(200).json({ status: 'vacio'});
      }else{
        let resul=rows[0];
        if(dpi == undefined)
          dpi = resul.dpi;
        if(nombre == undefined)
          nombre = resul.nombre;
        if(fechanac == undefined)
          fechanac = resul.fechanac;
        if(correo == undefined)
          correo = resul.correo;
          
        let arr = [dpi,nombre,fechanac,correo,contraseña,CodigoUsuario];
        
        console.log(arr);
        //***********acutalizar
        mysqlConnection.query("UPDATE usuario set dpi=?, nombre=?, fechanac=?,"+
                        "correo=?, contraseña=?  where CodigoUsuario=?",arr, (err, rows, fields) => {
          if(!err) {            
            res.status(200).send({ status: true });
          } else {
            console.log(err);
            res.status(409).send({ status: false });
          }
        }); 
        //*********** */
      }
      } else {
        console.log(err);
        res.status(409).send({ status: false });
      }
    });  
});


module.exports = router;