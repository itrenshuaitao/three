<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//引入性能监视器stats.js
import Stats from "three/addons/libs/stats.module.js";

// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { onMounted } from "vue";

onMounted(() => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();


// 实例化一个gui对象
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '0px';
gui.domElement.style.top = '20px';
gui.domElement.style.width = '300px';


// const geometry = new THREE.PlaneGeometry(200, 100); //矩形平面
// // const geometry = new THREE.BoxGeometry(200, 100,100); //长方体
// // const geometry = new THREE.SphereGeometry(60, 25, 25); //球体

// console.log('uv',geometry.attributes.uv);



// //纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// // .load()方法加载图像，返回一个纹理对象Texture
// const texture = texLoader.load('images/3.jpg');
// const material = new THREE.MeshLambertMaterial({
//     // 设置纹理贴图：Texture对象作为材质map属性的属性值
//     map: texture,//map表示材质的颜色贴图属性
// });
console.log('material',material)



      var geometry = new THREE.SphereGeometry(30, 32, 16);
      var material = new THREE.MeshLambertMaterial({ color: 0xffff00 });





  const mesh = new THREE.Mesh(geometry, material); //网格模型

  scene.add(mesh);

     // 加载贴图
      var texture = texLoader.load("images/4.png");
      // 点精灵材质
      var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,//贴图
        color: 0xffff00,
        blending: THREE.AdditiveBlending,//在使用此材质显示对象时要使用何种混合。加法
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      // 发光范围
      sprite.scale.set(100, 100, 1.0);
      mesh.add(sprite);
gui.addColor(material, 'color').onChange((value)=>{
    spriteMaterial.color=value
    });
  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight();
  pointLight.position.set(100, 100, 100);
  scene.add(pointLight);

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

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
    alpha: true
  });
  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x444444, 1); //设置背景颜色

  //   renderer.antialias = true,
  // 定义threejs输出画布的尺寸(单位:像素px)

  renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
  renderer.render(scene, camera); //执行渲染操作

console.log("scene",scene)
      // scene.background = new THREE.Color("#d2ead2");
      // gui.addColor(scene, "background").name("场景颜色");
  //创建stats对象
  const stats = new Stats();

  // stats.domElement显示：渲染帧率  刷新频率,一秒渲染次数
  stats.setMode(0); //默认模式
  //stats.domElement显示：渲染周期 渲染一帧多长时间(单位：毫秒ms)
  // stats.setMode(1);
  document.body.appendChild(stats.domElement);
  // 渲染函数
  function render() {
    stats.update();

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
</script>

<template>
  <div id="webgl"></div>
</template>
