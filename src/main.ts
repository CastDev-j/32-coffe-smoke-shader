import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { GLTFLoader, Timer } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import coffeeVertexShader from "./shaders/coffeeSmoke/vertexShader.glsl";
import coffeeFragmentShader from "./shaders/coffeeSmoke/fragmentShader.glsl";

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
const textureLoader = new THREE.TextureLoader();

/**
 *  Textures
 */

const perlinTexture = textureLoader.load("/textures/perlin.png");
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;

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
 * Smoke
 */

const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeometry.translate(0, 0.5, 0);
smokeGeometry.scale(1.5, 6, 1.5);
const smokeMaterial = new THREE.ShaderMaterial({
  vertexShader: coffeeVertexShader,
  fragmentShader: coffeeFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,  
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  // wireframe: true,
  uniforms: {
    uPerlinTexture: new THREE.Uniform(perlinTexture),
    uTime: new THREE.Uniform(0),
    uSpeed: new THREE.Uniform(1),
  },
});

const smokeMesh = new THREE.Mesh(smokeGeometry, smokeMaterial);
smokeMesh.position.set(0, 1.83, 0);
scene.add(smokeMesh);

gui
  .add(smokeMaterial.uniforms.uSpeed, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Smoke Speed");

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
  const elapsedTime = timer.getElapsed();
  // const deltaTime = timer.getDelta();

  // update controls to enable damping
  controls.update();

  // animations
  smokeMaterial.uniforms.uTime.value = elapsedTime;

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
