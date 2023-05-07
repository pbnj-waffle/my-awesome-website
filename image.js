const EDGE_THRESHOLD = 5;

function fileSelected() {
  const newImage = loadImage(URL.createObjectURL(this.elt.files[0]), () => {
    imageLoaded(newImage);
  });
}

function imageLoaded(image) {
  const effectRandom = floor(random(1,101));
  const shouldMove = 0 < effectRandom && effectRandom <= 50;
  const shouldDuplicate = 20 < effectRandom && effectRandom <= 30;
  const initialX = random(0, windowWidth - image.width);
  const initialY = random(0, windowHeight - image.height);
  const shouldTrail = random() < 0.3;
  

  images.push({
    img: image,
    x: initialX,
    y: initialY,
    width: image.width / 3,
    height: image.height / 3,
    aspectRatio: image.width / image.height,
    isDragging: false,
    isResizing: false,
    isResizingLeft: false,
    isResizingRight: false,
    isResizingTop: false,
    isResizingBottom: false,
    resizeMargin: 10,
    randomPosition: { x: initialX, y: initialY },
    shouldMove: shouldMove,
    startTime: millis() + 5000, //start effect after 5 seconds NOT WORKING
    stopAfter: random([5, 10, 30, 60, 300, Infinity]) * 1000,
    trail: [],
    noiseSeedX: random(1000),
    noiseSeedY: random(1000),
    noiseOffset: 0,
    framesSinceLastTrail: 0,
    processedImg: null,
    timeElapsed: 0,
    shouldDuplicate: shouldDuplicate,
    duplicateInterval: 5000, // Duplicate every 5 seconds
    lastDuplicateTime: millis(),
    glitchImg: null,
    shouldTrail: shouldTrail,
  });
}

function processImage(imgData) {
  if (imgData.timeElapsed < 300) {
    imgData.timeElapsed++;
    return;
  }
 /* if (imgData.isNegative && !imgData.processedImg) {
    const buffer = createGraphics(imgData.img.width, imgData.img.height);
    buffer.image(imgData.img, 0, 0);
    buffer.filter(INVERT);
    imgData.processedImg = buffer;
  }*/
}

function duplicateImage(imgData) {
  if (millis() - imgData.lastDuplicateTime >= imgData.duplicateInterval) {
    const newImgData = {
      ...imgData,
      x: random(0, windowWidth - imgData.width),
      y: random(0, windowHeight - imgData.height),
      shouldMove: false,
      shouldGlitch: false,
      shouldDuplicate: false,
    };

    images.push(newImgData);
    imgData.lastDuplicateTime = millis();
  }
}



function mousePressed() {
  let foundImage = false;
  for (const imgData of images) {
    if (mouseX > imgData.x - imgData.resizeMargin && mouseX < imgData.x + imgData.resizeMargin &&
        mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
      imgData.isResizingLeft = true;
      foundImage = true;
    } else if (mouseX > imgData.x + imgData.width - imgData.resizeMargin && mouseX < imgData.x + imgData.width + imgData.resizeMargin &&
               mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
      imgData.isResizingRight = true;
      foundImage = true;
    } else if (mouseY > imgData.y - imgData.resizeMargin && mouseY < imgData.y + imgData.resizeMargin &&
               mouseX > imgData.x && mouseX < imgData.x + imgData.width) {
      imgData.isResizingTop = true;
      foundImage = true;
    } else if (mouseY > imgData.y + imgData.height - imgData.resizeMargin && mouseY < imgData.y + imgData.height + imgData.resizeMargin &&
               mouseX > imgData.x && mouseX < imgData.x + imgData.width) {
      imgData.isResizingBottom = true;
      foundImage = true;
    } else if (mouseX > imgData.x && mouseX < imgData.x + imgData.width &&
               mouseY > imgData.y && mouseY < imgData.y + imgData.height) {
      imgData.offsetX = mouseX - imgData.x;
      imgData.offsetY = mouseY - imgData.y;
      imgData.isDragging = true;
      foundImage = true;
    } 

    const onLeftEdge = mouseX > imgData.x - imgData.resizeMargin && mouseX < imgData.x + imgData.resizeMargin;
    const onRightEdge = mouseX > imgData.x + imgData.width - imgData.resizeMargin && mouseX < imgData.x + imgData.width + imgData.resizeMargin;
    const onTopEdge = mouseY > imgData.y - imgData.resizeMargin && mouseY < imgData.y + imgData.resizeMargin;
    const onBottomEdge = mouseY > imgData.y + imgData.height - imgData.resizeMargin && mouseY < imgData.y + imgData.height + imgData.resizeMargin;

    if (onLeftEdge && onTopEdge) {
      imgData.isResizingTopLeft = true;
      foundImage = true;
    } else if (onRightEdge && onTopEdge) {
      imgData.isResizingTopRight = true;
      foundImage = true;
    } else if (onLeftEdge && onBottomEdge) {
      imgData.isResizingBottomLeft = true;
      foundImage = true;
    } else if (onRightEdge && onBottomEdge) {
      imgData.isResizingBottomRight = true;
      foundImage = true;
    }
    
    if (!activeImage || activeImage !== imgData) {
      activeImage = imgData;
    } else {
      activeImage = null;
    }
    
  }

  if (!foundImage) {
    resizeCursorType = ARROW;
  }
}


