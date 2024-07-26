const express = require('express');
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { isLoggedIn } = require('../middleware/checkAuth')

//Routes
router.get('/dashboard', isLoggedIn, dashboardController.homepage);



module.exports = router;
