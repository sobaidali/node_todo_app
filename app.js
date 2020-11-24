const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes/index')

const app = express()
//db
const db = require('./constants/constants').monogoURI
//connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to mongodb."))
    .catch(err => console.log(err))
//bodyparser
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
//routes
app.use(routes)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log("The server has started on ", PORT))