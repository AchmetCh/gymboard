const express = require('express')
const connection = require('./config/db')
const cors = require('cors')
const authRoutes = require('./Routes/autRoutes')
const classRoutes = require('./Routes/classRoutes')
const path = require('path')

// app.use(cors({
//     origin: ['https://gymboardlive.myrender.eu/'], // allow CORS only from this domain
//     credentials: true
//   }))
const app = express()
const port = 8000

app.use(express.json())
app.use(cors({origin: '*'}));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes, classRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})