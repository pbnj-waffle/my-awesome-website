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
//let lastScrollPosition = 0;
let baselineScrollPos = window.scrollY || window.pageYOffset;
const otherTextContainer = document.getElementById("otherTextContainer");
const initialTopPosition = otherTextContainer.offsetTop;


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
  console.log(event);
  console.log(images)
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
  return false;
}


function isMouseOver3DObject(event) {
 
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2();
  
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(my3DModel, true);
  console.log(intersects);
  return intersects.length > 0;
  
}

function set3DObjectVisibility(visible) {
  renderer.domElement.style.display = visible ? 'block' : 'none';
}

window.set3DObjectVisibility = set3DObjectVisibility;

const init3D = () => {
  renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(window.innerWidth,window.innerWidth * 1.5);
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

document.addEventListener("mousedown", (event) => {
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

document.addEventListener('mouseup', () => {
  if (isDragging3DModel) {
    isDragging3DModel = false;
  }
  isMousePressedOn3D = false;
});

renderer.domElement.addEventListener("mousemove", (event) => {
  console.log(`isMouseOver3DObject: ${isMouseOver3DObject(event)}`);
  console.log(`isMouseOverImage: ${isMouseOverImage(event)}`);
  if (isMouseOver3DObject(event)) {
    setCursor('grab');  // use custom setCursor function
  } else if (isMouseOverImage(event)) {
    setCursor('pointer');  // use custom setCursor function
  } else {
    setCursor('arrow');  // use custom setCursor function
  }

  if (isDragging3DModel) {
    const deltaX = (event.clientX - lastMousePosition.x) * 0.01;
    const deltaY = (event.clientY - lastMousePosition.y) * 0.01;

    my3DModel.position.x += deltaX;
    my3DModel.position.y -= deltaY;
    camera.updateProjectionMatrix();

    lastMousePosition = { x: event.clientX, y: event.clientY };
  }

  lastMousePosition = { x: event.clientX, y: event.clientY };
});

 
renderer.domElement.addEventListener("mouseup", () => {
  if (isAnyImageActive()) return;

  isDragging3DModel = false;
  isMousePressedOn3D = false;
  renderer.domElement.style.cursor = "arrow";
});

renderer.domElement.addEventListener("mouseleave", () => {
  if (isAnyImageActive()) return;

  isDragging3DModel = false;
  isMousePressedOn3D = false;
  renderer.domElement.style.cursor = "arrow";
});

  // Move the event listeners here, after the renderer is created.
  window.addEventListener('scroll', function() {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);
  
    const currentScrollPos = window.scrollY || window.pageYOffset;
    const isScrollingDown = currentScrollPos > baselineScrollPos;
    baselineScrollPos = currentScrollPos;
  
    const parallaxFactor = isScrollingDown ? 0.5 : -0.5; // Change direction based on scroll direction
    const parallaxOffset = currentScrollPos * parallaxFactor;
    const maxOffset = 2;  // Adjust this value as necessary
    const minOffset = -2;  // Adjust this value as necessary

     // The element will move up as the window scrolls down
  otherTextContainer.style.transform = `translateY(-${parallaxOffset}px)`;
  
    if(my3DModel) {
      let targetY;
      if (isScrollingDown) {
        targetY = Math.min(parallaxOffset / 100, maxOffset);
      } else {
        targetY = Math.max(parallaxOffset / 100, minOffset);
      }
  
      new TWEEN.Tween(my3DModel.position)
        .to({ y: targetY }, 150)
        .start();
    }
  
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function() {
      // scrolling has stopped.
      TWEEN.removeAll();
    }, 66);
  
  }, false);


  window.addEventListener('resize', function(){
    /*videoContainer.style.width = `${window.innerWidth}px`;
  videoContainer.style.height = `${window.innerHeight}px`;
  document.getElementById('canvasContainer').style.top = `${window.innerHeight}px`;
  document.getElementById('canvasContainer2').style.top = `${window.innerHeight}px`;*/

    renderer.setSize(window.innerWidth, window.innerWidth * 1.5);
    camera.aspect = window.innerWidth / (window.innerWidth * 1.5);
    camera.updateProjectionMatrix();
  });

  renderer.domElement.addEventListener('mousemove', (event) => {
    lastMousePosition.x = event.clientX;
    lastMousePosition.y = event.clientY;
    
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

  renderer.domElement.addEventListener('mouseup', () => {
    isMousePressedOn3D = false;
  });

  renderer.domElement.addEventListener('mouseleave', () => {
    isMousePressedOn3D = false;
  });

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerWidth * 1.5), 0.1, 1000);
  camera.position.z = 5;

  camera.aspect = window.innerWidth / (window.innerWidth * 1.5);  // set aspect ratio here
  camera.updateProjectionMatrix();  // update the camera projection matrix

  loader = new FBXLoader();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  camera.add(pointLight);
  scene.add(camera);

  loadModel('./memoir.fbx');
  animate3D();
};

const animate3D = () => {
  TWEEN.update();
  requestAnimationFrame(animate3D);

  if (my3DModel) {
    if (isMousePressedOn3D && isMouseOver3DObject({ clientX: lastMousePosition.x, clientY: lastMousePosition.y })) {
      const deltaX = (lastMousePosition.x - renderer.domElement.clientWidth / 2) * 0.00001;//speed
      const deltaY = (lastMousePosition.y - renderer.domElement.clientHeight / 2) * 0.00001;//speed

      objectRotation.x += deltaY;
      objectRotation.y += deltaX;

      my3DModel.rotation.x = objectRotation.x;
      my3DModel.rotation.y = objectRotation.y;
    } else {
      // auto-rotation effect
      my3DModel.rotation.x += 0.001; //speed
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
    my3DModel.scale.set(3, 3, 3);

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