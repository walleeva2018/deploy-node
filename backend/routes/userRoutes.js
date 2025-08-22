const express = require("express");
const { userController } = require("../controllers/userController");

const router = express.Router();

// Welcome and home routes
router.get("/", userController.getWelcome);
router.get("/home", userController.getHome);

// Authentication routes
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

// User CRUD routes
router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser); // Legacy route

module.exports = router;