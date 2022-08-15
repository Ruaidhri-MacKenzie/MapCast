const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	title: { type: String, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model('Video', VideoSchema);
