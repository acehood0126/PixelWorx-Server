const express = require("express");
const router = express.Router();
const {
  loginUser,
  editUser,
  viewUser,
} = require("../controllers/userController");
const { protectAuth } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.get("/view/:id", viewUser);
router.post("/edit", protectAuth, editUser);

module.exports = router;
