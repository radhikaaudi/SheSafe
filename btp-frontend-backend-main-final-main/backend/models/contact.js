const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
});

const contactSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  contacts: [
    {
      name: String,
      phone: String,
      relation: String
    }
  ]
});

module.exports = mongoose.model("Contact", contactSchema);
