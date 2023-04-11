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
   
  
    for (const imgData of images) {
      if (imgData.isDragging) {
        imgData.x = mouseX - imgData.width / 2;
        imgData.y = mouseY - imgData.height / 2;
      } else if (imgData.isResizing) {
        let newWidth = mouseX - imgData.x;
        let newHeight = mouseY - imgData.y;
  
        if (keyIsDown(SHIFT)) {
          newHeight = newWidth / imgData.aspectRatio;
        }
  
        imgData.width = newWidth;
        imgData.height = newHeight;
      }
  
      image(imgData.img, imgData.x, imgData.y, imgData.width, imgData.height);
    }
  
    if (activeImage) {
      drawHandle(activeImage);
  
      if (mouseX > activeImage.x && mouseX < activeImage.x + activeImage.width && mouseY > activeImage.y && mouseY < activeImage.y + activeImage.height) {
        cursor(MOVE);
      } else {
        cursor(ARROW);
      }
    } else {
      cursor(ARROW);
    }

    text(message, 25, 150);//TEXT TEXT TEXT TEXT
  }
  
  

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  