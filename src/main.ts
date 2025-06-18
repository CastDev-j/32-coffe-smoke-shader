import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { GLTFLoader, Timer } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.close();

// Canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const [width, height] = [
  (canvas.width = window.innerWidth),
  (canvas.height = window.innerHeight),
];

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */

const gltfLoader = new GLTFLoader();

/**
 * Update all materials
 */

/**
 * Environment map
 */

/**
 * Material
 */

/**
 * Model
 */

gltfLoader.load("/models/bakedModel.glb", (gltf) => {
  const bakedMesh = gltf.scene.getObjectByName("baked") as THREE.Mesh;
  if (
    bakedMesh &&
    bakedMesh.material &&
    (bakedMesh.material as THREE.MeshStandardMaterial).map
  ) {
    (
      (bakedMesh.material as THREE.MeshStandardMaterial).map as THREE.Texture
    ).anisotropy = 8;
  }
  scene.add(gltf.scene);
});

/**
 * Lights
 */

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
camera.position.set(8, 10, 12);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animation loop
 */

const timer = new Timer();

const tick = () => {
  timer.update();
  // const elapsedTime = timer.getElapsed();
  // const deltaTime = timer.getDelta();

  // update controls to enable damping
  controls.update();

  // animations

  // render
  renderer.render(scene, camera);

  // request next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Handle window resize
 */

function handleResize() {
  const visualViewport = window.visualViewport!;
  const width = visualViewport.width;
  const height = visualViewport.height;

  canvas.width = width;
  canvas.height = height;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

/**
 * Usar el evento 'resize' de visualViewport para móviles
 */

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", handleResize);
} else {
  window.addEventListener("resize", handleResize);
}
