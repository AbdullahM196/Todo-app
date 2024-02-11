const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleWare");
const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");

router.post("/add", protect, addCategory);
router.get("/getAll", protect, getCategories);
router.get("/:categoryId", protect, getCategoryById);
router.put("/:categoryId", protect, updateCategory);
router.delete("/:categoryId", protect, deleteCategory);
module.exports = router;
