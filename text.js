function createInputField(p, x, y) {
    inputField = p.createInput('');
    inputField.position(x, y);
    inputField.elt.focus();
    inputField.elt.addEventListener('blur', () => {
      console.log('Input:', inputField.value());
      createLetters(p, inputField.value(), x, y);
      inputField.remove();
      inputField = null;
    });
  }
  
  
  function createLetters(p, text, x, y) {
    for (let i = 0; i < text.length; i++) {
      letters.push({
        char: text[i],
        x: x + i * 10,
        y: y,
        vy: 0,
      });
    }
  }
  
  function updateLetter(letter, p) {
    letter.y += letter.vy;
    letter.vy += 0.2; // Gravity
    if (letter.y > p.height) {
      letter.y = 0;
      letter.vy = 0;
    }
  }
  