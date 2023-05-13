const EDGE_THRESHOLD = 5;

function fileSelected(event, p) {
  const newImage = p.loadImage(URL.createObjectURL(event.target.files[0]), () => {
    imageLoaded(newImage, p);
  });
}
function imageLoaded(image, p) {
  const effectRandom = p.floor(p.random(1,101));
  const shouldMove = 0 < effectRandom && effectRandom <= 100;
  const shouldDuplicate = 20 < effectRandom && effectRandom <= 30;
  const initialX = p.random(0, p.windowWidth - image.width);
  const initialY = p.random(0, p.windowHeight - image.height);
  const shouldTrail = p.random() < 0.3; // NOT WORKING

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
    startTime: p.millis() + 5000,
    stopAfter: p.random([5, 10, 30, 60, 300, Infinity]) * 1000,
    trail: [],
    noiseSeedX: p.random(1000),
    noiseSeedY: p.random(1000),
    noiseOffset: 0,
    framesSinceLastTrail: 0,
    processedImg: null,
    timeElapsed: 0,
    shouldDuplicate: shouldDuplicate,
    duplicateInterval: 5000, // Duplicate every 5 seconds
    lastDuplicateTime: p.millis(),
    glitchImg: null,
    shouldTrail: shouldTrail,
  });
}

function processImage(imgData, p) {
  if (imgData.timeElapsed < 300) {
    imgData.timeElapsed++;
    return;
  }
}

function duplicateImage(imgData, p) {
  if (p.millis() - imgData.lastDuplicateTime >= imgData.duplicateInterval) {
    const newImgData = {
      ...imgData,
      x: p.random(0, p.windowWidth - imgData.width),
      y: p.random(0, p.windowHeight - imgData.height),
      shouldMove: false,
      shouldGlitch: false,
      shouldDuplicate: false,
    };

    images.push(newImgData);
    imgData.lastDuplicateTime = p.millis();
  }
}

/*function mousePressed(p) {
  if (p.mouseButton !== p.LEFT) return;

  let foundImage = false;
  for (let i = images.length - 1; i >= 0; i--) {
    const imgData = images[i];
    const onLeftEdge = p.mouseX > imgData.x - imgData.resizeMargin && p.mouseX < imgData.x + imgData.resizeMargin;
    const onRightEdge = p.mouseX > imgData.x + imgData.width - imgData.resizeMargin && p.mouseX < imgData.x + imgData.width + imgData.resizeMargin;
    const onTopEdge = p.mouseY > imgData.y - imgData.resizeMargin && p.mouseY < imgData.y + imgData.resizeMargin;
    const onBottomEdge = p.mouseY > imgData.y + imgData.height - imgData.resizeMargin && p.mouseY < imgData.y + imgData.height + imgData.resizeMargin;
    imgData.isResizingLeft = onLeftEdge && !onTopEdge && !onBottomEdge;
    imgData.isResizingRight = onRightEdge && !onTopEdge && !onBottomEdge;
    imgData.isResizingTop = onTopEdge && !onLeftEdge && !onRightEdge;
    imgData.isResizingBottom = onBottomEdge && !onLeftEdge && !onRightEdge;
    
    imgData.isResizingTopLeft = onLeftEdge && onTopEdge;
    imgData.isResizingTopRight = onRightEdge && onTopEdge;
    imgData.isResizingBottomLeft = onLeftEdge && onBottomEdge;
    imgData.isResizingBottomRight = onRightEdge && onBottomEdge;
    
    if (imgData.isResizingLeft || imgData.isResizingRight || imgData.isResizingTop || imgData.isResizingBottom ||
        imgData.isResizingTopLeft || imgData.isResizingTopRight || imgData.isResizingBottomLeft || imgData.isResizingBottomRight) {
      foundImage = true;
      activeImage = imgData;
      break;
    }
    
    if (p.mouseX > imgData.x && p.mouseX < imgData.x + imgData.width && p.mouseY > imgData.y && p.mouseY < imgData.y + imgData.height) {
      imgData.offsetX = p.mouseX - imgData.x;
      imgData.offsetY = p.mouseY - imgData.y;
      imgData.isDragging = true;
      foundImage = true;
      activeImage = imgData;
      break;
    }

    if (!foundImage) {
      activeImage = null;
      resizeCursorType = p.ARROW;
      }
    }
  }

  function mouseReleased(p) {
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
  
  
  function drawFrame(imgData, p) {
  const frameThickness = 5;
  topBuffer.noFill();
  topBuffer.strokeWeight(frameThickness);
  topBuffer.stroke(0,0,255);
  topBuffer.rect(imgData.x + frameThickness / 2, imgData.y + frameThickness / 2, imgData.width - frameThickness, imgData.height - frameThickness);
  }
  
  function drawHandle(imgData, p) {
  p.stroke(0,0,255);
  p.noFill();
  p.rect(imgData.x, imgData.y, imgData.width, imgData.height);
  }
  
  function isMouseOnLeftEdge(imgData, p) {
  return p.abs(p.mouseX - imgData.x) <= EDGE_THRESHOLD;
  }
  
  function isMouseOnRightEdge(imgData, p) {
  return p.abs(p.mouseX - (imgData.x + imgData.width)) <= EDGE_THRESHOLD;
  }
  
  function isMouseOnTopEdge(imgData, p) {
  return p.abs(p.mouseY - imgData.y) <= EDGE_THRESHOLD;
  }
  
  function isMouseOnBottomEdge(imgData, p) {
  return p.abs(p.mouseY - (imgData.y + imgData.height)) <= EDGE_THRESHOLD;
  }

  function setCursor(cursor) {
    document.body.style.cursor = cursor;
  }

  function updateCursor(p) {
    if (activeImage) {
      const isOnLeftEdge = p.mouseX >= activeImage.x - EDGE_THRESHOLD && p.mouseX <= activeImage.x + EDGE_THRESHOLD;
      const isOnRightEdge = p.mouseX >= activeImage.x + activeImage.width - EDGE_THRESHOLD && p.mouseX <= activeImage.x + activeImage.width + EDGE_THRESHOLD;
      const isOnTopEdge = p.mouseY >= activeImage.y - EDGE_THRESHOLD && p.mouseY <= activeImage.y + EDGE_THRESHOLD;
      const isOnBottomEdge = p.mouseY >= activeImage.y + activeImage.height - EDGE_THRESHOLD && p.mouseY <= activeImage.y + activeImage.height + EDGE_THRESHOLD;
  
      if (isOnLeftEdge && isOnTopEdge) {
        setCursor('nwse-resize');
      } else if (isOnRightEdge && isOnTopEdge) {
        setCursor('nesw-resize');
      } else if (isOnLeftEdge && isOnBottomEdge) {
        setCursor('nesw-resize');
      } else if (isOnRightEdge && isOnBottomEdge) {
        setCursor('nwse-resize');
      } else if (isOnLeftEdge || isOnRightEdge) {
        setCursor('ew-resize');
      } else if (isOnTopEdge || isOnBottomEdge) {
        setCursor('ns-resize');
      } else {
        setCursor('default');
      }
    }
  }*/
  

