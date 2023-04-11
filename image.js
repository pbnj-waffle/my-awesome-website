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



function drawHandle(imgData) {
  fill(255, 0, 0);
  noStroke();
  rect(imgData.x + imgData.width - handleSize / 2, imgData.y + imgData.height - handleSize / 2, handleSize, handleSize);
}

