const express = require('express');
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

//Routes
router.get('/dashboard', dashboardController.homepage);



module.exports = router;
