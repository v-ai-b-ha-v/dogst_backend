const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();

// Middlewares

app.use(cors());
app.use(express.json());


// Routes
app.get('/',(req,res) =>{

    res.send("DOGST backend is working ");

});
app.use('/api/user', userRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  // Start server after DB is ready
  const PORT = process.env.PORT || 8000;
  app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

const admin = require('./config/firebase');

admin.auth().listUsers(1)
  .then(userRecords => console.log("Firebase Admin SDK working ✅"))
  .catch(err => console.error("Firebase Admin SDK error:", err));



