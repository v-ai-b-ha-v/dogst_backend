// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: String,
  name: {
    type : String,
    default: 'Striver',    
},
  xp: {
    type: Number,
    default: 0,
  },
  petType: {
    type: String,
    default: 'Chihuahua', 
  },

  screenTimeToday: {
    type: Number,
    default: 150,
  },

  streak: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
  },
userTargetScreenTime: {
  type: Number,
  required: true
}


}, {
  timestamps: true,
});

userSchema.index({ xp: -1 });

module.exports = mongoose.model('User', userSchema);
