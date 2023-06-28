const EDGE_THRESHOLD = 5;
//const associatedExtraImages = ["coterie1", "coterie2", "coterie3", "coterie4"];
let extraImages = [];
let extraImagesData = {};
let showExtraImages = false;
let isExtraImagesLoaded = false;
const imageNames = ["coterie.png", "shape.png", "urgent_mockuped.png", "scientific_poster_mockuped2.png", "laptop.gif", "camera.png", "dejavuwhite.png"];
let extraVideos = [];
let extraVideosData = {};
let textTimeoutId;
const consoleRandom = p.floor(p.random(1, 101));
console.log('Random number generated:', consoleRandom);

/*function fileSelected(event, p) {
  const newImage = p.loadImage(URL.createObjectURL(event.target.files[0]), () => {
    imageLoaded(newImage, p);
  });
}*/

function imageLoaded(image, p, imageName) {
  const scaleFactor = p.random(4, 7);
  const effectRandom = p.floor(p.random(1, 101));

  const shouldMove = 0 < effectRandom && effectRandom <= 60;
  if (shouldMove){
    console.log('move initiated')
  }
  //const shouldDuplicate = 20 < effectRandom && effectRandom <= 30;
  const shouldTrail = p.random() < 0.3; // NOT WORKING
  


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
    shouldMove: shouldMove,
    startTime: p.millis() + 10000,
    stopAfter: p.random([10, 30, 60, 300, Infinity]) * 1000,
    trail: [],
    noiseSeedX: p.random(1000),
    noiseSeedY: p.random(1000),
    noiseOffset: 0,
    framesSinceLastTrail: 0,
    framesBetweenTrail: null,
    initFramesBetweenTrail: function() {
      const trailFrames = [10, 25, 50];
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
  let scaleFactor;
  if (scaleFactors && scaleFactors[parentImage.filename]) {
    scaleFactor = p.random(scaleFactors[parentImage.filename][0], scaleFactors[parentImage.filename][1]);
  } /* else {
    scaleFactor = p.random(3, 4);  // default value
  }*/

  let randomX;
  let randomY;
  do {
    randomX = p.random(0, p.windowWidth - image.width / scaleFactor);
    randomY = p.random(0, p.windowHeight - image.height / scaleFactor);
  } while (isOverlappingMainImage(randomX, randomY, image.width / scaleFactor, image.height / scaleFactor));
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
  const scaleFactor = 2;

  let video = p.createVideo([`./images/extra_videos/${videoPath}.mp4`], () => {
    video.size(video.width / scaleFactor, video.height / scaleFactor);
    let randomX;
    let randomY;
    do {
      randomX = p.random(0, p.windowWidth - video.width);
      randomY = p.random(0, p.windowHeight - video.height);
    } while (isOverlappingMainImage(randomX, randomY, video.width / scaleFactor, video.height / scaleFactor));
    video.position(randomX, randomY);
    video.loop();
    video.hide();
    video.volume(0);

    let videoData = {
      videoname: videoPath,
      video: video,
      width: video.width,
      height: video.height,
      x: randomX,  
      y: randomY,  
      isDragging: false,
    };
    extraVideos.push(videoData);
    extraVideosDataInJson = extraVideosData[parentImage.filename];

    extraVideos = extraVideos.sort((videoDataA, videoDataB) => {
      const indexA = extraVideosDataInJson.indexOf(videoDataA.videoname);
      const indexB = extraVideosDataInJson.indexOf(videoDataB.videoname);
      return indexB - indexA;
    })
    // Update width and height after metadata is loaded
    video.elt.onloadedmetadata = function() {
      videoData.width = video.elt.videoWidth / scaleFactor;
      videoData.height = video.elt.videoHeight / scaleFactor;
    };
  });
}

/*function isOverlappingOtherMedia(x, y, width, height, overlapThreshold = 0.6) {
  // Iterate through all extraImages
  for (let img of extraImages) {
    if (x < img.x + img.width * (1 - overlapThreshold) &&
       x + width * (1 - overlapThreshold) > img.x &&
       y < img.y + img.height * (1 - overlapThreshold) &&
       y + height * (1 - overlapThreshold) > img.y) {
      return true;
    }
  }

  // Iterate through all extraVideos
  for (let vid of extraVideos) {
    if (x < vid.x + vid.width * (1 - overlapThreshold) &&
       x + width * (1 - overlapThreshold) > vid.x &&
       y < vid.y + vid.height * (1 - overlapThreshold) &&
       y + height * (1 - overlapThreshold) > vid.y) {
      return true;
    }
  }

  return false;
}*/



function isOverlappingMainImage(x, y, width, height) {
  // Assumes clickedImageData.x, clickedImageData.y, clickedImageData.width, and clickedImageData.height are the coordinates and dimensions of the main image.
  const left = clickedImageData.x;
  const right = clickedImageData.x + clickedImageData.width;
  const top = clickedImageData.y;
  const bottom = clickedImageData.y + clickedImageData.height;

  // Check whether the new element overlaps with the main image
  if (x < right && x + width > left && y < bottom && y + height > top) {
    return true; // It overlaps
  }

  return false; // It doesn't overlap
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

    // Don't process the click if fullscreen image is shown
    if (showFullScreenImage) {
      return;
    }
      // Check for images
    if (extraImages) {
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
    }
    // Check for videos
    if (extraVideos) {
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
    }
    
      if (isMousePressedOn3D) {
        // If the 3D object is being interacted with, do nothing in this function.
        return;
      }
   
   for (let i = images.length - 1; i >= 0; i--) {
     const imgData = images[i];
     const imageClicked = p.mouseX >= imgData.x && p.mouseX <= imgData.x + imgData.width &&
       p.mouseY >= imgData.y && p.mouseY <= imgData.y + imgData.height;
 
       if (imageClicked) { //IMAGE CLICKED
        console.log('image clicked')
        imgData.scale = 2;
        // Display image's description
         document.getElementById('image-description').innerText = imgData.text || '';
         document.getElementById('image-description').style.display = 'flex';
        // Show close icon
        document.getElementById('close-icon-image').style.display = 'block';         
        // Show close icon for text
        document.getElementById('close-icon-text').style.display = 'block';
        
        // Hide elements
        document.getElementById('canvasContainer2').style.display = 'none';
        document.getElementById('textContainer').style.display = 'none';
        document.getElementById('header').style.display = 'none';
        document.getElementById('otherTextContainer').style.display = 'none';
      
        // Find the associated extra images for the clicked image
        const associatedExtraImages = extraImagesData[imgData.filename];
        
      
        // Reset the extraImages and extraVideos arrays
        extraImages = [];
        extraVideos = [];
      

      
        //EXTRA VIDEOS:
        const associatedExtraVideos = extraVideosData[imgData.filename];
        for (let i = 0; i < associatedExtraVideos.length; i++) {
          const extraVideoName = associatedExtraVideos[i];
          extraVideoLoaded(extraVideoName, p, extraVideoName, imgData);
        }

       // Only load the associated extra images
       for (let i = 0; i < associatedExtraImages.length; i++) {
        const extraImageName = associatedExtraImages[i].name;
        const extraImageExt = associatedExtraImages[i].ext;
        p.loadImage(`./images/extra/${extraImageName}${extraImageExt}`, (img) => {
          extraImageLoaded(img, p, extraImageName, imgData);
        });
      }        
      
        showFullScreenImage = true;
        showFullScreenImageText = true;
        showExtraImages = true;
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
      console.log("image is dragging")
    }
  }

  // Move any videos that are being dragged
  for (let i = 0; i < extraVideos.length; i++) {
    const vidData = extraVideos[i];
    if (vidData.isDragging) {
      vidData.x = p.mouseX - vidData.dragOffsetX;
      vidData.y = p.mouseY - vidData.dragOffsetY;
      vidData.video.position(vidData.x, vidData.y);
      console.log("video is dragging")
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