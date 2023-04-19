function fileSelected() {
  const newImage = loadImage(URL.createObjectURL(this.elt.files[0]), () => {
    imageLoaded(newImage);
  });
}

function imageLoaded(image) {
  const randomNumber = floor(random(1, 101));
  const shouldMove = randomNumber >= 1 && randomNumber <= 100;
  const initialX = random(0, windowWidth - image.width);
  const initialY = random(0, windowHeight - image.height);

  images.push({
    img: image,
    x: initialX,
    y: initialY,
    width: image.width,
    height: image.height,
    aspectRatio: image.width / image.height,
    isDragging: false,
    isResizing: false,
    randomPosition: { x: initialX, y: initialY },
    shouldMove: shouldMove,
    startTime: millis(),
    stopAfter: random([5, 10, 30, 60, 300, Infinity]) * 1000,
    trail: [],
    noiseSeedX: random(1000),
    noiseSeedY: random(1000),
    noiseOffset: 0,
    framesSinceLastTrail: 0,
    isNegative: random() < 0.33,//chance of image inverting
    processedImg: null,
  });
}

function mousePressed() {
  for (let i = images.length - 1; i >= 0; i--) {
    const imgData = images[i];

    if (mouseX > imgData.x && mouseX < imgData.x + imgData.width && mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
      imgData.isDragging = true;
      imgData.offsetX = mouseX - imgData.x;
      imgData.offsetY = mouseY - imgData.y;
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



function drawHandle(imgData) {
  fill(255, 0, 0);
  noStroke();
  rect(imgData.x + imgData.width - handleSize / 2, imgData.y + imgData.height - handleSize / 2, handleSize, handleSize);
}