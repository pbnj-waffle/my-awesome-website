/*document.addEventListener('click', function () {
  clickCounter++;

  if (clickCounter >= 10) { //the amount of clicks
    toggleTransition();
  }
});*/


/*const videoContainer = document.getElementById('videoContainer');
const videoElement = document.getElementById('myVideo');

videoElement.src = './1.mp4';

// Set the dimensions of the video container based on the window size.
videoContainer.style.width = `${window.innerWidth}px`;
videoContainer.style.height = `${window.innerHeight}px`;

videoElement.load();
videoElement.muted = true;

// Play the video when it's ready
videoElement.oncanplaythrough = function() {
videoElement.play();
};*/

// Array of possible continuations
let continuations = ['can design stuff', "like to do things the unconventional way", 'believe I can fly'];

// Function to select a random item from an array
function getRandomContinuation(array) {
let randomIndex = Math.floor(Math.random() * array.length);
return array[randomIndex];
}

// Get the text container
let textContainer = document.getElementById('textContainer');

// Append a random continuation to the predefined sentence
textContainer.innerHTML += getRandomContinuation(continuations);

/*function getRandomColor(p) {
  return p.color(p.random(255), p.random(255), p.random(255));
}

function toggleTransition() {
  var buttons = document.querySelectorAll('#buttonsContainer button');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.add('alt');
  }

  var marqueeTop = document.querySelector('.marquee-top');
  var marqueeBottom = document.querySelector('.marquee-bottom');
  
  marqueeTop.classList.add('alt');
  marqueeBottom.classList.add('alt');

  targetColor = getRandomColor(sketchInstance);  // assuming p is globally accessible

  // Reset the click counter
  clickCounter = 0;
}*/



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