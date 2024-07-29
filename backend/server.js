const express = require('express')
const connection = require('./config/db')
const authRoutes = require('./Routes/autRoutes')
const classRoutes = require('./Routes/classRoutes')
const path = require('path')

const app = express()
const port = 8000

app.use(express.json())

app.use('/api/auth', authRoutes, classRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})