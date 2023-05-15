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
  slider = p.createSlider(10, 80, 20, 2);
  slider.parent(inputDiv);
  slider.changed(() => {
    inputField.style('font-size', slider.value() + 'px');
  })
  inputField.elt.focus();


  // Add a resize handle to the inputDiv
  /*const resizeHandle = p.createDiv();
  resizeHandle.addClass('resize-handle');
  resizeHandle.parent(inputDiv);
  resizeHandle.style('position', 'absolute');
  resizeHandle.style('bottom', '0px');
  resizeHandle.style('right', '0px');*/


  /*interact(inputDiv.elt)
  .resizable({
    edges: { left: false, right: true, bottom: true, top: false },
    modifiers: [
      interact.modifiers.aspectRatio({
        ratio: 'preserve',
      }),
    ],
    inertia: true,
  })
.on('resizemove', (event) => {
    let target = event.target;
    let x = parseFloat(target.getAttribute('data-x')) || 0;
    let y = parseFloat(target.getAttribute('data-y')) || 0;

    target.style.width = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
      'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // Update font size based on the resized div
    const fontSize = Math.min(event.rect.width, event.rect.height) / 2;
    inputField.style('font-size', fontSize + 'px');
  });*/

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
  console.log(inputField.elt.style.fontSize)
  console.log(textSize)

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