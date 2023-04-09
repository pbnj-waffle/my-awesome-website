function createCanvas() {
   
    var width = parseInt(document.getElementById("canvas-width").value);
    var height = parseInt(document.getElementById("canvas-height").value);
  
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = "1px solid black"; // Add border
  
    document.getElementById("canvas-container").appendChild(canvas);
  }
