function showCanvasSizeInputs() {
    var canvasSizeInputs = document.getElementById("canvas-size-inputs");
    if (canvasSizeInputs.classList.contains("hidden")) {
      canvasSizeInputs.classList.remove("hidden");
    } else {
      canvasSizeInputs.classList.add("hidden");
    }
  }
  
  function createCanvas() {
    // Get canvas width and height input values
    var width = parseInt(document.getElementById("canvas-width").value);
    var height = parseInt(document.getElementById("canvas-height").value);
  
    // Create canvas element
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = "1px solid black"; // Add border
  
    // Set position to absolute and left/top properties to 0 to position canvas at the same spot as previous one
    canvas.style.position = "absolute";
    canvas.style.left = "100";
    canvas.style.top = "100";
    canvas.style.rigt = "100";
    canvas.style.bottom = "100";
  
    // Append canvas to the DOM
    document.getElementById("canvas-container").appendChild(canvas);
  }
  
  
  
   