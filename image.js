const EDGE_THRESHOLD = 5;
//const associatedExtraImages = ["coterie1", "coterie2", "coterie3", "coterie4"];
let extraImages = [];
let extraImagesData = {};
let showExtraImages = false;
let isExtraImagesLoaded = false;
const imageNames = ["coterie"];
let extraVideos = [];
let extraVideosData = {};
/*function fileSelected(event, p) {
  const newImage = p.loadImage(URL.createObjectURL(event.target.files[0]), () => {
    imageLoaded(newImage, p);
  });
}*/

function imageLoaded(image, p, imageName) {
  const scaleFactor = p.random(6, 8);
  const effectRandom = p.floor(p.random(1, 101));
  console.log('Random number generated:', effectRandom);
  const shouldMove = 0 < effectRandom && effectRandom <= 100;
  //const shouldDuplicate = 20 < effectRandom && effectRandom <= 30;
  const shouldTrail = p.random() < 0.3; // NOT WORKING
  const noBlending = p.random() < 0.5;


  images.push({
    img: image,
    x: p.random(0, p.windowWidth - image.width / scaleFactor),
    y: p.random(0, p.windowHeight - image.height / scaleFactor),
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
    stopAfter: p.random([10, 30, 60, 300, Infinity]) * 1000,
    trail: [],
    noiseSeedX: p.random(1000),
    noiseSeedY: p.random(1000),
    noiseOffset: 0,
    framesSinceLastTrail: 0,
    framesBetweenTrail: null,
    initFramesBetweenTrail: function() {
      const trailFrames = [10, 25, 100];
      this.framesBetweenTrail = trailFrames[Math.floor(Math.random() * trailFrames.length)];
      return this;
    },
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
    init: function() {
      this.initFramesBetweenTrail();
      return this;
    }
  }.init());
}

function wrapText(p, text, maxWidth) {
  p.textSize(12);
  p.textFont(secondaryFont)
  let words = text.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    let width = p.textWidth(currentLine + " " + word);
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function extraImageLoaded(image, p, imageName, parentImage) {
  const scaleFactor = 8;

  let randomX = p.random(0, p.windowWidth - image.width / scaleFactor);
  let randomY = p.random(0, p.windowHeight - image.height / scaleFactor);
  extraImages.push({
    img: image,
    width: image.width / scaleFactor,
    height: image.height / scaleFactor,
    aspectRatio: image.width / image.height,
    x: randomX,  
    y: randomY,  
    isDragging: false,
  });
}

function extraVideoLoaded(videoPath, p, videoName, parentImage) {
  const scaleFactor = 6;

  let video = p.createVideo([`./images/extra_videos/${videoPath}.mp4`], () => {
    video.size(video.width / scaleFactor, video.height / scaleFactor);
    let randomX = p.random(0, p.windowWidth - video.width / scaleFactor);
    let randomY = p.random(0, p.windowHeight - video.height / scaleFactor);
    video.position(randomX, randomY);
    video.loop();
    video.hide();

    extraVideos.push({
      video: video,
      x: randomX,  
      y: randomY,  
      isDragging: false,
    });
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
 // Check for images
 for (let i = 0; i < extraImages.length; i++) {
  const imgData = extraImages[i];
  const imageClicked = p.mouseX >= imgData.x && p.mouseX <= imgData.x + imgData.width &&
    p.mouseY >= imgData.y && p.mouseY <= imgData.y + imgData.height;
  if (imageClicked) {
    imgData.isDragging = true;
    imgData.dragOffsetX = p.mouseX - imgData.x;
    imgData.dragOffsetY = p.mouseY - imgData.y;
  }
}

// Check for videos
for (let i = 0; i < extraVideos.length; i++) {
  const vidData = extraVideos[i];
  const videoClicked = p.mouseX >= vidData.x && p.mouseX <= vidData.x + vidData.video.width &&
    p.mouseY >= vidData.y && p.mouseY <= vidData.y + vidData.video.height;
  if (videoClicked) {
    vidData.isDragging = true;
    vidData.dragOffsetX = p.mouseX - vidData.x;
    vidData.dragOffsetY = p.mouseY - vidData.y;
  }
}

  if (isMousePressedOn3D) {
    // If the 3D object is being interacted with, do nothing in this function.
    return;
  }
  if (showFullScreenImage) {
    const closeClicked = p.mouseX >= iconX && p.mouseX <= iconX + closingIconSize &&
      p.mouseY >= iconY && p.mouseY <= iconY + closingIconSize;
    if (closeClicked) {
      // Show elements
      document.getElementById('textContainer').style.display = '';
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
      document.getElementById('textContainer').style.display = 'none';

      // Find the associated extra images for the clicked image
      const associatedExtraImages = extraImagesData[imgData.filename];
      extraImagesData[imgData.filename] = [];

      // Only load the associated extra images
      for (let i = 0; i < associatedExtraImages.length; i++) {
        const extraImageName = associatedExtraImages[i];
        p.loadImage(`./images/extra/${extraImageName}.png`, (img) => {
          extraImageLoaded(img, p, extraImageName, imgData);
        });
      }

      //EXTRA VIDEOS:
      const associatedExtraVideos = extraVideosData[imageNames];
      extraVideosData[imageNames] = [];
      for (let i = 0; i < associatedExtraVideos.length; i++) {
        const extraVideoName = associatedExtraVideos[i];
        extraVideoLoaded(extraVideoName, p, extraVideoName, imgData);
      }

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

  // Stop dragging any images
  for (let i = 0; i < extraImages.length; i++) {
    extraImages[i].isDragging = false;
    extraImages[i].dragOffsetX = 0;
    extraImages[i].dragOffsetY = 0;
  }

  // Stop dragging any videos
  for (let i = 0; i < extraVideos.length; i++) {
    extraVideos[i].isDragging = false;
    extraVideos[i].dragOffsetX = 0;
    extraVideos[i].dragOffsetY = 0;
  }
};

function mouseDragged(p) {
  // Move any images that are being dragged
  for (let i = 0; i < extraImages.length; i++) {
    const imgData = extraImages[i];
    if (imgData.isDragging) {
      imgData.x = p.mouseX - imgData.dragOffsetX;
      imgData.y = p.mouseY - imgData.dragOffsetY;
    }
  }

  // Move any videos that are being dragged
  for (let i = 0; i < extraVideos.length; i++) {
    const vidData = extraVideos[i];
    if (vidData.isDragging) {
      vidData.x = p.mouseX - vidData.dragOffsetX;
      vidData.y = p.mouseY - vidData.dragOffsetY;
      vidData.video.position(vidData.x, vidData.y);
    }
  }
}


function setCursor(cursor) {

  if(cursor === 'arrow'){
    document.body.style.setProperty('cursor', `url(./arrow.cur), auto`, 'important');
  }
  else if(cursor === 'grab'){
    document.body.style.setProperty('cursor', `url(./grab.cur), auto`, 'important');
  }
  else if(cursor === 'pointer'){
    document.body.style.setProperty('cursor', `url(./midfinger.cur), auto`, 'important');
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
}