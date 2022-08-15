const Video = require('../models/video.js');
const User = require('../models/user.js');

const createVideo = async (req, res) => {
	try {
		const data = req.body;
		const video = await Video.create(data);
		const user = await User.findOne({ _id: req.session.userId })
			.select("videos")
			.exec();

		user.videos.push(video._id);
		await user.save();

		res.status(201).json({ video });
	}
	catch(error) {
		console.error(error.message);
		res.status(500).json({ error: "Error occurred while creating video" });
	}
};

const deleteVideoById = async (req, res) => {
	try {
		const _id = req.params.id;
		const video = await Video.findById(_id).exec();
		await User.updateOne({ _id: req.session.userId }, { "$pull": { "videos": video._id } }).exec();
		await video.remove();
		res.status(200).json({ success: true });
	}
	catch(error) {
		console.error(error.message);
		res.status(500).json({ error: "Error occurred while deleting video" });
	}
};

module.exports = {
	createVideo,
	deleteVideoById,
};
