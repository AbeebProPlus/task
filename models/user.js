const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  roles: {
    type: [Number], 
    enum: [1000, 2000, 5000], 
    default: [1000], 
  },
  businessType: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  refreshToken: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
