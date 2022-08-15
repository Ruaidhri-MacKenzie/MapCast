const express = require("express");
const { userAuth } = require("../middleware/userAuth.js");
const controller = require("../controllers/apiController.js");

const router = express.Router();

router.post('/youtube', userAuth, controller.searchYouTube);

module.exports = router;
