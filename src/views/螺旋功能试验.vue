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


  const path = new THREE.LineCurve3(new THREE.Vector3(0, 0, 500), new THREE.Vector3(0, 0, 0));
   const materialTube = new THREE.MeshLambertMaterial({
    
    side:THREE.DoubleSide,//双面显示看到管道内壁
});
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(path, 40, 16, 25), materialTube);
  scene.add(mesh);


  const speed = 1; // 移动速度
  const initX = 0;
  const initY = 0;
  const limit = 2000; // 点的个数限制
  const radius = 100;
  const MAX_POINTS = 2000;
  // geometry
  const geometry = new THREE.BufferGeometry();

  // 创建顶点数据
  const positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  // draw range
  const drawCount = 2; // draw the first 2 points, only
  geometry.setDrawRange(0, 0);
  // material


const pos = geometry.attributes.position;
const count = pos.count; //顶点数量
// 计算每个顶点的颜色值
const colorsArr = [];
for (let i = 0; i < count; i++) {
    const percent = i / count; //点索引值相对所有点数量的百分比
    //根据顶点位置顺序大小设置颜色渐变
    // 红色分量从0到1变化，蓝色分量从1到0变化
    colorsArr.push(1 - percent, 0, percent); //蓝色到红色渐变色
}
//类型数组创建顶点颜色color数据
const colors = new Float32Array(colorsArr);
// 设置几何体attributes属性的颜色color属性
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);



  const material = new THREE.LineBasicMaterial({
    // color: 0xff0000,
     vertexColors: true, //使用顶点颜色渲染
  });
  // line
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  //点光源
  const point = new THREE.PointLight(0xffffff);
  point.position.set(0, 0, 300); //点光源位置
  scene.add(point); //点光源添加到场景中
  //环境光
  const ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  const width = window.innerWidth; //窗口文档显示区的宽度作为画布宽度
  const height = window.innerHeight; //窗口文档显示区的高度作为画布高度

  //创建相机对象
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 30000);
  //相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值
  camera.position.set(200, 200, 200);
  camera.lookAt(0, 0, 0); //指向mesh对应的位置

  // 添加一个辅助网格地面
  // const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
  // scene.add(gridHelper);

  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight();
  pointLight.position.set(100, 100, 100);
  scene.add(pointLight);

  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(1500);
  scene.add(axesHelper);

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

  renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
  console.log(line);

  let degree = 0;
  let z = 0;
  let index = 0;
//   let count = 0;
  // const positions = line.geometry.attributes.position.array;

  function render() {
    stats.update();
    if (index >= MAX_POINTS) {
      //   requestAnimationFrame(render);
      //   return;
    } else {
      const d = (++degree * Math.PI) / 10; //弧度
      const x = 20 * Math.cos(d);
      const y = 20 * Math.sin(d);
      z = z + 0.1;
      const i = index * 3;
      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
      index++;
      line.geometry.setDrawRange(0, index); //设置缓存的 .drawRange
      line.geometry.attributes.position.needsUpdate = true; // 该标志位指明当前 attribute 已经被修改过，且需要再次送入 GPU 处理。当开发者改变了该队列的值，则标志位需要设置为 true。
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
</script>

<template>
  <div id="webgl"></div>
</template>

<style scoped>
</style>
