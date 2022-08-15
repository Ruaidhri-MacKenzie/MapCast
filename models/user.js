const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
	locations: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Location' }],
	videos: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

module.exports = mongoose.model('User', UserSchema);
