/**
 * ORM Model for Broadcast Messages
 * The schema defines each message's structure
 */

const mongoose = require("mongoose");

const BroadcastSchema = mongoose.Schema(
  {
    _id: String, //message_id
    text: String, //message_content
    createdAt: String, //message_creation_time
    user: {
      _id: String, //sender_id
      name: String, //sender_name
      avatar: String //sender_photo
    },
    image: String //message_image_content
  },
  {
    strict: false //There may be some problems in type casting. So disable strict mode.
  }
);

module.exports = mongoose.model("Broadcasts", BroadcastSchema);
