let canvas;
let images = [];
let handleSize = 10;
let activeImage;

let message = '';

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvasContainer');
  
    const uploadImageButton = select('#uploadImage');
    uploadImageButton.mousePressed(() => select('#fileInput').elt.click());
  
    const fileInput = select('#fileInput');
    fileInput.input(fileSelected);
  }

  function processImage(imgData) {
    if (imgData.isNegative && !imgData.processedImg) {
      const buffer = createGraphics(imgData.img.width, imgData.img.height);
      buffer.image(imgData.img, 0, 0);
      buffer.filter(INVERT);
      imgData.processedImg = buffer;
    }
  }

  function draw() {
    background(255);
  
    let cursorType = ARROW;
    const framesBetweenTrail = 10;
  
    for (const imgData of images) {
      processImage(imgData);
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
      } else if (imgData.shouldMove && millis() - imgData.startTime > 5000) {
        imgData.framesSinceLastTrail++;

        if (imgData.framesSinceLastTrail >= framesBetweenTrail) {
          //save the current position in the trail 
          imgData.trail.push({ x: imgData.x, y: imgData.y });
          imgData.framesSinceLastTrail = 0;
        }
        
  
        const speed = 0.001; //speed 
        imgData.noiseOffset += speed;
  
        //perlin noise
        imgData.x = map(noise(imgData.noiseSeedX + imgData.noiseOffset), 0, 1, 0, windowWidth - imgData.width);
        imgData.y = map(noise(imgData.noiseSeedY + imgData.noiseOffset), 0, 1, 0, windowHeight - imgData.height);
    }

    
     if (!imgData.shouldMove && millis() - imgData.startTime > 5000) {
      imgData.shouldMove = true;
    }

    if (imgData.shouldMove && millis() - imgData.startTime > imgData.stopAfter) {
      imgData.shouldMove = false;
    }
  
      //trail
      for (const trailPosition of imgData.trail) {
        const imgToDraw = imgData.processedImg || imgData.img;
        image(imgToDraw, trailPosition.x, trailPosition.y, imgData.width, imgData.height);
      }
  
      //main image
      const imgToDraw = imgData.processedImg || imgData.img;
      image(imgToDraw, imgData.x, imgData.y, imgData.width, imgData.height);
  

    if (activeImage === imgData && !imgData.shouldMove && mouseX > imgData.x && mouseX < imgData.x + imgData.width && mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
      cursorType = MOVE;
    }
  }
  
    if (activeImage) {
      drawHandle(activeImage);
    }
  
    cursor(cursorType);
  }
   
  

  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }