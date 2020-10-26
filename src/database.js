const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'db-intermedias.csa30zxzsffq.us-east-2.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'pracIntermedias',
  database: 'baseDatosPracticas',
  multipleStatements: true  
});


mysqlConnection.connect(function (err, result) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('database is connected');
  }
});

module.exports = mysqlConnection;