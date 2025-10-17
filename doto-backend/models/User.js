const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  userId: Number, // this will be auto-incremented
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// Apply the auto-increment plugin to userId
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('users', userSchema);

