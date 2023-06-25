const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  _id: String,
  session: Object,
  expires: Date,
});

const SessionModel = mongoose.model('Session', sessionSchema);

module.exports = SessionModel;
