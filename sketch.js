let canvas;
let bgColor;
let transitionSpeed = 0.01; 
let targetColor;
let images = [];
let handleSize = 10;
let activeImage;
let buffer; //IMPORTANT to use to keep browser from crashing
let squareTrailBuffer;
let squareBuffer;
let blurredBgBuffer = null;
let bgBuffer;
let square;
let squareTrail = [];
let sketchInstance;
let mouseOver3DObject = false;
let textInputMode = false;
let inputField;
let letters = [];
let textSizeSlider;
var clickCounter = 0;
var currentMarquee = 0;
let isBlackBg = true; 
let isBgAnimationEnabled = true; 
let showFullScreenImage = false;
let fullScreenImage = null;
const closingIconSize = 50;
let imageTexts;
let fullScreenImageText = '';
let isMousePressedOn3D = false;
let clickedImageData = null;
let isBlurApplied = false;
let canvasHeight;
let bgImagesNames = ["thunder.png", "thunder.png"];
let bgImages = [];
let chosenBgImage;
let videoNames = ["1.mp4", "3.mp4"];
let bgVideos = [];
let chosenVideo;

const ARROW = 'default';
const RESIZE_EW = 'ew-resize';
const RESIZE_NS = 'ns-resize';
const RESIZE_NWSE = "nwse-resize";
const RESIZE_NESW = "nesw-resize";
let cursorType = ARROW;



document.addEventListener('click', function () {
  clickCounter++;

  if (clickCounter >= 10) { //the amount of clicks
    toggleTransition();
  }
});



