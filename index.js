const mongoose = require('mongoose')
var cors = require('cors')
const todolist = require('./routes/todolist')
const express = require('express')
const helmet = require('helmet')
const app = express()

mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true })
    .then( () => console.log(' Successfully connected to mongoDB ') )
    .catch( err => console.error(' could not connect to db ') )

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use('/api/todolist', todolist)

const port = process.env.PORT || 8082
app.listen(port, () => console.log(`Listening on port ${port}...`))