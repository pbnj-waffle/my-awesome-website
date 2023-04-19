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

  function draw() {
    background(255);
  
    let cursorType = ARROW;
  
    for (const imgData of images) {
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
        //trail
        imgData.trail.push({ x: imgData.x, y: imgData.y });
  
        imgData.noiseOffset += 0.01;
  
        //perlin noise
        const noiseScale = 100;
        imgData.x = map(noise(imgData.noiseSeedX + imgData.noiseOffset), 0, 1, 0, windowWidth - imgData.width);
        imgData.y = map(noise(imgData.noiseSeedY + imgData.noiseOffset), 0, 1, 0, windowHeight - imgData.height);
      }
  
      // Draw the trail
      for (const position of imgData.trail) {
        image(imgData.img, position.x, position.y, imgData.width, imgData.height);
      }
  
      image(imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
  
      if (mouseX > imgData.x && mouseX < imgData.x + imgData.width && mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
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