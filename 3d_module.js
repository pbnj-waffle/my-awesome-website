import * as THREE from 'https://threejs.org/build/three.module.js';
//import { OBJLoader } from './OBJLoader.js';
import { FBXLoader } from './FBXLoader.js';

let lastMousePosition = new THREE.Vector2();
let my3DModel;
let objectRotation = new THREE.Vector3();
let renderer, scene, camera, loader;

let isDragging3DModel = false;
let lastMouseWheelDelta = 0;
const raycaster = new THREE.Raycaster();
let isScrolling;
let baselineScrollPos = window.scrollY || window.pageYOffset;
let lastScrollPos = 0;
const otherTextContainer = document.getElementById("otherTextContainer");



function isAnyImageActive() {
  for (const imgData of images) {
    if (
      imgData.isDragging ||
      imgData.isResizingLeft ||
      imgData.isResizingRight ||
      imgData.isResizingTop ||
      imgData.isResizingBottom ||
      imgData.isResizingTopLeft ||
      imgData.isResizingTopRight ||
      imgData.isResizingBottomLeft ||
      imgData.isResizingBottomRight
    ) {
      return true;
    }
  }
  return false;
}

function isMouseOverImage(event) {
  // Only perform the check if not in fullscreen mode
  if (!showFullScreenImage) {
    for (const imgData of images) {
      if (
        event.offsetX > imgData.x &&
        event.offsetX < imgData.x + imgData.width &&
        event.offsetY > imgData.y &&
        event.offsetY < imgData.y + imgData.height
      ) {
        return true;
      }
    }
  }
  return false;
}


function isMouseOver3DObject(event) {
 
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2();
  
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(my3DModel, true);

  return intersects.length > 0;
  
}

function set3DObjectVisibility(visible) {
  renderer.domElement.style.display = visible ? 'block' : 'none';
}

window.set3DObjectVisibility = set3DObjectVisibility;

const init3D = () => {
  renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.domElement.style.position = 'absolute';
document.getElementById('canvasContainer2').appendChild(renderer.domElement);

renderer.domElement.addEventListener("wheel", (event) => {
  if (isAnyImageActive()) return;

  if (isMouseOver3DObject(event)) {
    event.stopPropagation();
    lastMouseWheelDelta = event.deltaY;

    if (lastMouseWheelDelta !== 0) {
      const scaleChange = lastMouseWheelDelta > 0 ? 1.02 : 0.98;
      my3DModel.scale.multiplyScalar(scaleChange);
      camera.updateProjectionMatrix();
      lastMouseWheelDelta = 0;
    }
  }
});

document.addEventListener("mousemove", (event) => {
  let aboutVisible = window.getComputedStyle(document.getElementById('about-section')).display !== 'none';
  let contactVisible = window.getComputedStyle(document.getElementById('contact-section')).display !== 'none';

  if (isMouseOver3DObject(event)) {
    setCursor('grab');
  } else if (isMouseOverImage(event) && !aboutVisible && !contactVisible) {
    setCursor('pointer'); 
  } else {
    setCursor('arrow');
  }

  if (isDragging3DModel) {
    console.log("You can zoom into the 3d object by using a mouse wheel");
    const deltaX = (event.clientX - lastMousePosition.x) * 0.01;
    const deltaY = (event.clientY - lastMousePosition.y) * 0.01;

    my3DModel.position.x += deltaX;
    my3DModel.position.y -= deltaY;
    camera.updateProjectionMatrix();

    lastMousePosition = { x: event.clientX, y: event.clientY };
  }

  lastMousePosition = { x: event.clientX, y: event.clientY };
});

 
renderer.domElement.addEventListener("mouseup",(event) => {
  if (isAnyImageActive()) return;
  if (isDragging3DModel) {
    isDragging3DModel = false;
  }
  isMousePressedOn3D = false;

  
  if (isMouseOver3DObject(event)) {
    setCursor('grab');  
  } else if (isMouseOverImage(event)) {
    setCursor('arrow');  // change cursor back to arrow after image is clicked
  } else {
    setCursor('arrow');  
  }
  
});

renderer.domElement.addEventListener("mouseleave", () => {
  if (isAnyImageActive()) return;

  isDragging3DModel = false;
  isMousePressedOn3D = false;
  renderer.domElement.style.cursor = "arrow";
});

  // Move the event listeners here, after the renderer is created.
  /*window.addEventListener('scroll', function() {
    let maxUpwardOffset = 8;
    let initialObjectPosition = 2;
    let thresholdScrollPos = 500;
    
    const currentScrollPos = window.scrollY || window.pageYOffset;
    let scrollDelta = lastScrollPos - currentScrollPos;
  
    // Limit the maximum value of scrollDelta
    const maxScrollDelta = 1000;  // Adjust this value as necessary
    scrollDelta = Math.max(Math.min(scrollDelta, maxScrollDelta), -maxScrollDelta);
    
    // Update lastScrollPos
    lastScrollPos = currentScrollPos;
    
    const isScrollingDown = scrollDelta < 0;
  
    // Only positive offset, as we want parallax effect upwards.
    const parallaxOffset = Math.abs(scrollDelta) / 1000;  
  
    // The element will move up as the window scrolls down
    otherTextContainer.style.transform = `translateY(-${parallaxOffset}px)`;
  
    if(my3DModel && currentScrollPos < thresholdScrollPos) {
        let targetY;
  
        if (isScrollingDown) {
            // We go upwards only
            targetY = Math.max(my3DModel.position.y - parallaxOffset, maxUpwardOffset);
        } else {
            // We return back to the initial position
            targetY = Math.min(my3DModel.position.y + parallaxOffset, initialObjectPosition);
        }
    
        new TWEEN.Tween(my3DModel.position)
            .to({ y: targetY }, 500)
            .easing(TWEEN.Easing.Circular.Out)  
            .start();
    }
  }, false);*/
  
  
  
  window.addEventListener('resize', function(){
    /*videoContainer.style.width = `${window.innerWidth}px`;
  videoContainer.style.height = `${window.innerHeight}px`;
  document.getElementById('canvasContainer').style.top = `${window.innerHeight}px`;
  document.getElementById('canvasContainer2').style.top = `${window.innerHeight}px`;*/

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / (window.innerHeight);
    camera.updateProjectionMatrix();
  });



  renderer.domElement.addEventListener("mousedown", (event) => {
  if (textInputMode) {
    return;
  }

  if (event.target === renderer.domElement && isMouseOver3DObject(event)) {
    isDragging3DModel = true;
    lastMousePosition = { x: event.clientX, y: event.clientY };
    isMousePressedOn3D = true;
    event.stopPropagation();
  }
});


  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  camera.aspect = window.innerWidth / window.innerHeight;  // set aspect ratio here
  camera.updateProjectionMatrix();  // update the camera projection matrix

  loader = new FBXLoader();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.2;
  spotLight.distance =800;
  spotLight.decay = 2;
  spotLight.position.set(50, 50, 50);
  scene.add(spotLight);
  

  loadModel('./memoir.fbx');
  animate3D();
};

