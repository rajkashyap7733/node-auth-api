const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const morgan = require('morgan');
const pool = require("./config")
const colors = require("colors")

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json())
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

pool.query(`SELECT 1`).then(()=>{
    console.log("DB Connected".bgCyan.white);
}).catch((error)=>{
    console.log(error);
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`.bgMagenta.white);
});
