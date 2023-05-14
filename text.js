function createInputField(p, x, y) {
  const inputDiv = p.createDiv();
  inputDiv.position(x, y);
  inputDiv.style('z-index', '4');
  inputField = p.createInput('');
  inputField.parent(inputDiv);
  inputField.addClass('transparent-input', true); 
  inputField.elt.focus();

  inputField.elt.addEventListener('blur', () => {
    if (document.activeElement !== inputField.elt) { // Add this condition
      createLetters(p, inputField.value(), x, y);
      inputField.remove();
      inputField = null;
    }
  });
}

function createLetters(p, text, x, y) {
  x = parseFloat(x);
  y = parseFloat(y);
  const shouldAllFall = Math.random() < 0.5; // Decide once whether all letters should fall or not

  for (let i = 0; i < text.length; i++) {
    letters.push({
      char: text[i],
      x: x + i * p.textWidth(text[i]), // Use textWidth() to properly space the characters
      y: y,
      vy: 0,
      shouldFall: shouldAllFall, // Set the shouldFall property for all letters based on the decided value
    });
  }
}


function updateLetter(letter, p) {
  if (letter.shouldFall) {
    letter.y += letter.vy;
    letter.vy += 0.2; // Gravity
  }
  if (letter.y > p.height) {
    letter.y = 0;
    letter.vy = 0;
  }
}
