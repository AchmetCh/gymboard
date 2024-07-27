const express = require('express')
const connection = require('./config/db')
const authRoutes = require('./Routes/autRoutes')
const app = express()
const port = 8000

app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})