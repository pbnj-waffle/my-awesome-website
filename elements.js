function drawMovingSquare(p) {
  // Update square position
  square.x += square.vx;
  square.y += square.vy;

  const edgeCollisionX = square.x < 0 || square.x + square.size > p.windowWidth;
  const edgeCollisionY = square.y < 0 || square.y + square.size > p.windowHeight;
  let edgeHit = false;

  // Check for collisions with the screen edges and reverse direction if necessary
  if (!square.stopped) {

    if (edgeCollisionX) {
      square.vx = -square.vx;
      const newAngle = p.random(-p.PI / 4, p.PI / 4);
      const speed = p.mag(square.vx, square.vy);
      square.vx = Math.sign(square.vx) * speed * Math.cos(newAngle);
      square.vy = speed * Math.sin(newAngle);
      edgeHit = true;
    }

    if (edgeCollisionY) {
      square.vy = -square.vy;
      const newAngle = p.random(-p.PI / 4, p.PI / 4);
      const speed = p.mag(square.vx, square.vy);
      square.vx = speed * Math.cos(newAngle);
      square.vy = Math.sign(square.vy) * speed * Math.sin(newAngle);
      edgeHit = true;
    }

    const edgeHitCooldownDistance = square.size * 0.5;

    if (edgeHit) {
      if (
        !square.lastEdgeHitPosition ||
        p.dist(square.x, square.y, square.lastEdgeHitPosition.x, square.lastEdgeHitPosition.y) > edgeHitCooldownDistance
      ) {
        square.edgeHits++; // Increment the edge hit counter
        console.log("Edge hit")
        square.lastEdgeHitPosition = { x: square.x, y: square.y }; // Update the last edge hit position
      }
    }

    // Check if the square should stop
    if (square.edgeHits >= square.edgeHitsToStop) {
      square.vx = 0;
      square.vy = 0;
      square.stopped = true;

    }
  }

  // Trail drawing logic
  const currentTime = p.millis();
  const timeSinceLastTrailSquare = currentTime - square.lastTrailSquareTime;
  const trailInterval = 150; // spacing

  if (timeSinceLastTrailSquare >= trailInterval) {
    squareTrailBuffer.noStroke();
    squareTrailBuffer.fill(...square.color);
    squareTrailBuffer.rect(square.x, square.y, square.size, square.size);

    square.lastTrailSquarePosition = { x: square.x, y: square.y };
    square.lastTrailSquareTime = currentTime; // Update the last trail square time
  }
}


function drawMainSquare(p) {
  // Draw the main square
  squareBuffer.fill(...square.color); // Update this line to use squareBuffer
  squareBuffer.noStroke(); // Update this line to use squareBuffer
  squareBuffer.rect(square.x, square.y, square.size, square.size); // Update this line to use squareBuffer
}