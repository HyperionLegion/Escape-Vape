const express = require('express');
const { v4: uuidV4 } = require("uuid");
const router = express.Router();
const server = require("http").Server(router);
const io = require("socket.io")(server);
router.get("/", ensureAuthenticated, (req, res) => {
  res.redirect(`/rooms/${uuidV4()}`); //randomly creates a room link
});

router.get("/:room", ensureAuthenticated, (req, res) => {
  //render room link
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});
// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;

