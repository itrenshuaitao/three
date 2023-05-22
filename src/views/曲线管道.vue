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

onMounted(() => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  // 三维样条曲线
  // const path = new THREE.CatmullRomCurve3([
  //     new THREE.Vector3(-50, 20, 90),
  //     new THREE.Vector3(-10, 40, 40),
  //     new THREE.Vector3(0, 0, 0),
  //     new THREE.Vector3(60, -60, 0),
  //     new THREE.Vector3(70, 0, 80)
  // ]);

  // LineCurve3创建直线段路径
  // const path = new THREE.LineCurve3(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, 0, 0));

  // p1、p2、p3表示三个点坐标
//   const p1 = new THREE.Vector3(-80, 0, 0);
//   const p2 = new THREE.Vector3(20, 100, 0);
//   const p3 = new THREE.Vector3(80, 0, 100);
  // 三维二次贝赛尔曲线
//   const path = new THREE.QuadraticBezierCurve3(p1, p2, p3);

  // path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
//   const geometry = new THREE.TubeGeometry(path, 40, 4, 25);



// 创建多段线条的顶点数据
const p1 = new THREE.Vector3(0, 0,100)
const p2 = new THREE.Vector3(0, 0,30);
const p3 = new THREE.Vector3(0, 0,0);
const p4 = new THREE.Vector3(30, 0, 0);
const p5 = new THREE.Vector3(100, 0, 0);
// 1. 3D直线线段
const line1 = new THREE.LineCurve3(p1, p2);
// 2. 三维二次贝塞尔曲线
const curve = new THREE.QuadraticBezierCurve3(p2, p3, p4);
// 3. 3D直线线段
const line2 = new THREE.LineCurve3(p4, p5);

const CurvePath = new THREE.CurvePath(); 
// 三条线拼接为一条曲线
CurvePath.curves.push(line1, curve, line2); 

// CurvePath:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
const geometry = new THREE.TubeGeometry(CurvePath, 50, 2, 25);



  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide, //双面显示看到管道内壁
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 可视化curve.getPoints从曲线上获取的点坐标
  const material2 = new THREE.PointsMaterial({
    color: 0xff00ff,
    size: 10,
  });
  //点模型对象
  const points = new THREE.Points(geometry, material2);
  // scene.add(points);

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
  //   renderer.setClearColor('pink', 1); //设置背景颜色

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
  <div id="webgl"></div>
</template>

<style scoped>
</style>
