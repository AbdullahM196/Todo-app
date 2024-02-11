const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  profile,
  editProfile,
} = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleWare");
const upload = require("../middleware/uploadImage");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.put("/editProfile", protect, upload.single("img"), editProfile);
router.post("/logout", logout);

module.exports = router;
