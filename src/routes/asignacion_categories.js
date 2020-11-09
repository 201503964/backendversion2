const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');

//Asignación Categoria
router.post('/assignCategory',(req,res) =>{
    const { codigoproducto,codigocategoria } = req.body;
    const val = [codigoproducto,codigocategoria];
    const query = 'insert into asignacion_categoria(codigoproducto,codigocategoria) values (?,?)';

    mysqlConnection.query(query,val,(err, rows, fields) =>{
        if(!err){
            res.status(200).json({status:true});
        }else{
            console.log(err);
            res.status(409).send({message: 'Problema al agregar categorias.'});
        }
    });

});

//Desasignacion Categoria
router.delete('/deleteAssignCategory',(req,res)=>{
    const {codigoproducto,codigocategoria} = req.body;
    const val = [codigoproducto,codigocategoria];
    const query = 'delete from asignacion_categoria WHERE codigoproducto = ? AND codigocategoria = ?';
    mysqlConnection.query(query,val, (err)=>{
        if(!err) {
            res.status(200).send({ status: true });
          } else {
            console.log(err);
            res.status(409).send({ status: false });
          }
    });
});

//Obtener categorias de los productos 
router.post('/getCategoryProduct',(req,res)=>{
    const {codigoproducto } = req.body;
    const val = [codigoproducto];
    const query = 'select c.codigocategoria, c.nombrecategoria, p.codigoproducto from categoria c, producto p, asignacion_categoria ac WHERE p.codigoproducto = ? AND c.codigocategoria = ac.codigocategoria AND p.codigoproducto = ac.codigoproducto'

    mysqlConnection.query(query,val,(err)=>{
        if(!err){

            if( rows  == 0 ){
                res.status(200).json({status:'vacio'});
            }else{
                res.status(200).json(rows);
            }
            

        }else{
            console.log(err);
            res.status(409).send({message: 'Problema al obtener categorias.'});
        }
    });

});

module.exports = router;