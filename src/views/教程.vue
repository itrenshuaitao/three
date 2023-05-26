<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//引入性能监视器stats.js
import Stats from "three/addons/libs/stats.module.js";

// 引入dat.gui.js的一个类GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { onMounted } from "vue";

let animatedSwitch = {
  box: false,
  camera: false,
};

// 实例化一个gui对象
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = "0px";
gui.domElement.style.top = "20px";
gui.domElement.style.width = "300px";
const scene = new THREE.Scene();

const redMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

onMounted(() => {
  // 创建3D场景对象Scene

  // 添加一个辅助网格地面
  const gridHelper = new THREE.GridHelper(200, 15, 0x004444, 0x004444);
  scene.add(gridHelper);

  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight();
  pointLight.position.set(100, 100, 100);
  scene.add(pointLight);
  // // 光源辅助观察
  const pointLightHelper1 = new THREE.PointLightHelper(pointLight, 10);
  scene.add(pointLightHelper1); // 光源辅助观察
  gui.add(pointLight.position, "x", -300, 300).step(1).name("光源x");
  gui.add(pointLight.position, "y", -300, 300).step(1).name("光源y");
  gui.add(pointLight.position, "z", -300, 300).step(1).name("光源x");

  //   //环境光:没有特定方向，整体改变场景的光照明暗
  //   const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  //   scene.add(ambient);

  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  // 实例化一个透视投影相机对象
  const width = window.innerWidth; //窗口文档显示区的宽度作为画布宽度
  const height = window.innerHeight; //窗口文档显示区的高度作为画布高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
  //相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值
  camera.position.set(200, 200, 200);
  camera.lookAt(0, 0, 0); //指向mesh对应的位置

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer({
    //渲染器锯齿属性
    antialias: false,
  });
  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor("#BFE3DD", 1); //设置背景颜色
  // renderer.setClearAlpha(0.3);

  //   renderer.antialias = true,
  // 定义threejs输出画布的尺寸(单位:像素px)
  renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
  renderer.render(scene, camera); //执行渲染操作

  //创建stats对象
  const stats = new Stats();

  // stats.domElement显示：渲染帧率  刷新频率,一秒渲染次数
  stats.setMode(0); //默认模式
  //stats.domElement显示：渲染周期 渲染一帧多长时间(单位：毫秒ms)
  // stats.setMode(1);
  //   document.body.appendChild(stats.domElement);

  let angle = 0; //用于圆周运动计算的角度值
  let angle1 = 0; //用于圆周运动计算的角度值
  const R = 800; //相机圆周运动的半径
  // 渲染函数
  function render() {
    stats.update();
    if (animatedSwitch.box) {

      const obj =   scene.getObjectByName('cylinderGeometry')
      angle1 += 0.01;
      // // 相机y坐标不变，在XOZ平面上做圆周运动
      obj.position.x = 50 * Math.cos(angle1);
      obj.position.z = 50 * Math.sin(angle1);
      console.log(obj.position)
    }
    if (animatedSwitch.camera) {
      angle += 0.01;
      // // 相机y坐标不变，在XOZ平面上做圆周运动
      camera.position.x = R * Math.cos(angle);
      camera.position.z = R * Math.sin(angle);
      camera.lookAt(0, 0, 0);
      console.log(camera.position)

    }

    renderer.render(scene, camera); //执行渲染操作
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  render();

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  //   controls.target.set(1000, 0, 1000);
  controls.update(); //update()函数内会执行camera.lookAt(controls.targe)

  // 挂载到页面
  // document.body.appendChild(renderer.domElement)
  document.getElementById("webgl").appendChild(renderer.domElement);

  // onresize 事件会在窗口被调整大小时发生
  window.onresize = function () {
    console.log("窗口变化了");
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
  };
});

const addGeometry = (e) => {
  const geometry = new THREE.BoxGeometry(20, 10, 10); //长方体
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
  });
  // 两个参数分别为几何体geometry、材质material
  const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  mesh.position.set(0, 5, 0);

  const coneGeometry = new THREE.ConeGeometry(5, 20, 32);
  const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cone = new THREE.Mesh(coneGeometry, coneMaterial);
  cone.position.set(25, 10, 0);

  const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.position.set(50, 10, 0);
  cylinder.name = "cylinderGeometry";

  if (e.target.checked) {
    scene.add(mesh, cone, cylinder);
  } else {
    scene.remove(...scene.children.filter((mesh) => mesh.isMesh));
  }
    console.log("scene", scene);

};

const changeMetaerial = () => {
  scene.children
    .filter((mesh) => mesh.isMesh && mesh.type === "Mesh")
    .map((mesh) => {
      //创建一个材质对象Material
      // MeshBasicMaterial  基础（无反射效果）
      // MeshLambertMaterial  漫反射
      // MeshPhongMaterial   高光 镜面
      // MeshStandardMaterial   物理
      // MeshPhysicalMaterial   物理
      mesh.material = redMaterial;
    });
  gui.addColor(redMaterial, "color").name("材质颜色");
};

const openCamera = (e) => {
  animatedSwitch.camera = e.target.checked;
};

const openBox = (e) => {
  animatedSwitch.box = e.target.checked;
};
</script>

<template>
  <div id="webgl"></div>
  <div class="action">
    <div>
      <input type="checkbox" @click="addGeometry" />
      <label>添加几何体</label>
    </div>
    <div>
      <input type="checkbox" @click="changeMetaerial" />
      <label>修改材质</label>
    </div>
    <div>
      <input type="checkbox" @click="openCamera" />
      <label>开启相机动画</label>
    </div>
    <div>
      <input type="checkbox" @click="openBox" />
      <label>开启物体动画</label>
    </div>
  </div>
</template>

<style scoped>
.action {
  position: absolute;
  top: 0;
}
</style>
