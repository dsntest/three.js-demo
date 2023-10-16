import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';
// import DPlayer from 'dplayer';

// 创建场景、相机和渲染器
const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0x443333 );
// scene.fog = new THREE.Fog( 0x443333, 1, 4 );

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

const spotLight = new THREE.SpotLight();
spotLight.angle = Math.PI / 16;
spotLight.penumbra = 0.5;
// spotLight.castShadow = true;
spotLight.position.set(-1, 16, 1);
scene.add(spotLight);

// 创建地板
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshPhongMaterial({ color: 0x230023, specular: 0x101010 })
);
plane.rotation.x = - Math.PI / 2;
plane.position.y = - 0.0001;
plane.position.set(0, -5, 0);

plane.receiveShadow = true;
scene.add(plane);

// const geoFloor = new THREE.BoxGeometry(20, 8, 20);
// const matStdFloor = new THREE.MeshStandardMaterial({ color: 0xbcbcbc, roughness: 0.1, metalness: 0 });
// const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
// scene.add(mshStdFloor);

const groundGeometry = new THREE.PlaneGeometry(1, 1);
const groundMirror = new ReflectorForSSRPass(groundGeometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth,
  textureHeight: window.innerHeight,
  color: 0x888888,
  useDepthTexture: true,
});
groundMirror.material.depthWrite = false;
groundMirror.rotation.x = - Math.PI / 2;
groundMirror.visible = false;
scene.add(groundMirror);


const selects = [];
// 创建墙体
const wallGeometry = new THREE.BoxGeometry(16, 9, 0.1);
const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, roughness: 0.1, metalness: 0  });

// 墙体2为摄像头采集
const cam = document.createElement('video');
const camTexture = new THREE.VideoTexture(cam);

// 创建材质
const camMaterial = new THREE.MeshBasicMaterial({ map: camTexture });

// 创建网格
const wall2 = new THREE.Mesh(wallGeometry, camMaterial);
wall2.position.set(0, 0, 10);
scene.add(wall2);
selects.push(wall2);

// 获取摄像头数据
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
.then(stream => {
    cam.srcObject = stream;
    cam.play();
})
.catch(error => {
    console.error('Error accessing camera:', error);
});

const dp = new DPlayer({
  container: document.getElementById('dplayer'),
  autoplay: true,
  controlBar: true,
  danmaku: {
    hide: false
  },
  video: {
      url: 'https://t-tehlsvodhls02.vhallyun.com/vhallyun/vhallcoop/dbf78de09fa098fa018e9e17cd1e1581/ef53877c/dbf78de09fa098fa018e9e17cd1e1581.m3u8?token=2E2CB97A_NDMwNTc4NDYzXzY1MkQwMEM5X1pXWTFNemczTjJNX01USTNNekExX3ZvZA',
      type: 'hls'
  }
});

// const video = document.getElementById("video");
const videoTexture = new THREE.VideoTexture(dp.video);
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const wall3 = new THREE.Mesh(wallGeometry, videoMaterial);
wall3.rotation.y = Math.PI / 2;
wall3.position.set(-10, 0, 0);
scene.add(wall3);

const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
wall4.rotation.y = Math.PI / 2;
wall4.position.set(10, 0, 0);
scene.add(wall4);


// composer

const composer = new EffectComposer(renderer);
const ssrPass = new SSRPass({
  renderer,
  scene,
  camera,
  width: innerWidth,
  height: innerHeight,
  groundReflector: true,
  selects: selects
});



ssrPass.groundReflector = groundMirror;
ssrPass.selects = selects;

composer.addPass(ssrPass);
composer.addPass(new ShaderPass(GammaCorrectionShader));

groundMirror.fresnel = true;
groundMirror.distanceAttenuation = ssrPass.distanceAttenuation;
ssrPass.maxDistance = .1;
groundMirror.maxDistance = ssrPass.maxDistance;
ssrPass.opacity = 1;
groundMirror.opacity = ssrPass.opacity;


// 创建一个简单的桌子
const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x994d00 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, -5, 0);
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
  composer.render();
  renderer.render(scene, camera);
}
animate();


// // 定位视颯后播支后臣
// video.addEventListener("loadeddata", () => {
//   console.log("play .... ");
//   video.play();
// });


// 监听窗口大小变化
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  ssrPass.setSize(window.innerWidth, window.innerHeight);
});
