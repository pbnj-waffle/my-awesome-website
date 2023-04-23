let canvas;
let images = [];
let handleSize = 10;
let activeImage;
let maskedBg;
let buffer; //IMPORTANT to use to keep browser from crashing

function preload() {
  bg = loadImage('./images/test1.png', () => {
    // Create a copy of the original background image to use as the mask
    maskedBg = bg.get();
    // Invert the background image so it acts as a mask for the uploaded images
    maskedBg.filter(INVERT);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  const uploadImageButton = select('#uploadImage');
  uploadImageButton.mousePressed(() => select('#fileInput').elt.click());

  const fileInput = select('#fileInput');
  fileInput.input(fileSelected);

  buffer = createGraphics(windowWidth, windowHeight);
  bgBuffer = createGraphics(windowWidth, windowHeight);
}

function draw() {
  background(255); // Set the background to white, so the transparent areas of the bg image will be filled with white
  buffer.clear(); //IMPORTANT to use to keep browser from crashing
  bgBuffer.clear(); // Clear the bgBuffer
  bgBuffer.image(maskedBg, 0, 0, windowWidth, windowHeight); // Draw the masked background image onto bgBuffer

  let cursorType = ARROW;
  const framesBetweenTrail = 10;

  for (const imgData of images) {
    processImage(imgData);
    if (imgData.shouldDuplicate) duplicateImage(imgData);
    if (imgData.isDragging) {
      imgData.x = mouseX - imgData.offsetX;
      imgData.y = mouseY - imgData.offsetY;
    } else if (imgData.isResizing) {
      let newWidth = mouseX - imgData.x;
      let newHeight = mouseY - imgData.y;

      if (keyIsDown(SHIFT)) {
        newHeight = newWidth / imgData.aspectRatio;
      }

      imgData.width = newWidth;
      imgData.height = newHeight;
    } else if (imgData.shouldMove) {
      imgData.framesSinceLastTrail++;

      if (imgData.framesSinceLastTrail >= framesBetweenTrail) {
        // Save the current position in the trail
        imgData.trail.push({ x: imgData.x, y: imgData.y });
        imgData.framesSinceLastTrail = 0;
      }

      const speed = 0.001;
      imgData.noiseOffset += speed;

      // Perlin noise
      imgData.x = map(noise(imgData.noiseSeedX + imgData.noiseOffset), 0, 1, 0, windowWidth - imgData.width);
      imgData.y = map(noise(imgData.noiseSeedY + imgData.noiseOffset), 0, 1, 0, windowHeight - imgData.height);
    }
    // Define imgToDraw inside the loop
    const imgToDraw = imgData.processedImg || imgData.img;

    // Trail
    for (const trailPosition of imgData.trail) {
      buffer.image(imgToDraw, trailPosition.x, trailPosition.y, imgData.width, imgData.height);
    }

    // Main image
    buffer.image(imgToDraw, imgData.x, imgData.y, imgData.width, imgData.height);

    if (activeImage === imgData && !imgData.shouldMove && mouseX > imgData.x && mouseX < imgData.x + imgData.width && mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
      cursorType = MOVE;
    }
  }

  image(buffer, 0, 0); // Draw the buffer onto the main canvas
  blendMode(SCREEN); // Set the blend mode to screen
  image(bgBuffer, 0, 0); // Draw the bgBuffer onto the main canvas
  blendMode(BLEND); // Reset the blend mode

  if (activeImage) {
    drawHandle(activeImage);
  }

  cursor(cursorType);
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}