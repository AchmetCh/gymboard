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
app.use(cors({
  origin: 'https://gymboardlive.myrender.eu', // Allow only this domain
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization,x-auth-token', // Add x-auth-token header
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