const animate3D = () => {
  TWEEN.update();
  requestAnimationFrame(animate3D);

  if (my3DModel) {
    if (isMousePressedOn3D && isMouseOver3DObject({ clientX: lastMousePosition.x, clientY: lastMousePosition.y })) {
      const deltaX = (lastMousePosition.x - renderer.domElement.clientWidth / 2) * 0.0001;//speed
      const deltaY = (lastMousePosition.y - renderer.domElement.clientHeight / 2) * 0.0001;//speed

      objectRotation.x += deltaY;
      objectRotation.y += deltaX;

      my3DModel.rotation.x += deltaY;
      my3DModel.rotation.y += deltaX;
    } else {
      // auto-rotation effect
      my3DModel.rotation.x += 0.0015; //speed
    }

    if (lastMouseWheelDelta !== 0 && isMouseOver3DObject({ clientX: lastMousePosition.x, clientY: lastMousePosition.y })) {
      const scaleChange = lastMouseWheelDelta > 0 ? 1.02 : 0.98;
      my3DModel.scale.multiplyScalar(scaleChange);
      lastMouseWheelDelta = 0;
    }
  }

  renderer.render(scene, camera);
};





const loadModel = (url) => {
  loader.load(url, (model) => {
    
    if (my3DModel) scene.remove(my3DModel);
    my3DModel = model;
    my3DModel.position.y = 1;
    
    // Scale 
    const scale = Math.random() * (0.25 - 0.05) + 0.05;
    my3DModel.scale.set(scale, scale, scale);

    // Create a new bounding box
    const boundingBox = new THREE.Box3().setFromObject(my3DModel);

    // If you need to access the bounding box later, you can attach it to the model
    my3DModel.userData.boundingBox = boundingBox;

    scene.add(my3DModel);
  });
};


/*document.getElementById('upload3DObject').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.obj';
  input.onchange = (event) => {
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    loadModel(objectURL);
  };
  input.click();
});*/

init3D();