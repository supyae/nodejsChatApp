$(function() {
    var socket = io();

    var message = $("#message");
    var username = $("#username");
  	var send_message = $("#send_message");
  	var send_username = $("#send_username");
  	var chatroom = $("#chatroom");
  	var feedback = $("#feedback");

    // NOTE: emit change username event;
    send_username.click(function () {
      socket.emit('change_username', {username: username.val()});
    });

    // NOTE: emit send new message event;
    send_message.click(function () {
      socket.emit('new_message', {
        message: message.val()
      });
    });

    // NOTE: Listen new message coming
    socket.on('new_message', function (data) {
      console.log(username.val() + ' == ' + data.username);
      var msg = "message others";
      if (username.val() == data.username) {
        msg = "message mine";
      }
      console.log(msg);
      feedback.html('');
      message.val('');
      chatroom.append("<p class='"+msg+"'>" + data.username + " : " + data.message + "</p>");
    });

    // NOTE: emit typing message
    //Emit typing
    message.bind("keypress", function () {
      console.log('typing');
      socket.emit('typing');
    })

    // NOTE: listen typing message
    socket.on('typing', function (data) {
      feedback.html("<p><i>" + data.username + " is typing .....  " + "</i></p>");
    });

});
