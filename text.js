let tl;
function generatePath() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  let pathData = `M 0,0 L ${width},0 L ${width},${height} L 0,${height} Z`;

  return pathData;
}

window.onload = function() {
  let possibleTexts = [/*'THE THOUGHT OF YOU LOADING THIS PAGE FOR THE FIRST TIME AND SEEING THIS MESSAGE INSTEAD OF THE OTHERS KEEPS ME UP AT NIGHT',*/ 'TRUST THE PROCESS'];

  function getRandomText(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    let text = array[randomIndex];
    let words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = Array.from(words[i]).map(c => `<span class="letter">${c}</span>`).join("");
    }
    return '<div class="uncut-word">' + words.join('</div>&nbsp;<div class="uncut-word">') + '</div>';
  }

  let textContainer = document.getElementById('textContainer');

  textContainer.innerHTML = getRandomText(possibleTexts);

  let letters = document.querySelectorAll('.letter');

  tl = gsap.timeline({paused: true});

  let randomNumber = Math.floor(Math.random() * 100);

  if(randomNumber >= 0 && randomNumber <= 41) {

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

  //var randomNumber2 = Math.floor(Math.random() * 100);

  if(randomNumber >= 42 && randomNumber <= 60) {
 
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


      tl.to(letter, {
        scale: Math.random() * maxSizeMultiplier, // add random scaling up to 10x original size
        
        x: "+=" + direction * (Math.random() * spreading), // add random horizontal motion
        rotation: rotation,
        duration: growthDuration,
        ease: "power2.in"
      }, 0);

    });
  }

 /* let pathElement = document.querySelector('#path');
  let svgElement = pathElement.parentElement;

  let pathData = generatePath();
  pathElement.setAttribute('d', pathData);
  
  let width = window.innerWidth;
  let height = window.innerHeight;
  svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  window.onresize = function() {
    let pathData = generatePath();
    pathElement.setAttribute('d', pathData);

    let width = window.innerWidth;
    let height = window.innerHeight;
    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
  };
  
  let pathString = "M50,150 ";

  // Determine the maximum letter size
let maxWidth = 0;
let maxHeight = 0;
letters.forEach(letter => {
  if (letter.offsetWidth > maxWidth) {
    maxWidth = letter.offsetWidth;
  }
  if (letter.offsetHeight > maxHeight) {
    maxHeight = letter.offsetHeight;
  }
});



  let numberOfCurves = 5;
  for (let i = 0; i < numberOfCurves; i++) {
    let x1 = Math.random() * (width - maxWidth);
    let y1 = Math.random() * (height - maxHeight);
    let x2 = Math.random() * (width - maxWidth);
    let y2 = Math.random() * (height - maxHeight);
    let x = Math.random() * (width - maxWidth);
    let y = Math.random() * (height - maxHeight);

    pathString += `C${x1},${y1} ${x2},${y2} ${x},${y} `;
  }

  document.getElementById('path').setAttribute('d', pathString);

  //var randomNumber3 = Math.floor(Math.random() * 100);

  if(randomNumber >= 61 && randomNumber <= 100) {
  
  
    gsap.registerPlugin(MotionPathPlugin); //register the MotionPathPlugin
  
    let motionPath = {
      path: "#path",
      align: "#path",
      alignOrigin: [0, 0],
      autoRotate: true,
    };
    let staggerAmount = 0.15; // Adjust this value to fit your desired speed and spacing between letters
  
    let repeatTimes = 1; // number of repeats

    tl.to('.letter', {
      motionPath: motionPath,
      duration: 20,
      repeat: repeatTimes,
      yoyo: true,
      stagger: {
        each: staggerAmount,
        repeat: 0,
        yoyo: true,
        wrap: (i, target, targets) => gsap.utils.wrap(0, targets.length, i)
      },
      onComplete: function() {
        // This function is called when the animation finishes
        gsap.set('.letter', {
          scale: 1,
          rotation: 0,
          x: 0,
          y: 0
        });
      }
    });
  }

  setTimeout(() => {
    tl.play().then(() => {
      let textElement = document.getElementById("textContainer");
      // GSAP animation is finished, show the original element
  
    });
  }, 20000);



  // Define the array of word pairs
const wordPairs = [
  ["experience", "message"],
  //["conform", "stand out"],
  ["planning", "discovery"],
  ["details", "big picture"]

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
  xPercent: -1200,
  duration: 1,
  ease: "power1.inOut",
  onStart: () => {
    // Set the xPercent to 0 to avoid the initial "jump"
    gsap.set("#ball1", { xPercent: 0 });
  }
}, 5)
.to("#ball2", {
  xPercent: 1200,
  duration: 1,
  ease: "power1.inOut",
  onStart: () => {
    // Set the xPercent to 0 to avoid the initial "jump"
    gsap.set("#ball2", { xPercent: 0 });
  }
}, 5);
 
  
*/
}