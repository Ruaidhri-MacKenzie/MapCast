const express = require('express');
const { userAuth } = require("../middleware/userAuth.js");
const controller = require('../controllers/locationController.js');

const router = express.Router();

router.post('/', userAuth, controller.createLocation);
router.get('/:id', userAuth, controller.deleteLocationById);

module.exports = router;
