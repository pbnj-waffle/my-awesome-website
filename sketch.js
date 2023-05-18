let canvas;
let bgColor;
let transitionSpeed = 0.01; 
let targetColor;
let images = [];
let handleSize = 10;
let activeImage;
let maskedBgs = []; // An array to store the masked background images
let currentBgFrame = 0; // Store the current frame index of the background animation
let buffer; //IMPORTANT to use to keep browser from crashing
let topBuffer;
let bgBuffer; 
let differenceBuffer;
let square;
let squareTrail = [];
let squareTrailSpacing = 5000;//NOT WORKING
const ARROW = 'default';
const RESIZE_EW = 'ew-resize';
const RESIZE_NS = 'ns-resize';
const RESIZE_NWSE = "nwse-resize";
const RESIZE_NESW = "nesw-resize";
let cursorType = ARROW;
let resizeCursorType = ARROW;
let mouseOver3DObject = false;
let textInputMode = false;
let inputField;
let letters = [];
let textSizeSlider;
var clickCounter = 0;
let isBlackBg = true; 
let isBgAnimationEnabled = true; 


document.addEventListener('click', function () {
  clickCounter++;

  if (clickCounter >= 10) { //the amount of clicks
    toggleTransition();
  }
});


const sketch2D = (p) => {
  
  p.mousePressed = () => {
    mousePressed(p);
  };
  
  p.mouseReleased = () => {
    mouseReleased(p);
  };

  p.preload = () => {
    for (let i = 1; i <= 200; i++) { 
      const img = p.loadImage(`./bg27/bg27 (${i}).png`, () => {
        // Create a copy of the original background image to use as the mask
        const maskedImg = img.get();
        // Invert the background image so it acts as a mask for the uploaded images
        maskedImg.filter(p.INVERT);
        maskedBgs.push(maskedImg);
      });
    }
  }
  
  p.setup = () => {
    bgColor = p.color(0);
    targetColor = p.color(0, 0, 0);
    const canvas2D = p.createCanvas(p.windowWidth, p.windowHeight); // Store the canvas
    canvas2D.parent('canvasContainer');
    buffer = p.createGraphics(p.windowWidth, p.windowHeight);
    topBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    bgBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    differenceBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    p.frameRate(350);
      
    const uploadImageButton = p.select('#uploadImage');
    uploadImageButton.mousePressed(() => p.select('#fileInput').elt.click());
  
    const fileInput = p.select('#fileInput');
    fileInput.elt.addEventListener('change', (event) => fileSelected(event, p));

    const saveImageButton = p.select('#saveImage');
    saveImageButton.mousePressed(saveImageToFile);

    const addTextButton = p.select('#addText');
    const textSizeContainer = p.select('#textSizeContainer');
    textSizeSlider = p.select('#textSize');

    const colorPicker = document.querySelector('#colorPicker');
    const toggleBgButton = document.querySelector('#toggleBg');
    
    colorPicker.addEventListener('input', () => {
      let hex = colorPicker.value;
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
    
      targetColor = p.color(r, g, b);
      bgColor = targetColor; // Set bgColor directly to the target color
      isBlackBg = colorPicker.value === "#000000";
      isBgAnimationEnabled = isBlackBg;
    });
    
    toggleBgButton.addEventListener('click', () => {
      colorPicker.click(); 
    });

    document.addEventListener('mousedown', (e) => {
      handleCanvasClick(p, e);
    }, true);
    
    addTextButton.mousePressed((e) => {
      if (textInputMode) {
        if (inputField) {
          saveText(p);
          p.cursor(p.ARROW);
          textInputMode = false;
        }
      } else {
        textInputMode = true;
        p.cursor(p.TEXT);
      }
      
      // Modify the button's text according to the `textInputMode` state
      addTextButton.html(textInputMode ? 'submit' : 'text');
      textSizeContainer.style('display', textInputMode ? 'block' : 'none');
    });


      textSizeSlider.input(() => {
        if (inputField) {
          inputField.style('font-size', textSizeSlider.value() + 'px');
        }
      });

    document.addEventListener('mousemove', (e) => {
      if (!mouseOver3DObject && activeImage) {
        updateCursor(p);
      } else {
        p.cursor(ARROW);
      }
    });

    square = {
      x: p.random(p.windowWidth - 50),
      y: p.random(p.windowHeight - 50),
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
    squareTrailBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    squareTrailBufferBlend = p.createGraphics(p.windowWidth, p.windowHeight);
    squareBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
  }

    function saveImageToFile() {
      p.saveCanvas('myCanvas', 'jpg');
    }
  
    p.draw = () => {
      bgColor = p.lerpColor(bgColor, targetColor, transitionSpeed);
      p.background(bgColor);
      topBuffer.clear();
      buffer.clear();
      bgBuffer.clear();
      currentBgFrame = (currentBgFrame + 1) % maskedBgs.length;
      bgBuffer.image(maskedBgs[currentBgFrame], 0, 0, p.windowWidth, p.windowHeight);

    // TEXT
    p.fill(255);
    for (const letter of letters) {
      p.text(letter.char, letter.x, letter.y);
      updateLetter(p, letter);
    }
  
    for (let letter of letters) {
      updateLetter(letter, p);
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
  
      if (imgData.isDragging) { // DRAGGING
        imgData.x = p.mouseX - imgData.offsetX;
        imgData.y = p.mouseY - imgData.offsetY;
      } 
  
    
      // RESIZING
      if (imgData.isResizingLeft) {
        imgData.width += imgData.x - p.mouseX;
        imgData.x = p.mouseX;
      } else if (imgData.isResizingRight) {
        imgData.width = p.mouseX - imgData.x;
      }
  
      if (imgData.isResizingTop) {
        imgData.height += imgData.y - p.mouseY;
        imgData.y = p.mouseY;
      } else if (imgData.isResizingBottom) {
        imgData.height = p.mouseY - imgData.y;
      }
  
      if (imgData.isResizingTopLeft) {
        const prevWidth = imgData.width;
        const prevHeight = imgData.height;
        imgData.width += imgData.x - p.mouseX;
        imgData.height += imgData.y - p.mouseY;
  
        if (p.keyIsDown(p.SHIFT)) {
          imgData.height = imgData.width / imgData.aspectRatio;
        }
  
        imgData.x -= imgData.width - prevWidth;
        imgData.y -= imgData.height - prevHeight;
      } else if (imgData.isResizingTopRight) {
        const prevHeight = imgData.height;
        imgData.width = p.mouseX - imgData.x;
        imgData.height += imgData.y - p.mouseY;
  
        if (p.keyIsDown(p.SHIFT)) {
          imgData.height = imgData.width / imgData.aspectRatio;
        }
  
        imgData.y -= imgData.height - prevHeight;
      } else if (imgData.isResizingBottomLeft) {
        const prevWidth = imgData.width;
        imgData.width += imgData.x - p.mouseX;
        imgData.height = p.mouseY - imgData.y;
  
        if (p.keyIsDown(p.SHIFT)) {
          imgData.width = imgData.height * imgData.aspectRatio;
        }
  
        imgData.x -= imgData.width - prevWidth;
      } else if (imgData.isResizingBottomRight) {
        imgData.width = p.mouseX - imgData.x;
        imgData.height = p.mouseY - imgData.y;
  
        if (p.keyIsDown(p.SHIFT)) {
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
        imgData.x = p.map(p.noise(imgData.noiseSeedX + imgData.noiseOffset), 0, 1, 0, p.windowWidth - imgData.width);
        imgData.y = p.map(p.noise(imgData.noiseSeedY + imgData.noiseOffset), 0, 1, 0, p.windowHeight - imgData.height);
      }
  
      // Define imgToDraw inside the loop
      const imgToDraw = imgData.processedImg || imgData.img;
  
      // Trail
      for (const trailPosition of imgData.trail) {
        buffer.image(imgToDraw, trailPosition.x, trailPosition.y, imgData.width, imgData.height);
      }
  
      // Main image
      differenceBuffer.image(imgToDraw, imgData.x, imgData.y, imgData.width, imgData.height);
  
      if (activeImage === imgData && !imgData.shouldMove && p.mouseX > imgData.x && p.mouseX < imgData.x + imgData.width && p.mouseY > imgData.y && p.mouseY < imgData.y + imgData.height) {
        cursorType = p.MOVE;
      }
    }
 
    if (activeImage) {
      drawFrame(activeImage);
    }
  
    if (isBgAnimationEnabled) {
      p.image(buffer, 0, 0); // Draw the buffer onto the main canvas
      p.blendMode(p.OVERLAY); // Set the blend mode to screen
      p.image(bgBuffer, 0, 0); // Draw the bgBuffer onto the main canvas
  }

  // Draw images affected by blending with the appropriate blending mode
  p.blendMode(isBlackBg ? p.DIFFERENCE : p.BLEND); 
  for (const imgData of images) {
    if (!imgData.noBlending) {
        p.image(imgData.processedImg || imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
    }
  }

  // Draw differenceBuffer and topBuffer in all cases but change blending mode
  p.blendMode(isBlackBg ? p.DIFFERENCE : p.BLEND);
  p.image(differenceBuffer, 0, 0); // Draw the differenceBuffer onto the main canvas
  p.image(topBuffer, 0, 0); // Draw the topBuffer onto the main canvas

  p.push(); // Create a separate context for square drawing
  p.blendMode(p.BLEND); // Reset the blend mode to BLEND
  p.image(squareTrailBuffer, 0, 0); // Draw the squareTrailBuffer
  drawMovingSquare(p);
  drawMainSquare(p); // Add this line to draw the main square
  p.pop(); // Restore the previous context

  // Draw images not affected by blending
  p.push(); // Create a separate context for images with no blending
  p.blendMode(p.BLEND);
  for (const imgData of images) {
    if (imgData.noBlending) {
      p.image(imgData.processedImg || imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
    }
  }
  p.pop(); // Restore the previous context
}
};
const my2D = new p5(sketch2D);

function handleCanvasClick(p, e) {

  if (!textInputMode) {
    isDragging3DModel = true;
    lastMousePosition = { x: e.clientX, y: e.clientY };
    isMousePressedOn3D = true;
    return;
  }

  if (e.button === 0) { // Check if the left button is clicked
    if (e.target.tagName == 'BUTTON' || inputField && e.target.closest('.text-input-wrapper')) {
      return;
    }

    if (textInputMode) {
        // Get the click position, ensuring it is within the canvas
        const clickX = Math.min(Math.max(0, e.clientX - p.canvas.offsetLeft), p.width);
        const clickY = Math.min(Math.max(0, e.clientY - p.canvas.offsetTop), p.height);

        if (inputField) {
          moveInput(clickX, clickY);
        }
        else
          createInputField(p, clickX, clickY);

        
        e.preventDefault();
      //}
    } else {
      mousePressed(p);
    }
  }
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
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}