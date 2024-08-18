const express = require('express');
const connection = require('./config/db');
const cors = require('cors');
const authRoutes = require('./Routes/autRoutes');
const classRoutes = require('./Routes/classRoutes');
const path = require('path');

const app = express();
const port = 8000;

app.use(express.json());

// CORS configuration

app.options('*', cors())
app.use(cors({
  origin: '*', // Allow multiple origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,x-auth-token',
  credentials: true, // Enable credentials if needed
  optionsSuccessStatus: 200
}));

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', classRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});