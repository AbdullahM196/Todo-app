const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favoriteSchema = Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  todoes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "todo",
      },
    ],
    default:[]
  },
});
const favorite = mongoose.model("favorite", favoriteSchema);
module.exports = favorite;
