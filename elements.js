function drawMovingSquare() {
    // Update square position
    square.x += square.vx;
    square.y += square.vy;
  
    // Check for collisions with the screen edges and reverse direction if necessary
    if (square.x < 0 || square.x + square.size > windowWidth) {
      square.vx = random(-3, 3); // Assign a random value for vx
      square.vy = random(-3, 3); // Assign a random value for vy
    }
  
    if (square.y < 0 || square.y + square.size > windowHeight) {
      square.vx = random(-3, 3); // Assign a random value for vx
      square.vy = random(-3, 3); // Assign a random value for vy
    }
  
    if (!square.lastTrailSquarePosition || dist(square.x, square.y, square.lastTrailSquarePosition.x, square.lastTrailSquarePosition.y) >= squareTrailSpacing) {
      squareTrailBuffer.noStroke();
      squareTrailBuffer.fill(0,0,255);
      squareTrailBuffer.rect(square.x, square.y, square.size, square.size);
      square.lastTrailSquarePosition = { x: square.x, y: square.y }; // Update the last trail square position
    }
  }

function drawMainSquare() {
  // Draw the main square
  fill(random(0,0,255));
  noStroke();
  rect(square.x, square.y, square.size, square.size);
}