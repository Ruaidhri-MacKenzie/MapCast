const Location = require('../models/location.js');
const User = require('../models/user.js');

const createLocation = async (req, res) => {
	try {
		const data = req.body;
		const location = await Location.create(data);
		const user = await User.findOne({ _id: req.session.userId })
			.select("locations")
			.exec();

		user.locations.push(location._id);
		await user.save();

		res.status(201).json({ location });
	}
	catch(error) {
		console.error(error.message);
		res.status(500).json({ error: "Error occurred while creating location" });
	}
};

const deleteLocationById = async (req, res) => {
	try {
		const _id = req.params.id;
		const location = await Location.findById(_id).exec();
		await User.updateOne({ _id: req.session.userId }, { "$pull": { "locations": location._id } }).exec();
		await location.remove();
		res.status(200).json({ success: true });
	}
	catch(error) {
		console.error(error.message);
		res.status(500).json({ error: "Error occurred while deleting location" });
	}
};

module.exports = {
	createLocation,
	deleteLocationById,
};
