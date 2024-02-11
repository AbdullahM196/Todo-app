const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const todoSchema = new Schema(
  {
    title: String,
    body: String,
    img: String,
    status: {
      type: String,
      default: "to-do",
      enum: ["toDo", "inProgress", "done"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  {
    timestamps: true,
  }
);
const todo = mongoose.model("todo", todoSchema);
module.exports = todo;
