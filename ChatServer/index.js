const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const User = require("./models/User");
const bodyParser = require("body-parser");

require("dotenv/config");

const port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

app.post("/login", (req, res) => {
  const query = User.find({ id: req.body.id });
  query
    .exec()
    .then(data => {
      if (data.length === 0) {
        const user = new User({
          name: req.body.name,
          id: req.body.id,
          photo: req.body.photo
        });

        user
          .save()
          .then(data => {
            res.json(data);
          })
          .catch(error => {
            res.json(error);
          });
      } else {
        res.json(data[0]);
      }
    })
    .catch(error => {
      res.json(error);
    });
});

app.get("/find/:id", (req, res) => {
  const user = User.find({ id: req.params.id });
  user.exec().then(data => {
    res.json(data[0]);
  });
});

app.get("/users/active", (req, res) => {
  const users = User.find({ isActive: true });
  users.exec().then(data => {
    res.json(data);
  });
});

app.get("/users/inactive", (req, res) => {
  const users = User.find({ isActive: false });
  users.exec().then(data => {
    res.json(data);
  });
});

var clients = [];

io.on("connection", socket => {
  console.log("New User Connected");
  socket.on("storeClientInfo", function(data) {
    console.log(data.customId + " Connected");
    var clientInfo = new Object();
    clientInfo.customId = data.customId;
    clientInfo.clientId = socket.id;
    clients.push(clientInfo);
    const res = User.updateOne({ id: data.customId }, { isActive: true });
    res.exec().then(() => {
      console.log("Activated " + data.customId);
      socket.emit("update", "Updated");
      console.log("emmited");
    });
  });

  socket.on("disconnect", function(data) {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];

      if (c.clientId == socket.id) {
        clients.splice(i, 1);
        console.log(c.customId + " Disconnected");
        const res = User.updateOne({ id: c.customId }, { isActive: false });
        res.exec().then(data => {
          console.log("Deactivated " + c.customId);
          socket.emit("updateActiveList", "Updated");
        });
        break;
      }
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
