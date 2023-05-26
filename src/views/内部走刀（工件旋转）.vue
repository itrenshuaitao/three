<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//引入性能监视器stats.js
import Stats from "three/addons/libs/stats.module.js";
// 引入dat.gui.js的一个类GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

onMounted(() => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();

  // 实例化一个gui对象
  const gui = new GUI();
  //改变交互界面style属性
  gui.domElement.style.right = "0px";
  gui.domElement.style.top = "120px";
  gui.domElement.style.width = "300px";

  var extrudeSettings = {
    amount: 2,
    steps: 100,
    bevelEnabled: false,
    curveSegments: 80,
    depth: 150,
  };

const shapeWidth = 30;
  const shape = new THREE.Shape();
shape.moveTo(-shapeWidth, shapeWidth); //.currentPoint变为(10,0)
// 绘制直线线段，起点(10,0)，结束点(shapeWidth,0)
shape.lineTo(shapeWidth, shapeWidth);//.currentPoint变为(shapeWidth, 0)
shape.lineTo(shapeWidth, -shapeWidth);//.currentPoint变为(shapeWidth, shapeWidth)
shape.lineTo(-shapeWidth, -shapeWidth);//.currentPoint变为(10, 50)

  var holePath = new THREE.Path();
  holePath.absarc(0, 0, 24, 0, Math.PI * 2, false);
  shape.holes.push(holePath);

  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    opacity: 0.7,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotateX(Math.PI * 1.5);
  scene.add(mesh);

  const group = new THREE.Group();
  //   刀具
  const geometry1 = new THREE.CylinderGeometry(10, 10, 24, 32);
  const material1 = new THREE.MeshBasicMaterial({ color: "blue" });
  geometry1.translate(0, 12, 0);

  const cylinder = new THREE.Mesh(geometry1, material1);

  group.add(cylinder);

  const geometry2 = new THREE.BoxGeometry(6, 12, 3);

  const material2 = new THREE.MeshBasicMaterial({ color: "#f23e23" });
  geometry2.translate(0, -6, 0);

  const cylinder2 = new THREE.Mesh(geometry2, material2);
  group.add(cylinder2);
  group.translateY(12);
  //把group插入到场景中作为场景子对象
  scene.add(group);

  const meshAxesHelper = new THREE.AxesHelper(50);
  group.add(meshAxesHelper);

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
  renderer.setClearColor("pink", 0.5); //设置背景颜色

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

  const animationConfig = {
    max: 150,
    min: 12,
    isAdd: true,
  };

  let angle = 0; //用于圆周运动计算的角度值
  const R = 800; //相机圆周运动的半径

  // 渲染函数
  function render() {
    stats.update();
    angle += 0.01;
    // // 相机y坐标不变，在XOZ平面上做圆周运动
    camera.position.x = R * Math.cos(angle);
    camera.position.z = R * Math.sin(angle);
    camera.lookAt(0, 0, 0);
    if (animationConfig.isAdd) {
      group.position.y++;
      group.position.y === animationConfig.max &&
        (animationConfig.isAdd = false);
    } else {
      group.position.y--;
      group.rotateY(1); //旋转动画
       mesh.rotateZ(.1)
      group.position.y === animationConfig.min &&
        (animationConfig.isAdd = true);
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
