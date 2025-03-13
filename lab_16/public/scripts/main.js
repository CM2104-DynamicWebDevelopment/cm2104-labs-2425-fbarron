const socket = io(); // Initialize the Socket.IO connection

// Join the selected room when the page loads
$(document).ready(function () {
  const room = $('#room').val();
  socket.emit('join room', room); // Notify the server of the selected room
});

// When the user selects a different room
$('#room').change(function () {
  const newRoom = $(this).val();
  socket.emit('join room', newRoom); // Notify the server of the new room
});

// Send a message to the selected room
$('#form').submit(function (e) {
  e.preventDefault(); // Prevent form from refreshing the page
  const username = $('#username').val();
  const message = $('#input').val();
  const room = $('#room').val(); // Get the selected room
  const data = { username: username, message: message, room: room }; // Include the room in the data

  socket.emit('chat message', data); // Send the message to the server
  $('#input').val(''); // Clear the message input field
  return false;
});

// Receive and display messages for the current room
socket.on('chat message', function (data) {
  const displayText = `${data.username} [${data.room}]: ${data.message}`;
  $('#messages').append($('<li>').text(displayText)); // Append the message to the list
});
