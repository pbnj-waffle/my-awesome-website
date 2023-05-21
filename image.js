const EDGE_THRESHOLD = 5;

/*function fileSelected(event, p) {
  const newImage = p.loadImage(URL.createObjectURL(event.target.files[0]), () => {
    imageLoaded(newImage, p);
  });
}*/

function imageLoaded(image, p, imageName) {
  const scaleFactor = p.random(1, 3);
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
    y: p.random(0, canvasHeight - image.height),
    width: image.width / scaleFactor,
    height: image.height / scaleFactor,
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

function extraImageLoaded(image, p, imageName) {
  if (!clickedImageData) {
    console.error('clickedImageData is null in extraImageLoaded');
    return;
  }
  const scaleFactor = p.random(1, 3);

  let newY;
  if (extraImages.length === 0) {
    // Position the first extra image right below the clicked image
    newY = clickedImageData.y + clickedImageData.height;
  } else {
    // Position the subsequent extra images right below the last extra image
    const lastExtraImage = extraImages[extraImages.length - 1];
    newY = lastExtraImage.y + lastExtraImage.height;
  }

  extraImages.push({
    img: image,
    x: clickedImageData.x,
    y: newY,
    width: image.width / scaleFactor,
    height: image.height / scaleFactor,
    aspectRatio: image.width / image.height,
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
  
  if (isMousePressedOn3D) {
    // If the 3D object is being interacted with, do nothing in this function.
    return;
  }
  if (showFullScreenImage) {
  const closeClicked = p.mouseX >= iconX && p.mouseX <= iconX + closingIconSize &&
    p.mouseY >= iconY && p.mouseY <= iconY + closingIconSize;
  if (closeClicked) {
    showFullScreenImage = false;
    window.set3DObjectVisibility(true);
    return;
  }
}
for (let i = images.length - 1; i >= 0; i--) {
  const imgData = images[i];
  
  
    const imageClicked = p.mouseX >= imgData.x && p.mouseX <= imgData.x + imgData.width &&
      p.mouseY >= imgData.y && p.mouseY <= imgData.y + imgData.height;
    if (imageClicked && !isBlurApplied) {
      showExtraImages = true;

      // Apply the blur and update the flag only when image is clicked and blur is not yet applied
      //buffer.filter(p.BLUR, 10); 
      //blurredBgBuffer.image(buffer, 0, 0); 
      isBlurApplied = true;

      showFullScreenImage = true;
      fullScreenImage = imgData.img;
      fullScreenImageText = imgData.text || '';
      clickedImageData = imgData;  // Store the entire imgData object
      clickedImageData.clickY = p.mouseY;  // Store the y-position of the click
      window.set3DObjectVisibility(false);
      break;
    }
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
  }*/

  function setCursor(cursor) {
    document.body.style.setProperty('cursor', cursor, 'important');
  }

 function updateCursor(p) {
  let overAnyImage = false;
  hoveredImage = null;

  for (const imgData of images) {
    // Check if mouse is over this image
    if (
      p.mouseX >= imgData.x && p.mouseX <= imgData.x + imgData.width &&
      p.mouseY >= imgData.y && p.mouseY <= imgData.y + imgData.height
    ) {
      overAnyImage = true; // We're over an image, set the flag
      hoveredImage = imgData; // Save the hovered image
    }
  }

  if (overAnyImage) {
    console.log("over")
    setCursor('pointer');
  } else {
    setCursor('default');
  }
}
