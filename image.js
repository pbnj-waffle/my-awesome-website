const EDGE_THRESHOLD = 5;

/*function fileSelected(event, p) {
  const newImage = p.loadImage(URL.createObjectURL(event.target.files[0]), () => {
    imageLoaded(newImage, p);
  });
}*/

function imageLoaded(image, p, imageName) {
  const effectRandom = p.floor(p.random(1,101));
  console.log('Random number:', effectRandom);
  const shouldMove = 0 < effectRandom && effectRandom <= 100;
  const shouldDuplicate = 20 < effectRandom && effectRandom <= 30;
  //const initialX = p.random(0, p.windowWidth - image.width);
  //const initialY = p.random(0, p.windowHeight - image.height);
  const shouldTrail = p.random() < 0.3; // NOT WORKING
  const noBlending = p.random() < 0.5;

  images.push({
    img: image,
    x: p.random(0, p.windowWidth - image.width),
    y: p.random(0, p.windowHeight - image.height),
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
    shouldMove: !noBlending && shouldMove,
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
    duplicateInterval: 15000, // Duplicate every 15 seconds
    lastDuplicateTime: p.millis(),
    glitchImg: null,
    shouldTrail: shouldTrail,
    noBlending: noBlending,
    text: imageTexts[imageName] || '',
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
function mousePressed(p) {
  for (const imgData of images) {
    const imageClicked = p.mouseX >= imgData.x && p.mouseX <= imgData.x + imgData.width &&
      p.mouseY >= imgData.y && p.mouseY <= imgData.y + imgData.height;
    if (imageClicked) {
      // If we're transitioning from a non-full-screen state to a full-screen state
      if (!showFullScreenImage) {
        // Copy the contents of bgBuffer to blurredBgBuffer
        blurredBgBuffer.image(bgBuffer, 0, 0);

        // Apply the blur filter to blurredBgBuffer
        blurredBgBuffer.filter(p.BLUR, 5);
      }

      showFullScreenImage = true;
      fullScreenImage = imgData.img;
      fullScreenImageText = imgData.text || '';
      clickedImageData = imgData;  // Store the entire imgData object
      clickedImageData.clickY = p.mouseY;  // Store the y-position of the click
      break;
    }
  }
};


  
  function keyPressed(p) {
    if (p.keyCode === p.ESCAPE) {
      showFullScreenImage = false;
      fullScreenImage = null;
      return false; // prevent default
    }
  };

  function mouseReleased(p) {
    // If the user released the mouse on the closing icon, close the full screen image
   const clickedOnClosingIcon = p.mouseX >= p.windowWidth - closingIconSize && p.mouseX <= p.windowWidth &&
   p.mouseY >= 0 && p.mouseY <= closingIconSize;
 if (clickedOnClosingIcon) {
   setTimeout(() => {
     showFullScreenImage = false;
     fullScreenImage = null;
   }, 100); // wait 100 milliseconds before closing the image
 }
   };
  
 /* function drawFrame(imgData, p) {
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
  }
  */