const sketch2D = (p) => {
  sketchInstance = p;
  canvasHeight = p.windowWidth * 1.5;
  p.mousePressed = () => {
    mousePressed(p);
  };
  
  p.mouseReleased = () => {
    mouseReleased(p);
  };

  p.preload = () => {
    /*for (let i = 0; i < videoNames.length; i++) {
      let video = p.createVideo(videoNames[i]);
      bgVideos.push(video);
    }*/
    for (let i = 0; i < bgImagesNames.length; i++) {
      let img = p.loadImage(bgImagesNames[i]);
      bgImages.push(img);
  }
    //bgImage = p.loadImage('./bg.png');
    imageTexts = p.loadJSON('imageTexts.json');
    myFont = p.loadFont('Sprat-Regular.otf');
    for (let i = 1; i <= 7; i++) { 
      const img = p.loadImage(`./images/img (${i}).png`, () => {
          imageLoaded(img, p, `img (${i})`);
      });
    }
  }
  
  
  p.setup = () => {
    
    
    bgColor = p.color(0);
    targetColor = p.color(0, 0, 0);
    const canvas2D = p.createCanvas(p.windowWidth, canvasHeight); // Store the canvas
    canvas2D.parent('canvasContainer');
    buffer = p.createGraphics(p.windowWidth, canvasHeight);
    squareTrailBuffer = p.createGraphics(p.windowWidth, canvasHeight);
    squareBuffer = p.createGraphics(p.windowWidth, canvasHeight);
    bgBuffer = p.createGraphics(p.windowWidth, canvasHeight);
    blurredBgBuffer = p.createGraphics(p.windowWidth, canvasHeight);
    
    /*const randomIndex = Math.floor(p.random(bgVideos.length));
    chosenVideo = bgVideos[randomIndex];
    chosenVideo.volume(0);  // Mute the video by setting volume to 0
    chosenVideo.loop();
    chosenVideo.hide();*/

    const randomIndex = Math.floor(p.random(bgImages.length));
    chosenBgImage = bgImages[randomIndex];

    if (Math.random() > 0.8) {
      square = {
        x: p.random(p.windowWidth - 50),
        y: p.random(canvasHeight - 50),
        size: 50,
        vx: p.random(-3, 3),
        vy: p.random(-3, 3),
        color: [p.random(255), p.random(255), p.random(255)],
        lastTrailSquarePosition: null,
        lastTrailSquareTime: 0,
        direction: p.createVector(p.random(-1, 1), p.random(-1, 1)).normalize(),
        stopped: false,
        edgeHits: 0,
        edgeHitsToStop: 0,
        lastEdgeHitPosition: null,
      };
       
      square.edgeHitsToStop = p.random([15, 30, 45, 60, 75]);
    }
      squareTrailBuffer = p.createGraphics(p.windowWidth, canvasHeight);
      squareTrailBufferBlend = p.createGraphics(p.windowWidth, canvasHeight);
      squareBuffer = p.createGraphics(p.windowWidth, canvasHeight);
    
  }
  
    p.draw = () => {
      let overAnyImage = false;
      if (showFullScreenImage) {
        // Draw the blurred buffer only when isBlurApplied is true
        if(isBlurApplied) {
            p.image(blurredBgBuffer, 0, 0, p.windowWidth, canvasHeight);
        }
    
        // Draw the non-blurred image and other UI elements...
        const aspectRatio = fullScreenImage.width / fullScreenImage.height;
        const imageWidth = p.windowWidth / 2; 
        const displayHeight = Math.min(canvasHeight, imageWidth / aspectRatio);
        const imageX = 45;
        const imageY = Math.max(0, Math.min(canvasHeight - displayHeight, clickedImageData.clickY - displayHeight / 2));
        p.image(fullScreenImage, imageX, imageY, imageWidth, displayHeight);
    
        // Draw the associated text on the right half of the screen
        const textStart = p.windowWidth / 2 + 100; 
        const textWidth = p.windowWidth / 2 - 100; 
        p.textFont(myFont); 
        p.textSize(24);
        p.textAlign(p.LEFT, p.TOP); 
        p.text(fullScreenImageText, textStart, clickedImageData.clickY, textWidth);
        p.fill(255); 
    
        // Draw closing icon
        p.push(); 
        p.stroke(255);
        p.strokeWeight(4);
        iconX = ( p.windowWidth - 20 ) - closingIconSize; // make this a global variable
        iconY = imageY;  // Adjust the iconY to match the top of the image. Make this a global variable too.
        p.line(iconX, iconY, iconX + closingIconSize, iconY + closingIconSize);
        p.line(iconX + closingIconSize, iconY, iconX, iconY + closingIconSize);
        p.pop();
        console.log("blurred")
      } else {
        isBlurApplied = false;
        bgColor = p.lerpColor(bgColor, targetColor, transitionSpeed);
        p.background(bgColor);
        bgBuffer.clear(); // Clear bgBuffer here, after checking showFullScreenImage
        p.image(chosenBgImage, 0, 0, p.windowWidth, canvasHeight);
      //currentBgFrame = (currentBgFrame + 1) % maskedBgs.length;
     // bgBuffer.image(maskedBgs[currentBgFrame], 0, 0, p.windowWidth, canvasHeight);

    // TEXT
    p.fill(255);
    for (const letter of letters) {
      p.text(letter.char, letter.x, letter.y);
      updateLetter(p, letter);
    }
  
    for (let letter of letters) {
      updateLetter(letter, p);
      p.textFont(letter.font);
      p.text(letter.char, letter.x, letter.y);
    }

    //IMAGES
    const framesBetweenTrail = 10;

    for (const imgData of images) {
      processImage(imgData, p);
  
      if (activeImage === imgData) {
        drawFrame(imgData, p);
      }
      if (imgData.shouldDuplicate) duplicateImage(imgData, p);// DUPLICATE
  
  
      if (imgData.shouldMove && p.millis() > imgData.startTime && (p.millis() - imgData.startTime) < imgData.stopAfter) { // MOVE
        imgData.framesSinceLastTrail++;
  
        if (imgData.framesSinceLastTrail >= framesBetweenTrail) {
          // Save the current position in the trail
          imgData.trail.push({ x: imgData.x, y: imgData.y });
          imgData.framesSinceLastTrail = 0;
        }
  
        const speed = 0.001;
        imgData.noiseOffset += speed;
  
        // Perlin noise for moving
        imgData.x = p.map(p.noise(imgData.noiseSeedX + imgData.noiseOffset), 0, 1, 0, p.windowWidth - imgData.width);
        imgData.y = p.map(p.noise(imgData.noiseSeedY + imgData.noiseOffset), 0, 1, 0, canvasHeight - imgData.height);
      }
  
      // Define imgToDraw inside the loop
      const imgToDraw = imgData.processedImg || imgData.img;
  
      // Trail
      for (const trailPosition of imgData.trail) {
        buffer.image(imgToDraw, trailPosition.x, trailPosition.y, imgData.width, imgData.height);
      }

    // Main image
    buffer.image(imgToDraw, imgData.x, imgData.y, imgData.width, imgData.height);

    
    }

    updateCursor(p);
 
    if (activeImage) {
      drawFrame(activeImage);
    }

    //BLENDING
    if (isBgAnimationEnabled) {
      p.image(buffer, 0, 0); // Draw the buffer onto the main canvas

      // Draw images with the BLEND mode
      p.blendMode(p.BLEND);
      for (const imgData of images) {
        p.image(imgData.processedImg || imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
      }
    } 

    p.push(); // Create a separate context for square drawing
    p.blendMode(p.BLEND); // Reset the blend mode to BLEND
    p.image(squareTrailBuffer, 0, 0); // Draw the squareTrailBuffer
    
    if (square) { // Check if 'square' is defined
      drawMovingSquare(p);
      drawMainSquare(p); // Add this line to draw the main square
    }

    p.pop(); // Restore the previous context
    
  }
}
};
const my2D = new p5(sketch2D);

function getRandomColor(p) {
  return p.color(p.random(255), p.random(255), p.random(255));
}

function toggleTransition() {
  var buttons = document.querySelectorAll('#buttonsContainer button');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.add('alt');
  }

  var marqueeTop = document.querySelector('.marquee-top');
  var marqueeBottom = document.querySelector('.marquee-bottom');
  
  marqueeTop.classList.add('alt');
  marqueeBottom.classList.add('alt');

  targetColor = getRandomColor(sketchInstance);  // assuming p is globally accessible

  // Reset the click counter
  clickCounter = 0;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}