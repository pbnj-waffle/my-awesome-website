let message = '';


function draw() {
  text(message, 25, 150);
}

function keyTyped() {
  message += key;
}