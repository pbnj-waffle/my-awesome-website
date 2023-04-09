function createCanvas() {
    // Get canvas width and height input values
    var width = parseInt(document.getElementById("canvas-width").value);
    var height = parseInt(document.getElementById("canvas-height").value);
  
    // Create canvas element
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = "1px solid black"; // Add border
  
    // Append canvas to the DOM
    document.getElementById("canvas-container").appendChild(canvas);
  }
