const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const UserValidator = require("../util/validator/userValidator")
const { verifyToken } = require("../util/auth/jwt")

router.get("/viewUser",verifyToken, UserController.viewUser);
router.post("/addUser", UserValidator.registerUser, UserController.newUser);
router.put("/updateUser",verifyToken, UserController.updateUser)


module.exports = router;