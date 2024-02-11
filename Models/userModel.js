const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function (value) {
      let reg = /^[a-zA-Z0-9.]{2,}@((gmail|yahoo|outlook)\.com)$/i;
      return reg.test(value);
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  Token: {
    type: String,
    default: "",
  },
  img: {
    type: String,
    default: "",
  },
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