function mouseReleased() {
  resizeCursorType = ARROW;
  for (const imgData of images) {
    imgData.isDragging = false;
    imgData.isResizingLeft = false;
    imgData.isResizingRight = false;
    imgData.isResizingTop = false;
    imgData.isResizingBottom = false;
    imgData.isResizingTopLeft = false;
    imgData.isResizingTopRight = false;
    imgData.isResizingBottomLeft = false;
    imgData.isResizingBottomRight = false;
  }
}


function drawFrame(imgData) {
  const frameThickness = 5;
  topBuffer.noFill();
  topBuffer.strokeWeight(frameThickness);
  topBuffer.stroke(0,0,255);
  topBuffer.rect(imgData.x + frameThickness / 2, imgData.y + frameThickness / 2, imgData.width - frameThickness, imgData.height - frameThickness);
}


function drawHandle(imgData) {
  stroke(0,0,255);
  noFill();
  rect(imgData.x, imgData.y, imgData.width, imgData.height);
}

function isMouseOnLeftEdge(imgData) {
  return abs(mouseX - imgData.x) <= EDGE_THRESHOLD;
}

function isMouseOnRightEdge(imgData) {
  return abs(mouseX - (imgData.x + imgData.width)) <= EDGE_THRESHOLD;
}

function isMouseOnTopEdge(imgData) {
  return abs(mouseY - imgData.y) <= EDGE_THRESHOLD;
}

function isMouseOnBottomEdge(imgData) {
  return abs(mouseY - (imgData.y + imgData.height)) <= EDGE_THRESHOLD;
}

function updateCursor() {
  if (activeImage) {
    const isOnLeftEdge = mouseX >= activeImage.x - EDGE_THRESHOLD && mouseX <= activeImage.x + EDGE_THRESHOLD;
    const isOnRightEdge = mouseX >= activeImage.x + activeImage.width - EDGE_THRESHOLD && mouseX <= activeImage.x + activeImage.width + EDGE_THRESHOLD;
    const isOnTopEdge = mouseY >= activeImage.y - EDGE_THRESHOLD && mouseY <= activeImage.y + EDGE_THRESHOLD;
    const isOnBottomEdge = mouseY >= activeImage.y + activeImage.height - EDGE_THRESHOLD && mouseY <= activeImage.y + activeImage.height + EDGE_THRESHOLD;

    if (isOnLeftEdge && isOnTopEdge) {
      resizeCursorType = RESIZE_NWSE;
    } else if (isOnRightEdge && isOnTopEdge) {
      resizeCursorType = RESIZE_NESW;
    } else if (isOnLeftEdge && isOnBottomEdge) {
      resizeCursorType = RESIZE_NESW;
    } else if (isOnRightEdge && isOnBottomEdge) {
      resizeCursorType = RESIZE_NWSE;
    } else if (isOnLeftEdge || isOnRightEdge) {
      resizeCursorType = RESIZE_EW;
    } else if (isOnTopEdge || isOnBottomEdge) {
      resizeCursorType = RESIZE_NS;
    } else {
      resizeCursorType = ARROW;
    }
  } else {
    resizeCursorType = ARROW;
  }
}
