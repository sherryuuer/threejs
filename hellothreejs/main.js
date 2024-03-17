import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// scene
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// 再设定两个cube来看看posion的相对位置问题
// cube的position设定是相对于自己的，如果cube身处一个group中，那么position就会变成group的相对位置
// scale也是一样的理论：在group中设置也是相对于group的缩放
const cube2 = new THREE.Mesh(geometry, material);
const cube3 = new THREE.Mesh(geometry, material);
const group = new THREE.Group();
group.add(cube);
group.add(cube2);
group.add(cube3);
group.position.y = 1;
scene.add(group);

// 
scene.add(cube);

// 设定坐标的方法：设定position之x，y，z
cube.position.y = 1
cube2.position.x = 1
cube3.position.x = -1
// 旋转，group顺时针旋转了90度
// group.rotation.reorder('YZX')可以设置旋转的顺序
group.rotation.z = Math.PI * 0.5
// 坐标设定的另一种方法，直接设定3维向量：vector3
const tempVector = new THREE.Vector3(0, 1, 1);
cube.position.copy(tempVector);

// scale可以对cube对三个维度进行伸缩，可以直接修改，也可用set
// cube.scale.y = 2
cube.scale.set(0.5, 0.5, 0.5);

const axesHelper = new THREE.AxesHelper(2);
// 辅助坐标也可以被添加进cube也就是object中去
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  50, // field of view
  window.innerWidth / window.innerHeight,
  0.1,  // near
  1000  // far
);

// 在空间坐标中可以计算cube到相机的距离
console.log(cube.position.distanceTo(camera.position))

// const aspectRatio = window.innerWidth / window.innerHeight
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   1000
// );
scene.add(camera);


camera.position.z = 5;

// renderer
const renderer = new THREE.WebGLRenderer(
  // 增加一个渐变层也可以去掉锯齿
  // { antialias: true }
);
renderer.setSize(window.innerWidth, window.innerHeight);
// 去掉锯齿
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// orbitcontrols
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// 通过callback监听发生的event
// window.addEventListener("resize", () => {
//   console.log("resized!")
// })

// animate
function renderloop() {
  // 每次改变窗口都可以保持cube的相对相机视角大小
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  // 每一个帧都能重置窗口大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  requestAnimationFrame(renderloop);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

renderloop();
