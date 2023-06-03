window.onload = function() {
  let possibleTexts = ['THE THOUGHT OF YOU LOADING THIS PAGE FOR THE FIRST TIME AND SEEING THIS MESSAGE INSTEAD OF THE OTHERS KEEPS ME UP AT NIGHT', 'TRUST THE PROCESS', 'TAKE A CHANCE ON ME'];

  function getRandomText(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    let text = array[randomIndex];

    let characters = Array.from(text).map(c => c !== ' ' ? `<span class="letter">${c}</span>` : '&nbsp;');

    return characters.join("");
  }

  let textContainer = document.getElementById('textContainer');

  textContainer.innerHTML = getRandomText(possibleTexts);

  let letters = document.querySelectorAll('.letter');

  let tl = gsap.timeline({paused: true});

  let randomNumber = Math.floor(Math.random() * 100);

  if(randomNumber >= 0 && randomNumber <= 100) {

    letters.forEach((letter, i) => {

      let letterHeight = letter.offsetHeight;
      let rotation = (Math.random() - 0.5) * 2 * 120;
      // Calculate the new bounds of the letter after rotation
  let letterDiagonal = Math.sqrt(2) * letter.offsetWidth / 2;

  // Calculate the distance to fall for each letter individually, based on its own vertical position
  let distanceToFallLetter = document.getElementById('canvasGlobalContainer').clientHeight - letter.getBoundingClientRect().top - letterHeight + 20;
  
  // Make sure the letter doesn't go beyond the container
  let maxDistance = document.getElementById('canvasGlobalContainer').clientHeight - letterDiagonal;
  if (distanceToFallLetter > maxDistance) {
    distanceToFallLetter = maxDistance;
  }
      tl.to(letter, {
        y: distanceToFallLetter,
        x: "+=" + (Math.random() - 0.5) * 50,
        rotation: rotation,
        duration: 2,
        delay: Math.random() * 2, 
        ease: "power2.in"
      }, 0);      
    });
  }

  var randomNumber2 = Math.floor(Math.random() * 100);

  if(randomNumber2 >= 0 && randomNumber2 <= 50) {

    // Select a random letter as the "center"
    let centerIndex = Math.floor(Math.random() * letters.length);

    // Add the animation to the timeline for each letter
    letters.forEach((letter, i) => {
      let letterHeight = letter.offsetHeight;
      let maxSizeMultiplier = 3;
      let growthDuration = 2;
      let spreading = 100; // maximum distance a letter can move horizontally

      let direction = i < centerIndex ? -1 : 1; // Determine direction based on whether the letter is before or after the center
      let rotation = (Math.random() - 0.5) * 2 * 120;

      // Calculate the new bounds of the letter after rotation
  let letterDiagonal = Math.sqrt(2) * letter.offsetWidth / 2;

  // Calculate the distance to fall for each letter individually, based on its own vertical position
  let distanceToFallLetter = document.getElementById('canvasGlobalContainer').clientHeight - letter.getBoundingClientRect().top - letterHeight + 20;
  
  // Make sure the letter doesn't go beyond the container
  let maxDistance = document.getElementById('canvasGlobalContainer').clientHeight - letterDiagonal;
  if (distanceToFallLetter > maxDistance) {
    distanceToFallLetter = maxDistance;
  }
      tl.to(letter, {
        scale: Math.random() * maxSizeMultiplier, // add random scaling up to 10x original size
        
        x: "+=" + direction * (Math.random() * spreading), // add random horizontal motion
        rotation: rotation,
        duration: growthDuration,
        ease: "power2.in"
      }, 0);

    });
  }

  // Define the array of word pairs
const wordPairs = [
  ["experience", "message"],
  ["go with the flow", "stand out"],
  ["planning", "discovery"]
];

// Choose a random pair of words
const chosenPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];

document.getElementById('leftWord').innerText = chosenPair[0];
document.getElementById('rightWord').innerText = chosenPair[1];

let balanceTl = gsap.timeline();

// Add the balance swing to the balance timeline
balanceTl.to("#balance", {
  rotation: 10,
  duration: 1.66,
  transformOrigin: "center",
  ease: "power1.inOut"
})
.to("#balance", {
  rotation: -10,
  duration: 1.66,
  transformOrigin: "center",
  ease: "power1.inOut"
})
.to("#balance", {
  rotation: 0,
  duration: 1.66,
  transformOrigin: "center",
  ease: "power1.inOut",
})
.to("#balance", {
  rotation: 0,
  duration: 1,
  transformOrigin: "center",
  ease: "power1.inOut",
  onComplete: () => {
    // Hide the balance container and the overlay after the balance timeline finishes
    document.getElementById('balanceContainer').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
});

// Add the ball movement to the balance timeline
balanceTl.to("#ball", {
  xPercent: 200,
  duration: 1.66,
  ease: "power1.inOut",
}, 0)
.to("#ball", {
  xPercent: -200,
  duration: 1.66,
  ease: "power1.inOut",
}, 1.66)
.to("#ball", {
  xPercent: 0,
  duration: 1.66,
  ease: "power1.inOut",
}, 3.32)
.add(() => {
  // Hide the original ball and reveal the two new balls
  document.getElementById('ball').classList.add('hidden');
  document.getElementById('ball1').classList.remove('hidden');
  document.getElementById('ball2').classList.remove('hidden');
}, 5)
// Move the new balls to the opposite sides
.to("#ball1", {
  xPercent: -500,
  duration: 1,
  ease: "power1.inOut",
  onStart: () => {
    // Set the xPercent to 0 to avoid the initial "jump"
    gsap.set("#ball1", { xPercent: 0 });
  }
}, 5)
.to("#ball2", {
  xPercent: 500,
  duration: 1,
  ease: "power1.inOut",
  onStart: () => {
    // Set the xPercent to 0 to avoid the initial "jump"
    gsap.set("#ball2", { xPercent: 0 });
  }
}, 5);

  
  
    setTimeout(() => {
      tl.play().then(() => {
        let textElement = document.getElementById("textContainer");
        // GSAP animation is finished, show the original element
        textElement.style.display = 'block';
    
      });
    }, 10000);
}
