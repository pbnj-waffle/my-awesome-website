let canvas;

document.addEventListener('DOMContentLoaded', () => {
  canvas = new fabric.Canvas('c', {
    isDrawingMode: false,
  });

  const addTextButton = document.getElementById('addTextButton');
  addTextButton.addEventListener('click', () => {
    if (canvas.isDrawingMode) {
      canvas.isDrawingMode = false;
      addTextButton.innerText = 'Add Text';
    } else {
      canvas.isDrawingMode = true;
      addTextButton.innerText = 'Stop Typing';
    }
  });
});
