const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  radius: { type: Number, required: true },
});

module.exports = mongoose.model('Location', LocationSchema);
