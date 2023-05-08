let canvas;
let images = [];
let handleSize = 10;
let activeImage;
let maskedBgs = []; // An array to store the masked background images
let currentBgFrame = 0; // Store the current frame index of the background animation
let buffer; //IMPORTANT to use to keep browser from crashing
let topBuffer;
let square;
let squareTrail = [];
let squareTrailSpacing = 50;
let lastTrailSquareTime = 0;
let differenceBuffer;
const ARROW = 'default';
const RESIZE_EW = 'ew-resize';
const RESIZE_NS = 'ns-resize';
const RESIZE_NWSE = "nwse-resize";
const RESIZE_NESW = "nesw-resize";

let cursorType = ARROW;
let resizeCursorType = ARROW;

function preload() {
  for (let i = 1; i <= 200; i++) { 
    const img = loadImage(`./bg27/bg27 (${i}).png`, () => {
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
  differenceBuffer = createGraphics(windowWidth, windowHeight);

  const uploadImageButton = select('#uploadImage');
  uploadImageButton.mousePressed(() => select('#fileInput').elt.click());

  const fileInput = select('#fileInput');
  fileInput.input(fileSelected);

  const saveImageButton = select('#saveImage');
  saveImageButton.mousePressed(saveImageToFile);

  buffer = createGraphics(windowWidth, windowHeight);
  topBuffer = createGraphics(windowWidth, windowHeight);
  noBlendImagesBuffer = createGraphics(windowWidth, windowHeight);
  bgBuffer = createGraphics(windowWidth, windowHeight);
  frameRate(100);

  square = {
      x: random(windowWidth - 50),
      y: random(windowHeight - 50),
      size: 50,
      vx: random(-3, 3),
      vy: random(-3, 3),
      lastTrailSquarePosition: null // Add this line
    };
    squareTrailBuffer = createGraphics(windowWidth, windowHeight);
    squareTrailBufferBlend = createGraphics(windowWidth, windowHeight);
  }

function saveImageToFile() {
    saveCanvas('myCanvas', 'jpg');
  }

function draw() {
  background(0); 
  topBuffer.clear();
  buffer.clear(); // IMPORTANT to use to keep browser from crashing
  bgBuffer.clear(); // Clear the bgBuffer
  currentBgFrame = (currentBgFrame + 1) % maskedBgs.length;
  bgBuffer.image(maskedBgs[currentBgFrame], 0, 0, windowWidth, windowHeight);

  let cursorType = ARROW;
  const framesBetweenTrail = 10;

  for (const imgData of images) {
    processImage(imgData);

    if (activeImage === imgData) {
      drawFrame(imgData);
    }
    if (imgData.shouldDuplicate) duplicateImage(imgData);

    if (imgData.isDragging) { // DRAGGING
      imgData.x = mouseX - imgData.offsetX;
      imgData.y = mouseY - imgData.offsetY;
    } 

    if (imgData.blendWithBg) {
      differenceBuffer.image(imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
    } else {
      noBlendImagesBuffer.image(imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
    }
    
    // RESIZING
    if (imgData.isResizingLeft) {
      imgData.width += imgData.x - mouseX;
      imgData.x = mouseX;
    } else if (imgData.isResizingRight) {
      imgData.width = mouseX - imgData.x;
    }

    if (imgData.isResizingTop) {
      imgData.height += imgData.y - mouseY;
      imgData.y = mouseY;
    } else if (imgData.isResizingBottom) {
      imgData.height = mouseY - imgData.y;
    }

    if (imgData.isResizingTopLeft) {
      const prevWidth = imgData.width;
      const prevHeight = imgData.height;
      imgData.width += imgData.x - mouseX;
      imgData.height += imgData.y - mouseY;

      if (keyIsDown(SHIFT)) {
        imgData.height = imgData.width / imgData.aspectRatio;
      }

      imgData.x -= imgData.width - prevWidth;
      imgData.y -= imgData.height - prevHeight;
    } else if (imgData.isResizingTopRight) {
      const prevHeight = imgData.height;
      imgData.width = mouseX - imgData.x;
      imgData.height += imgData.y - mouseY;

      if (keyIsDown(SHIFT)) {
        imgData.height = imgData.width / imgData.aspectRatio;
      }

      imgData.y -= imgData.height - prevHeight;
    } else if (imgData.isResizingBottomLeft) {
      const prevWidth = imgData.width;
      imgData.width += imgData.x - mouseX;
      imgData.height = mouseY - imgData.y;

      if (keyIsDown(SHIFT)) {
        imgData.width = imgData.height * imgData.aspectRatio;
      }

      imgData.x -= imgData.width - prevWidth;
    } else if (imgData.isResizingBottomRight) {
      imgData.width = mouseX - imgData.x;
      imgData.height = mouseY - imgData.y;

      if (keyIsDown(SHIFT)) {
        const currentAspectRatio = imgData.width / imgData.height;
        imgData.height = imgData.width / currentAspectRatio;
      }
    }

     if (imgData.shouldMove) { // MOVE
      imgData.framesSinceLastTrail++;

      if (imgData.framesSinceLastTrail >= framesBetweenTrail) {
        // Save the current position in the trail
        imgData.trail.push({ x: imgData.x, y: imgData.y });
        imgData.framesSinceLastTrail = 0;
      }

      const speed = 0.001;
      imgData.noiseOffset += speed;

      // Perlin noise for moving
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
  differenceBuffer.image(imgToDraw, imgData.x, imgData.y, imgData.width, imgData.height);

  if (activeImage === imgData && !imgData.shouldMove && mouseX > imgData.x && mouseX < imgData.x + imgData.width && mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
    cursorType = MOVE;
    }
  }
  
  if (activeImage) {
    drawFrame(activeImage);
  }

  if (activeImage) {
    updateCursor(activeImage);
    cursor(resizeCursorType);
  } else {
    cursor(ARROW);
  }

  image(buffer, 0, 0); // Draw the buffer onto the main canvas
  blendMode(OVERLAY); // Set the blend mode to screen
  image(bgBuffer, 0, 0); // Draw the bgBuffer onto the main canvas

  blendMode(BLEND); // Reset the blend mode to BLEND before drawing the squareTrailBuffer
  image(noBlendImagesBuffer, 0, 0);

  blendMode(BLEND); // Reset the blend mode to BLEND before drawing the squareTrailBuffer
  image(squareTrailBuffer, 0, 0); // Draw the squareTrailBuffer

  blendMode(DIFFERENCE); // Reset the blend mode to DIFFERENCE for the images
  image(differenceBuffer, 0, 0); // Draw the differenceBuffer onto the main canvas
 
  drawMovingSquare();
  drawMainSquare(); // Add this line to draw the main square
  image(noBlendImagesBuffer, 0, 0);
  image(topBuffer, 0, 0); // Add this line to draw the topBuffer onto the main canvas
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}