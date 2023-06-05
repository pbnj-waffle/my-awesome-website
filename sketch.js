let canvas;
let bgColor;
let transitionSpeed = 5000;
let transitionBeginning = null;
let transitionFinished = false;
let transitionBeginColor = null;
let targetColor;
let images = [];
let handleSize = 10;
let activeImage;
let buffer; //IMPORTANT to use to keep browser from crashing
let squareTrailBuffer;
let squareBuffer;
let blurredBgBuffer = null;
let logBuffer;
let bgBuffer;
let textBuffer;
let textTrailBuffer;
let square;
let squareTrail = [];
let sketchInstance;
let mouseOver3DObject = false;
let textInputMode = false;
let inputField;
let textSizeSlider;
var clickCounter = 0;
var currentMarquee = 0;
let isBlackBg = true; 
let isBgAnimationEnabled = true; 
let showFullScreenImage = false;
let fullScreenImage = null;
const closingIconSize = 60;
let imageTexts;
let fullScreenImageText = '';
let isMousePressedOn3D = false;
let clickedImageData = null;
//let isBlurApplied = false;
//let canvasHeight;
let bgImagesNames = ["cat_tv.png", "no_fun_tv.png", "armchair_tv.png"];
let bgImages = [];
let overlayImagesNames = ["loading_screen_cat_tv.png", "loading_screen_no_fun_tv.png", "loading_screen_armchair_tv.png"];
let overlayImages = [];
let chosenBgImage, chosenOverlayImageName;
let videoNames = ["bg.mp4"];
let bgVideos = [];
let chosenVideo;
let hoveredImage = null;
let hoveredImgData = null;
const ARROW = 'default';
let cursorType = ARROW;
let mainFont;
let secondaryFont;
let letters = [];
let texts = [];
let bubbleX, bubbleY;
let xOff = 0.0, yOff = 1000.0; // offsets for noise() function to generate different values for x and y
let bubbleSize = 500;
let noiseScale = 0.02; // The scale of the noise. Adjust this value to get different effects
let bubbleAlpha = 0.5; // The transparency of the bubble
let gif;
let storedLogs = [];
let lastLogTime = 0;
let logDisplayDuration = 10;
let logCreationInterval = 5000; 
let logQueue = [];
let lastMessage = null;
let imageX, imageY; 
let showAboutSection = false;
let showContactSection = false;


function LogData(message, x, y, move, speed, angle, stopMovingAfter, timestamp) {
  this.message = message;
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.angle = angle;
  this.move = move;
  this.trail = [];
  this.framesSinceLastTrail = 0;
  this.framesBetweenTrail = this.randomFramesBetweenTrail();
  this.noiseSeedX = Math.random() * 100;
  this.noiseSeedY = Math.random() * 100;
  this.noiseOffset = 0;
  this.stopMovingAfter = stopMovingAfter;
  this.timestamp = timestamp;
}


LogData.prototype.randomFramesBetweenTrail = function() {
  const minFrames = 10; // Minimum frames between trail
  const maxFrames = 100; // Maximum frames between trail
  return Math.floor(Math.random() * (maxFrames - minFrames + 1) + minFrames);
};


