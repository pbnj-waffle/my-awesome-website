import * as THREE from 'https://threejs.org/build/three.module.js';
import { OBJLoader } from './OBJLoader.js';

let lastMousePosition = new THREE.Vector2();
let my3DModel;
let objectRotation = new THREE.Vector3();
let renderer, scene, camera, loader;
let isMousePressedOn3D = false;


const init3D = () => {
  renderer = new THREE.WebGLRenderer({ alpha: true });
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
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvasContainer2').appendChild(renderer.domElement);

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
    if (isMousePressedOn3D && activeImage === null) {
      const deltaX = (lastMousePosition.x - renderer.domElement.clientWidth / 2) * 0.0001;
      const deltaY = (lastMousePosition.y - renderer.domElement.clientHeight / 2) * 0.0001;

      objectRotation.x += deltaY;
      objectRotation.y += deltaX;
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