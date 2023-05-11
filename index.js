import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
// 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近处平面距离
  1000 // 远处平面距离
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 添加光源
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// 创建地板
const groundGeometry = new THREE.PlaneGeometry(16, 16);
const groundMirror = new Reflector(groundGeometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0xb5b5b5
});
groundMirror.position.y = 0.5;
groundMirror.rotateX(- Math.PI / 2);
scene.add(groundMirror);

// 创建墙体
const wallGeometry = new THREE.BoxGeometry(16, 9, 0.1);
const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });

// 墙体2为视频video
const video = document.getElementById("video");
const texture = new THREE.VideoTexture(video);
const material = new THREE.MeshBasicMaterial({ map: texture });
const wall2 = new THREE.Mesh(wallGeometry, material);
wall2.position.set(0, 0, 10);
scene.add(wall2);

const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
wall3.rotation.y = Math.PI / 2;
wall3.position.set(-10, 0, 0);
scene.add(wall3);
const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
wall4.rotation.y = Math.PI / 2;
wall4.position.set(10, 0, 0);
scene.add(wall4);

// 创建一个简单的桌子
const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x994d00 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 0.6, 0);
scene.add(table);

// 添加物品到桌子上
const objectGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const objectMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const object1 = new THREE.Mesh(objectGeometry, objectMaterial);
object1.position.set(-0.5, 0.8, 0.4);
table.add(object1);
const object2 = new THREE.Mesh(objectGeometry, objectMaterial);
object2.position.set(0.8, 0.5, -0.4);
table.add(object2);

// 设置相机位置和目标
camera.position.set(2, 3, -6);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// 创建控制器并绑定相机和渲染器
const controls = new OrbitControls(camera, renderer.domElement);

// 监听键盘事件
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      camera.position.z -= 1;
      break;
    case "KeyA":
      camera.position.x -= 1;
      break;
    case "KeyS":
      camera.position.z += 1;
      break;
    case "KeyD":
      camera.position.x += 1;
      break;
  }
});
// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// 定位视颯后播支后臣
video.addEventListener("loadeddata", () => {
  console.log("play .... ")
  video.play();
});