<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js';

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { onMounted } from "vue";
onMounted(()=>{
  // 创建3D场景对象Scene
const scene = new THREE.Scene();
//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(100, 100, 100); 
//创建一个材质对象Material
// const material = new THREE.MeshBasicMaterial({
  //MeshLambertMaterial受光照影响
const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff, //设置材质颜色
    transparent:true,//开启透明
    opacity:0.5,//设置透明度
});


// 两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0,10,0);
scene.add(mesh); 

//点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.position.set(-200, 200, -300);
scene.add(pointLight)

//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
// directionalLight.position.set(80, 100, 50);

// 对比不同入射角，mesh表面对光照的反射效果
// directionalLight.position.set(100, 0, 0);
// directionalLight.position.set(0, 100, 0);
// directionalLight.position.set(100, 100, 100);
directionalLight.position.set(100, 60, 50);
//directionalLight.target默认指向坐标原点

// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh;
scene.add(directionalLight);

// 光源辅助观察
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
scene.add(pointLightHelper);

// DirectionalLightHelper：可视化平行光
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xff0000);
scene.add(dirLightHelper);





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
camera.lookAt(mesh.position);//指向mesh对应的位置

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
// 定义threejs输出画布的尺寸(单位:像素px)

renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
renderer.render(scene, camera); //执行渲染操作


// requestAnimationFrame实现周期性循环执行
// requestAnimationFrame默认每秒钟执行60次，但不一定能做到，要看代码的性能
// let i = 0;
// function render() {
//     i+=1;
//     console.log('执行次数'+i);
//     requestAnimationFrame(render);//请求再次执行函数render
// }
// render();


// 随机创建大量的模型,测试渲染性能
// const num = 800; //控制长方体模型数量
// for (let i = 0; i < num; i++) {
//     const geometry = new THREE.BoxGeometry(5, 5, 5);
//     const material = new THREE.MeshLambertMaterial({
//         color: 0x00ffff
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     // 随机生成长方体xyz坐标
//     const x = (Math.random() - 0.5) * 200
//     const y = (Math.random() - 0.5) * 200
//     const z = (Math.random() - 0.5) * 200
//     mesh.position.set(x, y, z)
//     scene.add(mesh); // 模型对象插入场景中
// }






// 渲染函数
const clock = new THREE.Clock();


//创建stats对象
const stats = new Stats();


// stats.domElement显示：渲染帧率  刷新频率,一秒渲染次数 
stats.setMode(0);//默认模式
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
      mesh.rotateX(0.01);//每次绕y轴旋转0.01弧度
    // mesh.rotateY(0.02);//每次绕y轴旋转0.01弧度
	requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();


// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
// controls.addEventListener('change', function () {
//       console.log('camera.position',camera.position);
//     renderer.render(scene, camera); //执行渲染操作
// });//监听鼠标、键盘事件



// 挂载到页面
// document.body.appendChild(renderer.domElement)
document.getElementById('webgl').appendChild(renderer.domElement);

// onresize 事件会在窗口被调整大小时发生
window.onresize = function () {
  console.log('窗口变化了')
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
};


})
</script>

<template>
<div id="webgl"></div>
</template>
