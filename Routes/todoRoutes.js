const {
  addTodo,
  getTodoes,
  getTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/TodoControllers");
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleWare");
const upload = require("../middleware/uploadImage");

router.post("/add", protect, upload.single("img"), addTodo);
router.get("/getAll", protect, getTodoes);
router.get("/:todoId", protect, getTodo);
router.put("/:todoId", protect, upload.single("img"), updateTodo);
router.delete("/:todoId", protect, deleteTodo);
module.exports = router;
