function fileSelected() {
  const newImage = loadImage(URL.createObjectURL(this.elt.files[0]), () => {
    imageLoaded(newImage);
  });
}

function imageLoaded(image) {
  const effectRandom = floor(random(1,101));
  const shouldMove = 0 < effectRandom && effectRandom <= 10;
  const shouldGlitch = 10 < effectRandom && effectRandom <= 20;
  const shouldDuplicate = 20 < effectRandom && effectRandom <= 100;
  const initialX = random(0, windowWidth - image.width);
  const initialY = random(0, windowHeight - image.height);

  images.push({
    img: image,
    x: initialX,
    y: initialY,
    width: image.width / 3,
    height: image.height / 3,
    aspectRatio: image.width / image.height,
    isDragging: false,
    isResizing: false,
    randomPosition: { x: initialX, y: initialY },
    shouldMove: shouldMove,
    shouldGlitch: shouldGlitch,
    startTime: millis() + 5000, //start effect after 5 seconds NOT WORKING
    stopAfter: random([5, 10, 30, 60, 300, Infinity]) * 1000,
    trail: [],
    noiseSeedX: random(1000),
    noiseSeedY: random(1000),
    noiseOffset: 0,
    framesSinceLastTrail: 0,
    isNegative: random() < 0.33,
    processedImg: null,
    shouldGlitch: shouldGlitch,
    timeElapsed: 0,
    shouldDuplicate: shouldDuplicate,
    duplicateInterval: 5000, // Duplicate every 5 seconds
    lastDuplicateTime: millis(),
  });
}

function processImage(imgData) {
  if (imgData.timeElapsed < 300) {
    imgData.timeElapsed++;
    return;
  }
  if (imgData.isNegative && !imgData.processedImg) {
    const buffer = createGraphics(imgData.img.width, imgData.img.height);
    buffer.image(imgData.img, 0, 0);
    buffer.filter(INVERT);
    imgData.processedImg = buffer;
  }

  if (imgData.shouldGlitch) {
    if (random() < 0.1) { // 10% chance to apply glitch effect each frame
      applyGlitchEffect(imgData);
    } else {
      imgData.processedImg = null;
    }
  }
}

function applyGlitchEffect(imgData) {
  const choice = random(0, 1);
  if (choice < 0.8) {
    const buffer = createGraphics(imgData.img.width, imgData.img.height);
    buffer.image(imgData.img, 0, 0);

    const glitchIntensity = floor(random(5, 15));
    for (let i = 0; i < glitchIntensity; i++) {
      const x = floor(random(0, buffer.width));
      const y = floor(random(0, buffer.height));
      const w = floor(random(10, buffer.width / 3));
      const h = floor(random(1, buffer.height / 3));
      const dx = floor(random(-buffer.width / 2, buffer.width / 2)); // Increase the range for dx
      const dy = floor(random(-buffer.height / 2, buffer.height / 2)); // Increase the range for dy
      buffer.copy(buffer, x, y, w, h, x + dx, y + dy, w, h);
    }
    imgData.processedImg = buffer;
  } else if (choice < 0.9) {
    // Apply a completely black glitch
    const buffer = createGraphics(imgData.img.width, imgData.img.height);
    buffer.image(imgData.img, 0, 0);
    buffer.loadPixels();
    for (let i = 0; i < buffer.pixels.length; i++) {
      buffer.pixels[i] = 0;
    }
    buffer.updatePixels();
    imgData.processedImg = buffer;
  } else {
    // Apply an effect resembling SMPTE color bars
    const buffer = createGraphics(imgData.img.width, imgData.img.height);
    buffer.image(imgData.img, 0, 0);
    buffer.loadPixels();
    const barHeight = buffer.height / 7;
    const colors = [
      color(192, 192, 192),
      color(192, 192, 0),
      color(0, 192, 192),
      color(0, 192, 0),
      color(192, 0, 192),
      color(192, 0, 0),
      color(0, 0, 192),
    ];
    for (let i = 0; i < buffer.pixels.length; i += 4) {
      const y = Math.floor(i / (4 * buffer.width));
      const barIndex = Math.floor(y / barHeight);
      const c = colors[barIndex % colors.length];
      buffer.pixels[i] = red(c);
      buffer.pixels[i + 1] = green(c);
      buffer.pixels[i + 2] = blue(c);
      buffer.pixels[i + 3] = 255;
    }
    buffer.updatePixels();
    imgData.processedImg = buffer;
  }
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