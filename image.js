const EDGE_THRESHOLD = 5;

/*function fileSelected(event, p) {
  const newImage = p.loadImage(URL.createObjectURL(event.target.files[0]), () => {
    imageLoaded(newImage, p);
  });
}*/

function imageLoaded(image, p, imageName) {
  const scaleFactor = p.random(1, 3);
  const effectRandom = p.floor(p.random(1, 101));
  //console.log('Random number:', effectRandom);
  const shouldMove = 0 < effectRandom && effectRandom <= 100;
  const shouldDuplicate = 20 < effectRandom && effectRandom <= 30;
  //const initialX = p.random(0, p.windowWidth - image.width);
  //const initialY = p.random(0, p.windowHeight - image.height);
  const shouldTrail = p.random() < 0.3; // NOT WORKING
  const noBlending = p.random() < 0.5;

  // Only place images below 100vh.
  const minImageY = p.windowHeight; // 100vh in pixels
  const maxImageY = canvasHeight - image.height;

  images.push({
    img: image,
    x: p.random(0, p.windowWidth - image.width),
    y: p.random(minImageY, maxImageY),
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
    //shouldDuplicate: shouldDuplicate,
    duplicateInterval: 15000, // Duplicate every 15 seconds
    lastDuplicateTime: p.millis(),
    glitchImg: null,
    shouldTrail: shouldTrail,
    noBlending: noBlending,
    text: imageTexts[imageName] || '',
    filename: imageName,
  });
}

function extraImageLoaded(image, p, imageName, parentImage) {
  const scaleFactor = 1;
  // Calculate the maximum possible height for the main images
  let maxHeight = 0;
  /*for (let img of images) {
    if (img.height > maxHeight) {
      maxHeight = img.height;
    }
  }*/

  const canvasHeight = document.getElementById('defaultCanvas0').style.height;
  let randomX = p.random(0, p.windowWidth - image.width / scaleFactor);
  let randomY = p.random(45 + parentImage.height, parseInt(canvasHeight) - parseInt(image.height));
  extraImages.push({
    img: image,
    width: image.width / scaleFactor,
    height: image.height / scaleFactor,
    aspectRatio: image.width / image.height,
    x: randomX,  // random x
    y: randomY,  // random y, but always greater than the height of the tallest image in the gallery
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
      // Show elements
      document.getElementById('header').style.display = '';
      document.getElementById('textContainer').style.display = '';
      document.getElementById('otherTextContainer').style.display = '';
      document.getElementById('buttonsContainer').style.display = '';
      document.getElementsByClassName('rectangle-wrapper')[0].style.display = '';
      showFullScreenImage = false;
      window.set3DObjectVisibility(true);
      return;
    }
  }
  for (let i = images.length - 1; i >= 0; i--) {
    const imgData = images[i];
    const imageClicked = p.mouseX >= imgData.x && p.mouseX <= imgData.x + imgData.width &&
      p.mouseY >= imgData.y && p.mouseY <= imgData.y + imgData.height;

    if (imageClicked && !isBlurApplied) {//IMAGE CLICKED
      showExtraImages = true;

      // Hide elements
      document.getElementById('header').style.display = 'none';
      document.getElementById('textContainer').style.display = 'none';
      document.getElementById('otherTextContainer').style.display = 'none';
      document.getElementById('buttonsContainer').style.display = 'none';
      document.getElementsByClassName('rectangle-wrapper')[0].style.display = 'none';
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // Find the associated extra images for the clicked image
      const imageName = `img (${i + 1})`;  // Construct the image name
      const associatedExtraImages = extraImagesData[imageName];

      // Reinitialize extraImages to be an empty array
      extraImages = [];

      // Only load the associated extra images
      for (let i = 0; i < associatedExtraImages.length; i++) {
        const extraImageName = associatedExtraImages[i];
        p.loadImage(`./images/extra/${extraImageName}.png`, (img) => {
          extraImageLoaded(img, p, extraImageName, imgData);
        });
      }

      // Assign random positions to the extra images
      /*for (let i = 0; i < extraImages.length; i++) {
        let extraImage = extraImages[i];
        extraImage.x = p.random(0, p.windowWidth - extraImage.width);  // Random x position

        if (i === 0) {
          // Position the first extra image right below the clicked image
          extraImage.y = clickedImageData.y + clickedImageData.height + p.random(0, p.height - (clickedImageData.y + clickedImageData.height + extraImage.height));
        } else {
          // Position the subsequent extra images randomly but below the clicked image
          let previousExtraImage = extraImages[i - 1];
          extraImage.y = previousExtraImage.y + previousExtraImage.height + p.random(0, p.height - (previousExtraImage.y + previousExtraImage.height + extraImage.height));
        }
      }*/
      // Apply the blur and update the flag only when image is clicked and blur is not yet applied
      //buffer.filter(p.BLUR, 10); 
      //blurredBgBuffer.image(buffer, 0, 0); 
      //isBlurApplied = true;

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

function setCursor(cursor) {
  console.log(cursor)
  if(cursor === 'arrow'){
    document.body.style.setProperty('cursor', `url(./midfinger.cur), auto`, 'important');
  }
  else if(cursor === 'grab'){
    document.body.style.setProperty('cursor', `url(./shrek.cur), auto`, 'important');
  }
  else if(cursor === 'pointer'){
    document.body.style.setProperty('cursor', `url(./paw.cur), auto`, 'important');
  }
  else{
    document.body.style.setProperty('cursor', 'default', 'important');
  }
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

  /*if (overAnyImage) {

    setCursor('pointer');
  } else {
    setCursor('arrow');
  }*/
}