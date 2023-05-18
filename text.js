function createInputField(p, x, y) {
  console.log("createInputField called");
  const inputDiv = p.createDiv();
  inputDiv.position(x, y).style('width', 'auto').style('height', 'auto');
  inputDiv.style('z-index', '4');
  inputDiv.class('text-input-wrapper');
  //inputField = p.createInput('');
  inputField = p.createElement('textarea');
  inputField.parent(inputDiv);
  inputField.addClass('transparent-input', true);
  inputField.style('font-size', '20px');
  inputField.style('display', 'block');
  slider = p.createSlider(10, 80, 20, 5);
  slider.parent(inputDiv);
  slider.changed(() => {
    inputField.style('font-size', slider.value() + 'px');
  })
  inputField.elt.focus();
}


function saveText(p) {
  if (inputField) {
    const x = parseFloat(inputField.elt.parentElement.style.left);
    const y = parseFloat(inputField.elt.parentElement.style.top);
    createLetters(p, inputField.value(), x, y);
    inputField.parent().remove(); // Remove the inputDiv, which includes the handle
    inputField = null;
  }
}

function createLetters(p, text, x, y) {
  x = parseFloat(x);
  y = parseFloat(y);
  const shouldAllFall = Math.random() < 0.5; // Decide once whether all letters should fall or not
  const textSize = parseFloat(inputField.elt.style.fontSize); // Get the text size from the input field
  p.textSize(textSize);

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