const express = require('express');
const { userAuth } = require("../middleware/userAuth.js");
const controller = require('../controllers/videoController.js');

const router = express.Router();

router.post('/', userAuth, controller.createVideo);
router.get('/:id', userAuth, controller.deleteVideoById);

module.exports = router;
