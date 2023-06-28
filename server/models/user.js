const mongoose = require("mongoose");
const cartItemSchema = require("./cartItem");

const userSchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
  email: {
    require: true,
    type: String,
    validate: {
      validator: (value) => {
        const re = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/;
        return value.match(re);
      },
      message: "Please enter a valid email"
    },
  },
  password: {
    require: true,
    type: String,
  },
  address: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "user"
  },
  cart: [cartItemSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
