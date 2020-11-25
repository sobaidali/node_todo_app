const express = require('express')
const router = new express.Router()
//routes
const userRoute = require('./userRoute')
const todoRoute = require('./todoRoute')

router.use('/dashboard', userRoute)
router.use('/todo', todoRoute)

module.exports = router