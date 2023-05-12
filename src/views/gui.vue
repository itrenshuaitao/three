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


// 实例化一个gui对象
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '0px';
gui.domElement.style.top = '20px';
gui.domElement.style.width = '300px';
//创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
const obj = {
    x: 30,
    y: 60,
    z: 300,
    color:'red',
    scale:{},
    bool:false,
};
// // gui界面上增加交互界面，改变obj对应属性
// gui.add(obj, 'x', 0, 100);
// gui.add(obj, 'y', 0, 50);
// gui.add(obj, 'z', 0, 60);
// gui.add(obj, 'bool').name('是否旋转');


const children = gui.addFolder('子菜单')
children.close();
 children.add(obj, 'bool').name('是否旋转');
 const children2 = children.addFolder('子子菜单')
 children2.close()



  // 创建3D场景对象Scene
  const scene = new THREE.Scene();

  //BoxGeometry：长方体
// const geometry = new THREE.BoxGeometry(100, 100, 100);
// SphereGeometry：球体
// const geometry = new THREE.SphereGeometry(50);
// CylinderGeometry：圆柱
const geometry = new THREE.CylinderGeometry(50,50,100);

// PlaneGeometry：矩形平面
// const geometry = new THREE.PlaneGeometry(100,50);
// CircleGeometry：圆形平面
// const geometry = new THREE.CircleGeometry(50);
  //材质对象Material
  const material = new THREE.MeshPhongMaterial({
    // color: 'ren', //设置材质颜色
      color: 0x9de363,
      specular: 0xfffffff, //高光部分的颜色0xff0000
    shininess: 20, 
    transparent: true, //开启透明
    opacity: 0.4, //设置透明度
    side: THREE.DoubleSide//材质两面可见
  });

const mesh = new THREE.Mesh(geometry, material); 
scene.add(mesh);





      // var textureLoader = new THREE.TextureLoader();
      // // 加载贴图
      // var texture = textureLoader.load("/images/2.jpg");
      // // 点精灵材质
      // var spriteMaterial = new THREE.SpriteMaterial({
      //   map: texture,//贴图
      //   color: 0xffff00,
      //   blending: THREE.AdditiveBlending,//在使用此材质显示对象时要使用何种混合。加法
      // });
      // var sprite = new THREE.Sprite(spriteMaterial);
      // // 发光范围
      // sprite.scale.set(100, 100, 100.0);
      // mesh.add(sprite);





// children2.add(mesh.position, 'x', 0, 180).onChange(function (value){
//     mesh.position.y = value
//     mesh.position.z = value
// });
// children2.add(mesh.position, 'y', 0, 180);
// children2.add(mesh.position, 'z', 0, 180);
// children2.open()

gui.add(mesh.position, 'x', 0, 180).onChange(function (value){
    mesh.position.y = value
    mesh.position.z = value
});
gui.add(mesh.position, 'y', 0, 180);
gui.add(mesh.position, 'z', 0, 180);
// 第三个参数数组||对象生成下拉框交互
gui.add(mesh.position, 'z', [0,100 ,180]);
gui.add(obj, 'scale', {
    // left: -100,
    // center: 0,
    // right: 100
    左: -100,//可以用中文
    中: 0,
    右: 100
}).name('位置选择').onChange(function (value) {
    mesh.position.x = value;
});

gui.addColor(obj, 'color').onChange(function(value){
    mesh.material.color.set(value);
});
 
//点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
const pointLight = new THREE.PointLight(0xffffff, 1.0);
// const spotLight = new THREE.SpotLight(0xffffff, 1.0);
pointLight.position.set(100, 100, 100);
// spotLight.target.position.set(100,100,100);
scene.add(pointLight)
//spotLight.target添加到场景中.target.position才会起作用
// scene.add(spotLight.target);

// 聚广源辅助对象，可视化聚广源
const spotLightHelper = new THREE.PointLightHelper(pointLight,0xffffff)
scene.add(spotLightHelper);

// gui.addColor(spotLight, 'color').name('聚光灯颜色');
// gui.add(spotLight, 'intensity').name('聚光灯亮度').step(0.1);


//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

// 通过GUI改变mesh.position对象的xyz属性
gui.add(ambient, 'intensity', 0, 2.0).name('环境光强度').step(0.1);


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
  camera.lookAt(0,0,0);//指向mesh对应的位置

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer({
    //渲染器锯齿属性
    antialias:false
  });
// 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x444444, 1); //设置背景颜色

//   renderer.antialias = true,
  // 定义threejs输出画布的尺寸(单位:像素px)

  renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
  renderer.render(scene, camera); //执行渲染操作

 

  // 渲染函数
  const clock = new THREE.Clock();

  //创建stats对象
  const stats = new Stats();

  // stats.domElement显示：渲染帧率  刷新频率,一秒渲染次数
  stats.setMode(0); //默认模式
  //stats.domElement显示：渲染周期 渲染一帧多长时间(单位：毫秒ms)
  // stats.setMode(1);

  //stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.domElement);
  // 渲染函数
  function render() {
    //  const spt = clock.getDelta()*1000;//毫秒
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
    stats.update();
    renderer.render(scene, camera); //执行渲染操作
     obj.bool&& mesh.rotateX(0.01);//每次绕y轴旋转0.01弧度
    // mesh.rotateY(0.02);//每次绕y轴旋转0.01弧度
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  render();
console.log(scene)
  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
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
