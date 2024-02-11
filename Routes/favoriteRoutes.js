const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleWare");
const {
  addFavorites,
  getFavorites,
  deleteFavorite,
} = require("../controllers/favoriteControllrs");
router.post("/add", protect, addFavorites);
router.get("/getAll", protect, getFavorites);
router.delete("/delete/:todoId", protect, deleteFavorite);
module.exports = router;
