document.getElementById("image-description").innerHTML = fullScreenImageText;

document.getElementById('about').addEventListener('click', function (event) { //HIDE THE ELEMENTS
  event.preventDefault();
  document.getElementById('about-section').style.display = 'flex';
  document.getElementById('textContainer').style.display = 'none';
  document.getElementById('canvasContainer2').style.display = 'none';
  document.getElementById('contact-section').style.display = 'none';
  document.getElementById('otherTextContainer').style.display = 'none';
  document.body.classList.add('hide-letters');
  showAboutSection = true;
  showContactSection = false; 
});

document.getElementById('close-icon-about').addEventListener('click', function () { //REVEAL THE ELEMENTS
  document.getElementById('about-section').style.display = 'none';
  document.getElementById('textContainer').style.display = 'block';
  document.getElementById('canvasContainer2').style.display = 'block';
  document.getElementById('otherTextContainer').style.display = 'block';
  document.body.classList.remove('hide-letters'); 
  showAboutSection = false;
});


document.getElementById('contact').addEventListener('click', function (event) { //HIDE THE ELEMENTS
  event.preventDefault();
  document.getElementById('contact-section').style.display = 'flex';
  document.getElementById('textContainer').style.display = 'none';
  document.getElementById('canvasContainer2').style.display = 'none';
  document.getElementById('about-section').style.display = 'none';
  document.getElementById('otherTextContainer').style.display = 'none';
  document.body.classList.add('hide-letters');
  showContactSection = true;
  showAboutSection = false;
});

document.getElementById('close-icon-contact').addEventListener('click', function () { //REVEAL THE ELEMENTS
  document.getElementById('contact-section').style.display = 'none';
  document.getElementById('textContainer').style.display = 'block';
  document.getElementById('canvasContainer2').style.display = 'block';
  document.getElementById('otherTextContainer').style.display = 'block';
  document.body.classList.remove('hide-letters');
  showContactSection = false; 
});

document.getElementById('close-icon-image').addEventListener('click', function(event) { //REVEAL THE ELEMENTS
  event.preventDefault();
  
  // Hide the HTML closing icon
  this.style.display = 'none';
  
  // Hide the full screen image and related elements
  showFullScreenImage = false;
  fullScreenImage = null;

  document.getElementById('canvasContainer2').style.display = 'block';
  document.getElementById('textContainer').style.display = '';
  document.getElementById('header').style.display = 'block';
  document.getElementById('otherTextContainer').style.display = 'block';
  window.set3DObjectVisibility(true);
  
  window.tl.resume();
  // Reset fullscreen mode flag
  isFullScreenMode = false;

  return;
});

document.getElementById('close-icon-text').addEventListener('click', function(event) {
  event.preventDefault();

  // Hide the HTML closing icon for text
  this.style.display = 'none';

  // Hide the image description
  document.getElementById('image-description').style.display = 'none';

  // Hide the full screen image text and related elements
  showFullScreenImageText = false;

  return;
});


const initTransitionIfNeeded = () => {
  if (transitionBeginning == null)
    transitionBeginning = new Date();
}

// returns a value between 0 and 1
const getTransitionProgress = () => {
  const timePassed = (new Date()).getTime() - transitionBeginning.getTime();
  const progress = timePassed / transitionSpeed;

  //console.log(timePassed, progress)
  if (progress >= 1) {
    transitionFinished = true;
    return 1;
  }
  return progress;
}

document.getElementById('reloadImage').addEventListener('click', function() {
  location.reload();
});
