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

const geometry = new THREE.BufferGeometry(); //创建一个几何体对象

// 参数1和2表示椭圆中心坐标  参数3和4表示x和y方向半径
// const arc = new THREE.EllipseCurve(0, 0, 100, 100);
// 参数：0, 0圆弧坐标原点x，y  100：圆弧半径    0, 2 * Math.PI：圆弧起始角度
// const arc = new THREE.ArcCurve(0, 0, 50, 0, 2 * Math.PI);//// 完整圆弧
// const arc = new THREE.ArcCurve(0, 0, 50, 0,  Math.PI);// 半圆弧
const arc = new THREE.ArcCurve(0, 0, 50, 0,  Math.PI/2);// 1/4圆弧
// const arc = new THREE.ArcCurve(0, 0, 100, 0, Math.PI/2,true);//第六个参数 是否顺时针



//getPoints是基类Curve的方法，平面曲线会返回一个vector2对象作为元素组成的数组
const pointsArr = arc.getSpacedPoints(3); //分段数50，返回51个顶点
console.log('曲线上获取坐标',pointsArr);


// const pointsArr = [
//     // 三维向量Vector3表示的坐标值
//     new THREE.Vector3(0,0,0),
//     new THREE.Vector3(0,100,0),
//     new THREE.Vector3(0,100,100),
//     new THREE.Vector3(0,0,100),
//     new THREE.Vector3(10,0,100),
//     new THREE.Vector3(10,10,100),
//     new THREE.Vector3(10,0,100),
// ];
// const pointsArr = [
//     // 二维向量Vector2表示的坐标值
//     new THREE.Vector2(0,0),
//     new THREE.Vector2(100,0),
//     new THREE.Vector2(100,100),
//     new THREE.Vector2(0,100),
// ];

console.log('曲线上获取坐标',pointsArr);




const R = 100; //圆弧半径
const N = 26; //分段数量
// const sp = 2 * Math.PI / N;//两个相邻点间隔弧度
// const sp = 1 * Math.PI / N;//半圆弧
const sp = 2 * Math.PI / N;//圆弧

// 设置圆心坐标
const cx = 10;
const cy = 10;
// 批量生成圆弧上的顶点数据
const arr = [];
// N控制圆弧精度：就是创建多少个顶点
for (let i = 0; i < N+1; i++) {
    const angle =  sp * i;//当前点弧度
    // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    arr.push(x, y, 0);//xyz坐标
}

//类型数组创建顶点数据
const vertices = new Float32Array(arr);
// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3); 
// 设置几何体attributes属性的位置属性
// geometry.attributes.position = attribue;




geometry.setFromPoints(pointsArr);
// console.log('几何体变化',geometry.attributes.position);



// 点材质
// const material = new THREE.PointsMaterial({
//     color: 0xffff00,
//     size: 10.0 //点对象像素尺寸
// }); 
// 点模型
// const points = new THREE.Points(geometry, material);

// 线材质
const material = new THREE.LineBasicMaterial({
    color: 0xff0000 //线条颜色
});
// 创建线模型对象   构造函数：Line、LineLoop、LineSegments
const line = new THREE.Line(geometry, material); 
// const line = new THREE.LineLoop(geometry, material);//线条模型对象





  scene.add(line);


// 添加一个辅助网格地面
// const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
// scene.add(gridHelper);



    
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
  });
  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor('red', 0); //设置背景颜色

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
  <div id="webgl">


  </div>
</template>

<style scoped>

</style>
