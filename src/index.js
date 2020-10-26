const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

//configuraciones
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//rutas
app.get('/', (req,res) => {
    res.send('API gifthub');
});

app.use(require('./routes/user'));

//conexión con la base de datos
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});