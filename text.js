let selectedFont = 'Arial'; 

// The letters array
let letters = [];

function createLettersFromDiv(p) {
  const textContainer = p.select('#textContainer');

  let text = textContainer.html();
  createLetters(p, text, 0, 0); // Assuming x and y are 0
}

function createLetters(p, text, x, y) {
  x = parseFloat(x);
  y = parseFloat(y);
  const shouldAllFall = Math.random() < 0.5;
  const textSize = parseFloat(inputField.elt.style.fontSize);
  p.textSize(textSize);

  let offsetX = 0; // Offset for x position

  for (let i = 0; i < text.length; i++) {
    letters.push({
      char: text[i],
      x: x + offsetX,
      y: y,
      vy: 0,
      shouldFall: shouldAllFall,
      fallDelay: i * Math.random() * 100, 
      time: 0, 
      font: selectedFont,
    });
    offsetX += p.textWidth(text[i]); // Increase offset by current letter's width
  }
}

function updateLetter(letter, p) {
  if (letter.shouldFall && letter.time > letter.fallDelay) {
    letter.y += letter.vy;
    letter.vy += 0.05; // Gravity
  }
  if (letter.y > p.height) {
    letter.y = 0;
    letter.vy = 0;
  }
  letter.time++; // Increase time for each frame
}