const socket = io(); // Initialize the Socket.IO connection

$('#form').submit(function (e) {
  e.preventDefault(); // Prevent the form from refreshing the page
  const username = $('#username').val(); // Get the username
  const message = $('#input').val(); // Get the message
  const data = { username: username, message: message }; // Create a JSON object

  socket.emit('chat message', data); // Send the JSON object via Socket.IO
  $('#input').val(''); // Clear the message input field after sending
  return false; // For good measure
});

// Listen for messages from the server
socket.on('chat message', function (data) {
  const displayText = `${data.username}: ${data.message}`;
  $('#messages').append($('<li>').text(displayText)); // Append the message to the list
});
