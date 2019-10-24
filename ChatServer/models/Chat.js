/**
 * ORM Model for Chatroom Messages
 * The schema defines each chatroom's structure
 */

const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    sender: String, //sender_id
    reciever: String, //reciever_id
    messages: [
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
      }
    ]
  },
  {
    strict: false //There may be some problems in type casting. So disable strict mode.
  }
);

module.exports = mongoose.model("Chats", ChatSchema);
