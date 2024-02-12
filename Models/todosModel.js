const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const todoSchema = new Schema(
  {
    title: String,
    body: String,
    img: {
      type: { url: String, public_id: String, _id: false },
      default: {
        url: "",
        public_id: "",
      },
    },
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
