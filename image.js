let canvas;
let images = [];
let handleSize = 10;
let activeImage;


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvasContainer');

  const uploadImageButton = select('#uploadImage');
  uploadImageButton.mousePressed(() => select('#fileInput').elt.click());

  const fileInput = select('#fileInput');
  fileInput.input(fileSelected);
}

function fileSelected() {
  const newImage = loadImage(URL.createObjectURL(this.elt.files[0]), () => {
    imageLoaded(newImage);
  });
}

function imageLoaded(image) {
  images.push({
    img: image,
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
    aspectRatio: image.width / image.height,
    isDragging: false,
    isResizing: false,
  });
}

function mousePressed() {
  for (let i = images.length - 1; i >= 0; i--) {
    const imgData = images[i];

    if (mouseX > imgData.x && mouseX < imgData.x + imgData.width && mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
      imgData.isDragging = true;
      activeImage = imgData;
      break;
    }

    if (mouseX > imgData.x + imgData.width - handleSize && mouseX < imgData.x + imgData.width + handleSize && mouseY > imgData.y + imgData.height - handleSize && mouseY < imgData.y + imgData.height + handleSize) {
      imgData.isResizing = true;
      activeImage = imgData;
      break;
    }
  }
}

function mouseReleased() {
  for (const imgData of images) {
    imgData.isDragging = false;
    imgData.isResizing = false;
  }
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
}

function drawHandle(imgData) {
  fill(255, 0, 0);
  noStroke();
  rect(imgData.x + imgData.width - handleSize / 2, imgData.y + imgData.height - handleSize / 2, handleSize, handleSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
