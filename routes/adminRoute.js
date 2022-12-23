const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");
const { verifyToken } = require("../util/auth/jwt")

router.get("/viewAdminUser",verifyToken, AdminController.viewAdminUser);
router.post("/addAdminUser", AdminController.registerAdminUser);
router.put("/updateAdminUser",verifyToken, AdminController.updateAdminUser)


module.exports = router;