let selectedFont = 'Arial'; 
function createInputField(p, x, y) {
  

  const inputDiv = p.createDiv();
  inputDiv.position(x, y).style('width', 'auto').style('height', 'auto');
  inputDiv.style('z-index', '4');
  inputDiv.class('text-input-wrapper');

  inputField = p.createElement('textarea');
  inputField.parent(inputDiv);
  inputField.addClass('transparent-input', true);
  inputField.style('font-size', '20px');
  inputField.style('display', 'block');

  // Create dropdown for font selection
  const fontDropdown = p.createSelect();
  fontDropdown.parent(inputDiv);

  // Add available fonts
  fontDropdown.option('Arial');
  fontDropdown.option('Verdana');
  fontDropdown.option('Courier New');
  // ... add more fonts as needed

  // Handle font change
  fontDropdown.changed(() => {
    inputField.style('font-family', fontDropdown.value());
    selectedFont = fontDropdown.value(); // Store the selected font
  });

  slider = p.createSlider(10, 280, 20, 5);
  slider.parent(inputDiv);
  slider.changed(() => {
    inputField.style('font-size', slider.value() + 'px');
  });

  inputField.elt.focus();
}

function moveInput(x, y) {
  inputField.parent().style.left = x + 'px';
  inputField.parent().style.top = y + 'px';
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
  const shouldAllFall = Math.random() < 0.9;
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

function handleCanvasClick(p, e) {

  if (!textInputMode) {
    isDragging3DModel = true;
    lastMousePosition = { x: e.clientX, y: e.clientY };
    isMousePressedOn3D = true;
    return;
  }

  if (e.button === 0) { // Check if the left button is clicked
    if (e.target.tagName == 'BUTTON' || inputField && e.target.closest('.text-input-wrapper')) {
      return;
    }

    if (textInputMode) {
        // Get the click position, ensuring it is within the canvas
        const clickX = Math.min(Math.max(0, e.clientX - p.canvas.offsetLeft), p.width);
        const clickY = Math.min(Math.max(0, e.clientY - p.canvas.offsetTop), p.height);

        if (inputField) {
          moveInput(clickX, clickY);
        }
        else
          createInputField(p, clickX, clickY);

        
        e.preventDefault();
      //}
    } else {
      mousePressed(p);
    }
  }
}
