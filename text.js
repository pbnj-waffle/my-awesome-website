window.onload = function() {
  // Array of possible continuations
  let continuations = ['CAN DESIGN STUFF', "LIKE THE UNCONVENTIONAL", 'BELIEVE I CAN FLY'];

  // Function to select a random item from an array
  function getRandomContinuation(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    let continuation = array[randomIndex];

    // Wrap each character in a span, replacing space with a non-breaking space
    let characters = Array.from(continuation).map(c => c !== ' ' ? `<span class="letter">${c}</span>` : '&nbsp;');

    return characters.join("");
  }

  // Get the text container
  let textContainer = document.getElementById('textContainer');

  // Append "Hello, I " and a random continuation to the textContainer
  textContainer.innerHTML = Array.from('HELLO, I').map(c => c !== ' ' ? `<span class="letter">${c}</span>` : '&nbsp;').join('') + '<br>' + getRandomContinuation(continuations);

  // Select all the letters
  let letters = document.querySelectorAll('.letter');

  // Create a timeline for the animation
  let tl = gsap.timeline({paused: true});

  var randomNumber = Math.floor(Math.random() * 100);

  if(randomNumber >= 0 && randomNumber <= 100) {
    // Calculate the distance to fall
    const distanceToFall = document.getElementById('canvasGlobalContainer').clientHeight - textContainer.getBoundingClientRect().top - textContainer.clientHeight + 20;

    // Add the animation to the timeline for each letter
    letters.forEach((letter, i) => {
      let letterLineHeight = letter.parentNode.offsetHeight;
      let lineOffset = letter.offsetTop - textContainer.offsetTop;
      let letterHeight = letter.offsetHeight;
      let distanceToFallLetter = distanceToFall - lineOffset + letterLineHeight / 2 - letterHeight;

      tl.to(letter, {
        y: distanceToFallLetter,
        x: "+=" + (Math.random() - 0.5) * 50, // add random horizontal motion
        rotation: Math.random() * 360, // add random rotation
        duration: 2,
        delay: Math.random() * 2, 
        ease: "power1.inOut"
      }, 0);
    });
  }

  var randomNumber2 = Math.floor(Math.random() * 100);

  if(randomNumber2 >= 0 && randomNumber2 <= 50) {
    // Select a random letter as the "center"
    let centerIndex = Math.floor(Math.random() * letters.length);
    let centerLetter = letters[centerIndex];

    // Add the animation to the timeline for each letter
    letters.forEach((letter, i) => {
      let maxSizeMultiplier = 10;
      let growthDuration = 2;
      let spreading = 500; // maximum distance a letter can move horizontally

      let direction = i < centerIndex ? -1 : 1; // Determine direction based on whether the letter is before or after the center

      tl.to(letter, {
        scale: Math.random() * maxSizeMultiplier, // add random scaling up to 10x original size
        x: "+=" + direction * (Math.random() * spreading), // add random horizontal motion
        rotation: Math.random() * 10,
        duration: growthDuration,
        ease: "power1.inOut"
      }, 0);
    });
  }

  setTimeout(() => {
    tl.play().then(() => {
      let textElement = document.getElementById("textContainer");
      // GSAP animation is finished, show the original element
      textElement.style.display = 'block';
    });
  }, 5000);
}
