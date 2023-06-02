<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//引入性能监视器stats.js
import Stats from "three/addons/libs/stats.module.js";
// 引入dat.gui.js的一个类GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { onMounted } from "vue";
const gui = new GUI(); //创建GUI对象

onMounted(() => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#d2ead2");
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  //材质对象Material
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ffff, //设置材质颜色
    // transparent: true, //开启透明
    opacity: 0.9, //设置透明度
  });

  const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh

  //   scene.add(mesh); //网格模型添加到场景中
  const loader = new GLTFLoader();
  loader.load("Soldier.glb", function (gltf) {
    console.log("Loaded ", gltf);
    console.log("动画数据", gltf.animations);
    const model = gltf.scene;
    scene.add(model);

    //包含关键帧动画的模型作为参数创建一个播放器
    const mixer = new THREE.AnimationMixer(gltf.scene);
    //  获取gltf.animations[0]的第一个clip动画对象
    const clipAction = mixer.clipAction(gltf.animations[1]); //创建动画clipAction对象
    clipAction.play(); //播放动画


    const IdleAction = mixer.clipAction(gltf.animations[0]);
const RunAction = mixer.clipAction(gltf.animations[1]);
const WalkAction = mixer.clipAction(gltf.animations[3]);
IdleAction.play();
let ActionState = IdleAction;//当前处于播放状态的动画动作对象
// 通过UI按钮控制，切换动画运动状态
document.getElementById('Idle').addEventListener('click', function () {
    ActionState.stop();//播放状态动画终止
    IdleAction.play();
    ActionState = IdleAction;
})
document.getElementById('Run').addEventListener('click', function () {
    ActionState.stop();//播放状态动画终止
    RunAction.play();
    ActionState = RunAction;
})
document.getElementById('Walk').addEventListener('click', function () {
    ActionState.stop();//播放状态动画终止
    WalkAction.play();
    ActionState = WalkAction;
})


    //不循环播放
    // clipAction.loop = THREE.LoopOnce;
    // 0~2倍速之间调节
    gui.add(clipAction, "timeScale", 0, 2).step(0.1).name("倍速");
    const skeletonHelper = new THREE.SkeletonHelper(model);
    scene.add(skeletonHelper);
    // 如果想播放动画,需要周期性执行`mixer.update()`更新AnimationMixer时间数据
    const clock = new THREE.Clock();
    function loop() {
      requestAnimationFrame(loop);
      //clock.getDelta()方法获得loop()两次执行时间间隔
      const frameT = clock.getDelta();
      // 更新播放器相关的时间
      mixer.update(frameT);
    }
    loop();
  });

  // 给需要设置关键帧动画的模型命名
  mesh.name = "Box";
  const times = [0, 3, 6]; //时间轴上，设置三个时刻0、3、6秒
  // times中三个不同时间点，物体分别对应values中的三个xyz坐标
  const values = [0, 0, 0, 100, 0, 0, 0, 0, 100];
  // 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
  const posKF = new THREE.KeyframeTrack("Box.position", times, values);
  // 从2秒到5秒，物体从红色逐渐变化为蓝色
  const colorKF = new THREE.KeyframeTrack(
    "Box.material.color",
    [2, 5],
    [1, 0, 0, 0, 0, 1]
  );
  // 1.3 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒。
  const clip = new THREE.AnimationClip("test", 6, [posKF, colorKF]);
  //包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
  const mixer = new THREE.AnimationMixer(mesh);
  //AnimationMixer的`.clipAction()`返回一个AnimationAction对象
  const clipAction = mixer.clipAction(clip);

  //AnimationAction设置开始播放时间：从1秒时刻对应动画开始播放
  // clipAction.time = 2;
  //AnimationClip设置播放结束时间：到5秒时刻对应的动画状态停止
  // clip.duration = 3;

  //.play()控制动画播放，默认循环播放
  clipAction.play();
  //不循环播放
  clipAction.loop = THREE.LoopOnce;
  // 物体状态停留在动画结束的时候
  clipAction.clampWhenFinished = true;

  // clipAction.timeScale = 1;//默认
  // clipAction.timeScale = 2;//2倍速

  // 0~6倍速之间调节
  gui.add(clipAction, "timeScale", 0, 6);

  gui.add(clipAction, "time", 0, 6);

  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight(0xffffff, 1.0);
  pointLight.position.set(800, 900, 800);
  scene.add(pointLight);
  // 环境光
  let ambient = new THREE.AmbientLight("#fff", 2);
  scene.add(ambient);

  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  // 实例化一个透视投影相机对象
  const width = window.innerWidth; //窗口文档显示区的宽度作为画布宽度
  const height = window.innerHeight; //窗口文档显示区的高度作为画布高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 8000);
  //相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);
  // camera.lookAt(mesh.position);//指向mesh对应的位置

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer();
  // 定义threejs输出画布的尺寸(单位:像素px)

  renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

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

    const frameT = clock.getDelta();
    // 更新播放器相关的时间
    mixer.update(frameT);
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
    stats.update();
    renderer.render(scene, camera); //执行渲染操作

    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  render();

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
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

  document.getElementById("stop").addEventListener("click", function () {
    clipAction.stop(); //动画停止结束，回到开始状态
  });
  document.getElementById("play").addEventListener("click", function () {
    clipAction.play(); //播放动画
  });
  const bu = document.getElementById("bu");
  bu.addEventListener("click", function () {
    // AnimationAction.paused默认值false，设置为true，可以临时暂停动画
    if (clipAction.paused) {
      //暂停状态
      clipAction.paused = false; //切换为播放状态
      bu.innerHTML = "暂停"; // 如果改变为播放状态，按钮文字设置为“暂停”
    } else {
      //播放状态
      clipAction.paused = true; //切换为暂停状态
      bu.innerHTML = "继续"; // 如果改变为暂停状态，按钮文字设置为“继续”
    }
  });
});
</script>

<template>
  <div class="pos">
    <div id="Idle" class="bu">休息</div>
    <div id="Run" class="bu" style="margin-left: 10px">跑步</div>
    <div id="Walk" class="bu" style="margin-left: 10px">走路</div>
  </div>
  <div id="webgl"></div>
</template>
<style scoped>
</style>