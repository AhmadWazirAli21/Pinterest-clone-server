require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const connectDB = require('./db/connection')
const router = require('./routes/index')
const morgan = require('morgan');
const port  = process.env.PORT || 3000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname , 'public')))
app.use('/' , router)

connectDB(process.env.DB_URI);
app.listen(port , () => console.log("server run"))