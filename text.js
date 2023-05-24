window.onload = function() {
  // Array of possible continuations
  let continuations = ['can design stuff', "like to do things the unconventional way", 'believe I can fly'];

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
  textContainer.innerHTML = Array.from('Hello, I').map(c => c !== ' ' ? `<span class="letter">${c}</span>` : '&nbsp;').join('') + '<br>' + getRandomContinuation(continuations);

  // Select all the letters
  let letters = document.querySelectorAll('.letter');

  // Create a timeline for the animation
  let tl = gsap.timeline();

  // Calculate the distance to fall
  const distanceToFall = document.getElementById('canvasGlobalContainer').clientHeight - textContainer.getBoundingClientRect().top - textContainer.clientHeight + 20;

  // Add the animation to the timeline for each letter
  letters.forEach((letter, i) => {
    tl.to(letter, {
      y: distanceToFall,
      duration: 2,
      delay: Math.random() * 2, 
      ease: "power1.inOut"
    }, 0);
  });
};