let sketch2D = new p5((p) => {
 window.p = p;
    // Store original console.log function
    const originalLog = console.log;
// Overwrite the console.log
console.log = function(...messages) {
  // Join messages to form a single string
  let currentMessage = messages.join(' ');

  // If current message is the same as last message, return without pushing to logQueue
  if (currentMessage === lastMessage) {
    return;
  }

  // Update lastMessage to current message
  lastMessage = currentMessage;

  originalLog(...messages);
  let stopMovingAfterOptions = [5000, 10000, 15000];
  let stopMovingAfter = stopMovingAfterOptions[Math.floor(Math.random() * stopMovingAfterOptions.length)];

  let messageObject = new LogData(
    currentMessage,
    Math.random() * (window.innerWidth - 50), 
    Math.random() * (window.innerHeight - 50),
    Math.random() < 1,
    Math.random() * 5,
    Math.random() * Math.PI * 2,
    stopMovingAfter,
    p.millis() 
  );
  logQueue.push(messageObject); 
}

    p.updateMessage = function(log) {
      if (log.move && p.millis() - log.timestamp < log.stopMovingAfter) {
        
        log.noiseOffset += 0.01;
        
        // Perlin noise for moving
        const noiseX = p.map(p.noise(log.noiseSeedX + log.noiseOffset), 0, 1, -1, 1);
        const noiseY = p.map(p.noise(log.noiseSeedY + log.noiseOffset), 0, 1, -1, 1);
        log.x += noiseX;
        log.y += noiseY;
    
        // Make sure the message doesn't go off the screen
        log.x = p.constrain(log.x, 0, p.windowWidth);
        log.y = p.constrain(log.y, 0, p.windowHeight);
      }
      
      // Always add a trail point, even if the text is not moving
      log.framesSinceLastTrail++;
      if (log.framesSinceLastTrail >= log.framesBetweenTrail) {
        let textWidth = p.textWidth(log.message);
        let adjustedX = p.constrain(log.x, 0, p.windowWidth - textWidth);
        log.trail.push({ x: adjustedX, y: log.y });
        log.framesSinceLastTrail = 0;
      }
      
      p.fill(255);
      p.textSize(10);
       // Calculate text width
  let textWidth = p.textWidth(log.message);
  
  // Adjust x position based on text width
  let adjustedX = p.constrain(log.x, 0, p.windowWidth - textWidth);

// Draw the message trail
for (const trailPosition of log.trail) {
  p.text(log.message, trailPosition.x, trailPosition.y);
}
  
  // Draw the message
  p.text(log.message, adjustedX, log.y);
}
  /*let bubblePoints = Array(20).fill().map((_, i, arr) => {
    let angle = p.map(i, 0, arr.length, 0, p.TWO_PI);
    return {
        angle: angle,
        r: bubbleSize / 2,
        noiseSeed: p.random(0, 100) // each point has its own seed value
    };
});*/

  //canvasHeight = document.getElementById('canvasGlobalContainer').offsetHeight;
p.mousePressed = () => {
  mousePressed(p);
};
  
p.mouseReleased = () => {
  mouseReleased(p);
};

p.preload = () => {
    //gif = p.loadImage('./test.gif');//GIF
   /* const randomIndex = Math.floor(p.random(videoNames.length));
    chosenVideo = p.createVideo([videoNames[randomIndex]], () => {
      chosenVideo.elt.muted = true;
      chosenVideo.play();
  });*/
  for (let i = 0; i < bgImagesNames.length; i++) { //BACKGROUND AND LOADING SCREEN IMAGES
    let bgImg = p.loadImage(bgImagesNames[i]);
    let overlayImg = p.loadImage(`loading_screen_${bgImagesNames[i]}`); // Load corresponding overlay image

    bgImages.push(bgImg);
    overlayImages.push(overlayImg);
  }
    
    for (let i = 0; i < imageNames.length; i++) { // MAIN IMAGES
      const img = p.loadImage(`./images/${imageNames[i]}.png`, () => {
          imageLoaded(img, p, imageNames[i]);
      });
    }
    /*for (let i = 1; i <= 3; i++) { //EXTRA IMAGES
      const img = p.loadImage(`./images/extra/extra_img (${i}).jpg`, () => {
          extraImageLoaded(img, p, `extra_img (${i})`);
      });
    }*/

  imageTexts = p.loadJSON('imageTexts.json');
  extraImagesData = p.loadJSON('extraImages.json');
  extraVideosData = p.loadJSON('extraVideos.json');
  mainFont = p.loadFont('00BusinessHistory-Regular.otf');
  secondaryFont = p.loadFont('SourceCodePro-Regular.ttf');
  }
  
  
  p.setup = () => {    
    bgColor = p.color(236,245,230);
    transitionBeginColor = bgColor;
    targetColor = p.color(0);
    const canvas2D = p.createCanvas(p.windowWidth, p.windowHeight); // Store the canvas
    canvas2D.parent('canvasContainer');
    buffer = p.createGraphics(p.windowWidth, p.windowHeight);
    squareTrailBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    squareBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    bgBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    blurredBgBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    textBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    textTrailBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    logBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    /*for(let angle = 0; angle < 2 * p.PI; angle += 0.3){ //BUBBLE
      bubblePoints.push({angle: angle, r: bubbleSize/2});
    }*/

   /* chosenVideo.loop();
    chosenVideo.hide();
    chosenVideo.volume(0);*/

    const randomIndex = Math.floor(p.random(bgImages.length));
    chosenBgImage = bgImages[randomIndex];
     /*chosenOverlayImageName = `loading_screen_${bgImagesNames[randomIndex]}`;
  
    document.getElementById('overlay').style.backgroundImage = `url(${chosenOverlayImageName})`;
 
    // Fade out the mask after a delay
    setTimeout(() => {
      const mask = document.getElementById('mask');
      mask.style.transition = 'opacity 1s ease-out';
      mask.style.opacity = 0;
  
      // remove the mask from the DOM completely after the fade-out animation
      setTimeout(() => {
        mask.parentNode.removeChild(mask);
      }, 200); //match the transition duration above
    }, 200); // delay in milliseconds*/
    
  /*let randomNumber3 = Math.floor(Math.random() * 100);

  let textElement = document.querySelector("#textContainer");
  let textPos = textElement.getBoundingClientRect();

  if(randomNumber3 >= 10 && randomNumber3 <= 100) { // only add text to array for p5.js processing if randomNumber3 is in this range
    texts.push({
        img: textElement,
        x: textPos.x,
        y: textPos.y,
        shouldMove: true,
        startTime: p.millis() + 5000,
        stopAfter: p.random([5, 10, 30, 60, 300, Infinity]) * 1000,
        trail: [],
        noiseSeedX: p.random(1000),
        noiseSeedY: p.random(1000),
        noiseOffset: 0,
        framesSinceLastTrail: 0
    });
    html2canvas(textElement, {backgroundColor: null}).then(canvas => {
      let imgSnapshot = p.createImage(canvas.width, canvas.height);
      imgSnapshot.drawingContext.drawImage(canvas, 0, 0);
      texts[texts.length - 1].imgSnapshot = imgSnapshot;
    });
  } else {
    // If the number is not between 30 and 40, hide the text element
    textElement.style.visibility = 'hidden';
  } */


    if (Math.random() > 0.1) {
      square = {
        x: p.random(p.windowWidth - 50),
        y: p.random(p.windowHeight - 50),
        size: 20,
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
      squareTrailBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
      squareTrailBufferBlend = p.createGraphics(p.windowWidth, p.windowHeight);
      squareBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    
  }

  

  
    p.draw = () => {
      p.clear()
      if (showAboutSection || showContactSection) {
         // show only the background and the header
       p.image(chosenBgImage, 0, 0,  p.windowWidth, p.windowHeight);
       } else {      
      // p.background(0);
      p.image(chosenBgImage, 0, 0,  p.windowWidth, p.windowHeight);
      textBuffer.clear();
 
      if (showFullScreenImage) {

        p.image(chosenBgImage, 0, 0,  p.windowWidth, p.windowHeight);

        // Draw the main image
        const aspectRatio = fullScreenImage.width / fullScreenImage.height;
        const imageWidth = Math.min(p.windowWidth / 1.5, aspectRatio * p.windowHeight / 1.5);
        const imageHeight = imageWidth / aspectRatio;
        imageX = 45;
        imageY = (p.windowHeight - imageHeight) / 2;
        p.image(fullScreenImage, imageX, imageY, imageWidth, imageHeight);

        if (showExtraImages) {
          const validExtraImages = extraImages.filter(imgData => imgData != null);
        
          for (const imgData of validExtraImages) {
            // Draw each image
            p.image(imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
          }
        }

        for (let i = 0; i < extraVideos.length; i++) {
          let vid = extraVideos[i].video;
          let x = extraVideos[i].x;
          let y = extraVideos[i].y;
          p.image(vid, x, y); // Assumes p is your p5 instance
        }

        // Draw the associated text on the right half of the screen
        const textStart = p.windowWidth / 2 - 300; 
        const textWidth = p.windowWidth / 1.5 ; 
        p.textLeading(50);
        p.textFont(mainFont); 
        p.textSize(45);
        p.textAlign(p.RIGHT, p.TOP); 
        p.fill(255);
        p.text(fullScreenImageText, textStart, imageY, textWidth);

      } else {

        bgBuffer.clear(); // Clear bgBuffer here, after checking showFullScreenImage
        
        p.image(bgBuffer, 0, 0, p.windowWidth, p.windowHeight);

      //currentBgFrame = (currentBgFrame + 1) % maskedBgs.length;
     // bgBuffer.image(maskedBgs[currentBgFrame], 0, 0, p.windowWidth, canvasHeight);

     



    // TEXT
    /*// Display the text trail buffer
    p.image(textTrailBuffer, 0, 0);
    p.fill(255);

  
      for (const textData of texts) { 
        processText(textData, p); 
      
        if (textData.imgSnapshot) {
          p.image(textData.imgSnapshot, textData.x, textData.y);
        } else {
          // Draw text as fallback
          p.text(textData.img.textContent, textData.x, textData.y);
        }
      }*/

      /*//BUBBLE
      bubbleX = p.map(p.noise(xOff), 0, 1, 0, p.width);
      bubbleY = p.map(p.noise(yOff), 0, 1, 0, p.height);
      
      xOff += 0.001;
      yOff += 0.001;*/
      
    //IMAGES
    //const framesBetweenTrail = 25;   
    
    for (const imgData of images) {    
      
      if (hoveredImage === imgData) {
        // Save the hovered image data to be processed later
        hoveredImgData = imgData;
      } else {
      processImage(imgData, p);
  
      if (activeImage === imgData) {
        drawFrame(imgData, p);
      }

      if (imgData.shouldDuplicate) duplicateImage(imgData, p);// DUPLICATE
  
      let lines = wrapText(p, imgData.filename, imgData.width);
      if (imgData.shouldMove && p.millis() > imgData.startTime && (p.millis() - imgData.startTime) < imgData.stopAfter) {
        imgData.framesSinceLastTrail++;
      
        if (imgData.framesSinceLastTrail >= imgData.framesBetweenTrail) {
          imgData.trail.push({ x: imgData.x, y: imgData.y });
          imgData.framesSinceLastTrail = 0;
        }
  
        const speed = 0.001;
        imgData.noiseOffset += speed;
  
        // Perlin noise for moving
        const noiseX = p.map(p.noise(imgData.noiseSeedX + imgData.noiseOffset), 0, 1, -1, 1);
        const noiseY = p.map(p.noise(imgData.noiseSeedY + imgData.noiseOffset), 0, 1, -1, 1);
        imgData.x += noiseX;
        imgData.y += noiseY;

        // Make sure the image doesn't go off the screen
        imgData.x = p.constrain(imgData.x, 0, p.windowWidth - imgData.width);
        imgData.y = p.constrain(imgData.y, 10 + lines.length * 12, p.windowHeight - imgData.height);
      }
  
      // Define imgToDraw inside the loop
      const imgToDraw = imgData.processedImg || imgData.img;
  
      // Trail
      for (const trailPosition of imgData.trail) {
        buffer.image(imgToDraw, trailPosition.x, trailPosition.y, imgData.width, imgData.height);
      }
      // Main image
      buffer.image(imgToDraw, imgData.x, imgData.y, imgData.width, imgData.height);

    /*// Draw the image filename to the textBuffer
    textBuffer.textSize(10);
    textBuffer.textFont(secondaryFont);
    textBuffer.fill(255, 0, 0); 
    
    for (let i = 0; i < lines.length; i++) {
      textBuffer.text(lines[i], imgData.x, imgData.y - 10 - (lines.length - 1 - i) * 12); 
      let textY = imgData.y - 10 - (lines.length - 1 - i) * 12; //TEXT GOING OFF SCREEN NOT WORKING
      textY = p.constrain(textY, 0, p.windowHeight - 10); 
    } */
    
    }
  }

// After processing all other images, process the hovered image
if (hoveredImgData) {
  processImage(hoveredImgData, p);

  if (activeImage === hoveredImgData) {
    drawFrame(hoveredImgData, p);
  }
  if (hoveredImgData.shouldDuplicate) duplicateImage(hoveredImgData, p);

  // Draw the image onto the buffer
  const imgToDrawHovered = hoveredImgData.processedImg || hoveredImgData.img;
  buffer.image(imgToDrawHovered, hoveredImgData.x, hoveredImgData.y, hoveredImgData.width, hoveredImgData.height);
}

// Display the buffer
p.image(buffer, 0, 0);
// Display the textBuffer
p.image(textBuffer, 0, 0);

// Check if the mouse is still over the hovered image
let mouseOverHoveredImage = false;
if (hoveredImgData) {
    mouseOverHoveredImage = p.mouseX >= hoveredImgData.x && p.mouseX <= hoveredImgData.x + hoveredImgData.width && 
    p.mouseY >= hoveredImgData.y && p.mouseY <= hoveredImgData.y + hoveredImgData.height;
}

// Apply the glow effect and draw the hovered image onto the main canvas only if the mouse is still over it
if (hoveredImgData && mouseOverHoveredImage) {
    p.drawingContext.shadowBlur = 20; // Set the amount of blur. Adjust as needed.
    p.drawingContext.shadowColor = "white"; // Set the color of the glow. Adjust as needed.

    const imgToDrawHovered = hoveredImgData.processedImg || hoveredImgData.img;
    p.image(imgToDrawHovered, hoveredImgData.x, hoveredImgData.y, hoveredImgData.width, hoveredImgData.height);

    // Reset the shadow properties to their default values
    p.drawingContext.shadowBlur = 0;
    p.drawingContext.shadowColor = 'rgba(0,0,0,0)';
}

let currentTime = p.millis();
if (currentTime - lastLogTime >= logCreationInterval && logQueue.length > 0) {
  storedLogs.push(logQueue.shift());
  lastLogTime = currentTime;
}

for (let i = 0; i < storedLogs.length; i++) {
  let log = storedLogs[i];
  p.updateMessage(log);
}

    updateCursor(p)
 
    if (activeImage) {
      drawFrame(activeImage);
    }

    //BLENDING
    if (isBgAnimationEnabled) {
      p.image(buffer, 0, 0); // Draw the buffer onto the main canvas

      /*// Draw images with the BLEND mode
      p.blendMode(p.BLEND);
      for (const imgData of images) {
        p.image(imgData.processedImg || imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
      }*/
    } 
    /*p.push();//gif
    p.blendMode(p.DARKEST);
    p.image(gif, 0, 0, p.width, p.height);  
    p.blendMode(p.BLEND); // Reset the blend mode to default  
    p.pop();
    
    p.push();//bubble
    p.blendMode(p.SOFT_LIGHT);
    p.fill(255);
    p.beginShape();
    bubblePoints.forEach((point, i) => {
      // Skip the noise for the last point and set it to the same position as the first point
      if(i == bubblePoints.length - 1) {
          point.r = bubblePoints[0].r;
      }
      else {
          // modulate the distance of each point from the center
          point.r = bubbleSize / 2 + smoothingFunction(p.map(p.noise(point.noiseSeed, p.frameCount * 0.0002), 0, 1, -bubbleSize/4, bubbleSize/4));
      }
  
      let x = bubbleX + point.r * p.cos(point.angle);
      let y = bubbleY + point.r * p.sin(point.angle);
      p.curveVertex(x, y);
  });
    p.endShape(p.CLOSE);
    p.blendMode(p.BLEND);
    p.pop();*/

    p.push(); // Create a separate context for square drawing
    p.blendMode(p.BLEND); // Reset the blend mode to BLEND
    p.image(squareTrailBuffer, 0, 0); // Draw the squareTrailBuffer
    
    if (square) { // Check if 'square' is defined
      drawMovingSquare(p);
      drawMainSquare(p); // Add this line to draw the main square
    }
    p.image(logBuffer, 0, 0);
    p.pop(); // Restore the previous context
    
  };
};
};
// Smoothing function
function smoothingFunction(x) {
  let y = 0.5 * p.sin(x * p.PI - p.HALF_PI) + 0.5; // map to sine wave for smooth oscillation
  return y * bubbleSize / 20;
}

});

//const my2D = new p5(sketch2D);

/*document.addEventListener('click', function () {
  clickCounter++;

  if (clickCounter >= 10) { //the amount of clicks
    toggleTransition();
  }
});*/

function processText(textData, p) {
  if (textData.shouldMove && p.millis() > textData.startTime && (p.millis() - textData.startTime) < textData.stopAfter) {
    const speed = 0.001;
    textData.noiseOffset += speed;

    // Perlin noise for moving
    const noiseX = p.map(p.noise(textData.noiseSeedX + textData.noiseOffset), 0, 1, -10, 10);
    const noiseY = p.map(p.noise(textData.noiseSeedY + textData.noiseOffset), 0, 1, -10, 10);
    textData.x += noiseX;
    textData.y += noiseY;

    // Get the global canvas container size
    let globalCanvasContainer = document.getElementById('canvasGlobalContainer');
    //let containerSize = globalCanvasContainer.getBoundingClientRect();

    // Constrain the text to stay within the global canvas container
    textData.x = p.constrain(textData.x, 0, p.windowWidth - textData.img.clientWidth);
    textData.y = p.constrain(textData.y, 0, p.windowHeight - textData.img.clientHeight);

    // Update the text position
    textData.img.style.left = textData.x + "px";
    textData.img.style.top = textData.y + "px";

    //Draw the current position of the text to the trail buffer
  if (textData.imgSnapshot) {
    textTrailBuffer.image(textData.imgSnapshot, textData.x, textData.y);
  } else {
    textTrailBuffer.fill(255); // Set the text color
    textTrailBuffer.text(textData.img.textContent, textData.x, textData.y);
  }
  }
}
