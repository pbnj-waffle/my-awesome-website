import * as THREE from 'https://threejs.org/build/three.module.js';
import { OBJLoader } from './OBJLoader.js';

let lastMousePosition = new THREE.Vector2();
let my3DModel;
let objectRotation = new THREE.Vector3();
let renderer, scene, camera, loader;
let isMousePressedOn3D = false;
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
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  return intersects.length > 0;
}



const init3D = () => {
  renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
document.getElementById('canvasContainer2').appendChild(renderer.domElement);

renderer.domElement.addEventListener("wheel", (event) => {
  if (isAnyImageActive()) return;

  lastMouseWheelDelta = event.deltaY;
});

  renderer.domElement.addEventListener("mousedown", (event) => {
    if (isAnyImageActive() || !isMouseOver3DObject(event)) {
      isDragging3DModel = false;
      return;
    }
  
    isDragging3DModel = true;
    lastMousePosition = { x: event.clientX, y: event.clientY };
  });
  
  renderer.domElement.addEventListener("mousemove", (event) => {
    if (isMouseOver3DObject(event)) {
      renderer.domElement.style.cursor = "grab";
    } else {
      renderer.domElement.style.cursor = "default";
    }
  
    if (isDragging3DModel && isMouseOver3DObject(event)) {
      const deltaX = (event.clientX - lastMousePosition.x) * 0.01;
      const deltaY = (event.clientY - lastMousePosition.y) * 0.01;
  
      my3DModel.position.x += deltaX;
      my3DModel.position.y -= deltaY;
  
      lastMousePosition = { x: event.clientX, y: event.clientY };
    }
  });
  
 
  renderer.domElement.addEventListener("mouseup", () => {
    if (isAnyImageActive()) return;
  
    isDragging3DModel = false;
    renderer.domElement.style.cursor = "default";
  });
  
  renderer.domElement.addEventListener("mouseleave", () => {
    if (isAnyImageActive()) return;
  
    isDragging3DModel = false;
    renderer.domElement.style.cursor = "default";
  });

  // Move the event listeners here, after the renderer is created.
  renderer.domElement.addEventListener('mousemove', (event) => {
    lastMousePosition.x = event.clientX;
    lastMousePosition.y = event.clientY;
  });
  renderer.domElement.addEventListener('mousedown', () => {
    isMousePressedOn3D = true;
  });

  renderer.domElement.addEventListener('mouseup', () => {
    isMousePressedOn3D = false;
  });

  renderer.domElement.addEventListener('mouseleave', () => {
    isMousePressedOn3D = false;
  });

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  loader = new OBJLoader();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  camera.add(pointLight);
  scene.add(camera);

  animate3D();
};

const animate3D = () => {
  requestAnimationFrame(animate3D);

  if (my3DModel) {
    if (isMousePressedOn3D && !isAnyImageActive() && isMouseOver3DObject({ clientX: lastMousePosition.x, clientY: lastMousePosition.y })) {
      const deltaX =
        (lastMousePosition.x - renderer.domElement.clientWidth / 2) * 0.0001;
      const deltaY =
        (lastMousePosition.y - renderer.domElement.clientHeight / 2) * 0.0001;

      objectRotation.x += deltaY;
      objectRotation.y += deltaX;
    }

    if (lastMouseWheelDelta !== 0 && !isAnyImageActive() && isMouseOver3DObject({ clientX: lastMousePosition.x, clientY: lastMousePosition.y })) {
      const scaleChange = lastMouseWheelDelta > 0 ? 1.02 : 0.98;
      my3DModel.scale.multiplyScalar(scaleChange);
      lastMouseWheelDelta = 0;
    }

    my3DModel.rotation.x = objectRotation.x;
    my3DModel.rotation.y = objectRotation.y;
    my3DModel.rotation.z = objectRotation.z;
  }

  renderer.render(scene, camera);
};



const loadModel = (url) => {
  loader.load(url, (model) => {
    if (my3DModel) scene.remove(my3DModel);
    my3DModel = model;
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