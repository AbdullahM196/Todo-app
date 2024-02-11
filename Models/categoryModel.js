const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  title: String,
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todo",
      default: [],
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
