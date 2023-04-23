let canvas;
let images = [];
let handleSize = 10;
let activeImage;
let maskedBgs = []; // An array to store the masked background images
let currentBgFrame = 0; // Store the current frame index of the background animation
let buffer; //IMPORTANT to use to keep browser from crashing

function preload() {
  for (let i = 1; i <= 22; i++) { // Assuming there are 10 images in the sequence
    const img = loadImage(`./background/static (${i}).png`, () => {
      // Create a copy of the original background image to use as the mask
      const maskedImg = img.get();
      // Invert the background image so it acts as a mask for the uploaded images
      maskedImg.filter(INVERT);
      maskedBgs.push(maskedImg);
    });
  }
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
  currentBgFrame = (currentBgFrame + 1) % maskedBgs.length;
  bgBuffer.image(maskedBgs[currentBgFrame], 0, 0, windowWidth, windowHeight);

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