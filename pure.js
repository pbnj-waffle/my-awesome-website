
document.getElementById('about').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('about-section').style.display = 'block';
  document.getElementById('textContainer').style.display = 'none';
  document.getElementById('canvasContainer2').style.display = 'none';
  document.getElementById('contact-section').style.display = 'none';
  showAboutSection = true;
});

document.getElementById('close-icon-about').addEventListener('click', function () {
  document.getElementById('about-section').style.display = 'none';
  document.getElementById('textContainer').style.display = 'block';
  document.getElementById('canvasContainer2').style.display = 'block';
  showAboutSection = false; 
});

document.getElementById('contact').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('contact-section').style.display = 'block';
  document.getElementById('textContainer').style.display = 'none';
  document.getElementById('canvasContainer2').style.display = 'none';
  document.getElementById('about-section').style.display = 'none';
  showContactSection = true;
});

document.getElementById('close-icon-contact').addEventListener('click', function () {
  document.getElementById('contact-section').style.display = 'none';
  document.getElementById('textContainer').style.display = 'block';
  document.getElementById('canvasContainer2').style.display = 'block';
  showContactSection = false; 
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