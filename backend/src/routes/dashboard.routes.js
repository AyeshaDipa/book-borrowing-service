const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {

    getDashboardStats

} = require("../controllers/dashboard.controller");

router.get(

    "/",

    verifyToken,

    getDashboardStats

);

module.exports = router;