import * as THREE from 'https://threejs.org/build/three.module.js';
import { OBJLoader } from './OBJLoader.js';

let lastMousePosition = new THREE.Vector2();
let my3DModel;
let objectRotation = new THREE.Vector3();
let renderer, scene, camera, loader;

let isDragging3DModel = false;
let lastMouseWheelDelta = 0;
const raycaster = new THREE.Raycaster();



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

  renderer.setSize(window.innerWidth,window.innerWidth * 1.5);
  renderer.domElement.style.position = 'absolute';
document.getElementById('canvasContainer2').appendChild(renderer.domElement);

renderer.domElement.addEventListener("wheel", (event) => {
  if (isAnyImageActive()) return;

  if (isMouseOver3DObject(event)) {
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
    // prevent the event from being passed to the 2D canvas
    event.stopPropagation();
  } else {
    isDragging3DModel = false;
  }
});

document.addEventListener('mouseup', () => {
  isMousePressedOn3D = false;
  isDragging3DModel = false;
});

renderer.domElement.addEventListener("mousemove", (event) => {
  if (isMouseOver3DObject(event)) {
    renderer.domElement.style.cursor = "grab";
  } else {
    renderer.domElement.style.cursor = "default";
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
  renderer.domElement.style.cursor = "default";
});
  
renderer.domElement.addEventListener("mouseleave", () => {
  if (isAnyImageActive()) return;

  isDragging3DModel = false;
  isMousePressedOn3D = false;
  renderer.domElement.style.cursor = "default";
});

  // Move the event listeners here, after the renderer is created.
  window.addEventListener('resize', function(){
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

  loader = new OBJLoader();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  camera.add(pointLight);
  scene.add(camera);

  loadModel('./3d (4).obj');
  animate3D();
};

const animate3D = () => {
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
    
    // Scale down the model by a factor of 3
    my3DModel.scale.set(1/4, 1/4, 1/4);

    // Create a new bounding box
    const boundingBox = new THREE.Box3().setFromObject(my3DModel);

    // If you need to access the bounding box later, you can attach it to the model
    my3DModel.userData.boundingBox = boundingBox;

    scene.add(my3DModel);
  });
};

document.getElementById('upload3DObject').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.obj';
  input.onchange = (event) => {
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    loadModel(objectURL);
  };
  input.click();
});

init3D();
