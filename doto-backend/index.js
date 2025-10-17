const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/auth');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const taskRoutes = require('./routes/tasks')

app.use(cors({
  origin: 'http://localhost:4200' 
}));

app.use(express.json()); // Parses JSON bodies

mongoose.connect(MONGO_URL, {
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB error:', err));

app.use('/user', userRoutes);
app.use('/tasks', taskRoutes)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



