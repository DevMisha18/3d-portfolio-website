import "./style.css";
import * as THREE from "three";
import { OrbitControls, ThreeMFLoader } from "three/examples/jsm/Addons.js";

// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);

// Creating objects
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// PointList(light bolb)
const pointLight = new THREE.PointLight(0xffffff, 1000);
pointLight.position.set(20, 20, 10);

// AmbientLight(lights everything equaly)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);

// PointLightHelper(draws figure where pointLight is located)
const pointLightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointLightHelper, gridHelper);

// You can move view with your mouse, NOTE: requires updating in animate()
// Requires renderer.domElement for listening dom events
const orbitControls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
// Adding 200 stars
for (let i = 0; i < 200; i++) {
  addStar();
}

// Loading image(texture)
const spaceTexture = new THREE.TextureLoader().load("/space.jpg");
scene.background = spaceTexture;

// Map for texture
const reactTexture = new THREE.TextureLoader().load("/react.png");
const react = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({ map: reactTexture })
);
scene.add(react);

// Normal map for texture, NOTE: vectors bounce depending on rgb
const moonTexture = new THREE.TextureLoader().load("/moon.jpg");
const normalMap = new THREE.TextureLoader().load("/normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalMap })
);
moon.position.x = -10;
moon.position.z = 30;
scene.add(moon);

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  orbitControls.update();

  renderer.render(scene, camera);
}
animate();
