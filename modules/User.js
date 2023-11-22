const mongoose = require("mongoose");

const userData = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have a email"],
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
    },
    phone: {
      type: String,
      required: [true, "A user must have a phone number"],
    },
    token: {
      type: String,
      required: [true, "A user must have a token"],
    },
    role: {
      type: String,
      required: [true, "A user must have a role"],
    },
    employees: {
      type: String,
      required: [true, "A user must have a employees"],
    },
    business: {
      type: String,
      required: [true, "A user must have a business title"],
    },
    business_subject: {
      type: String,
      required: [true, "A user must have a business subject"],
    },
    target: {
      type: String,
      required: [true, "A user must have a target"],
    },
    page: {
      type: String,
      required: [true, "A user must have a page"],
    },
    biography: {
      type: String,
      required: [true, "A user must have a biography"],
    },
    active: {
      type: String,
      required: [true, "A user must have a active"],
    }
  },
  { collection: "users" }
);

const User = mongoose.model("User", userData);

module.exports = User;