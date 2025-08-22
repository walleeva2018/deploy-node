const express = require("express");
const { userController } = require("../controllers/userController");

const router = express.Router();


router.get("/", userController.getWelcome);
router.get("/home", userController.getHome);


router.post("/signup", userController.signup);
router.post("/signin", userController.signin);


router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser); 

module.exports = router;