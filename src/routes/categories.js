const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');

//Obtener todas las categorias
router.get('/categories',(req,res) => {
    mysqlConnection.query('SELECT * FROM categoria', (err, rows, fields) => {
        if(!err) {
          res.status(200).json(rows);
        } else {
          console.log(err);
          res.status(409).send({ message: 'Problema al solicitar categorias.' });
        }
      });  
});

//Ingreso categoría
router.post('/agregateCategory', (req, res) =>{

    const { nombrecategoria,descripcioncategoria } = req.body;
    const val=[ nombrecategoria,descripcioncategoria];
    const query = `INSERT INTO categoria(nombrecategoria,descripcioncategoria) VALUES (?,?)`;
    
    mysqlConnection.query(query, val, (err, rows, fields) =>{
        if(!err){
            res.status(200).json({status:true});
        }else{
            console.log(err);
            res.status(409).send({message: 'Problema al agregar categorias.'});
        }
    });
    
});

//Obtener categoría
router.get('/getOnlyCategory',(req,res) => {
    const { codigocategoria } = req.body;
    const val = [codigocategoria ];
    const query = 'SELECT * FROM categoria WHERE codigocategoria = ? ';
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

//Eliminar categorías
router.delete('/deleteCategory',(req,res) => {
    const { codigocategoria } = req.body;
    const val = [codigocategoria ];
    const query = 'delete from categoria WHERE codigocategoria = ? limit 1';
    mysqlConnection.query(query,codigocategoria, (err)=>{
        if(!err) {
            res.status(200).send({ status: true });
          } else {
            console.log(err);
            res.status(409).send({ status: false });
          }
    });
});

//Modificar categorias
router.post('/updateCategory',(req, res)=>{

    const { codigocategoria,nombrecategoria,descripcioncategoria } = req.body;
    const val=[ codigocategoria,nombrecategoria,descripcioncategoria];
    const query = 'select codigocategoria,nombrecategoria,descripcioncategoria from categoria where codigocategoria = ? ';
    mysqlConnection.query(query,codigocategoria,(err, rows, fields) => {
        if(!err) {

            if(rows==0){
                res.status(200).json({ status: 'vacio'});
            }else{
                let resul=rows[0];
                if( nombrecategoria == undefined )
                    nombrecategoria = result.nombrecategoria;
                if( descripcioncategoria == undefined )
                    descripcioncategoria = result.descripcioncategoria;
                
                let newArr = [nombrecategoria,descripcioncategoria,codigocategoria];

                const newQuery = 'update categoria set nombrecategoria = ? , descripcioncategoria = ? where codigocategoria = ?';
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