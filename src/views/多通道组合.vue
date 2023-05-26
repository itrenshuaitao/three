<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// 引入渲染器通道RenderPass
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

// 引入OutlinePass通道
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
// 引入UnrealBloomPass通道
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
// 引入GlitchPass通道
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";

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

 

  const geometry = new THREE.BoxGeometry(50, 50, 50); //长方体
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "正方体"


  const geometry1 = new THREE.DodecahedronGeometry(30); //十二面体
  const material1 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  const mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.name = "十二面体"


mesh1.position.set(0, 90, 0);
scene.add(mesh,mesh1);
console.log(scene);


const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( -120, 120, -120 );
scene.add( light );


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
  //   const s = 0.5;//控制left, right, top, bottom范围大小
  // const camera = new THREE.OrthographicCamera(-s * 1, s * 1, s, -s, 1, 8000);

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
  //   renderer.render(scene, camera); //执行渲染操作

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  //   controls.target.set(1000, 0, 1000);
  controls.update(); //update()函数内会执行camera.lookAt(controls.targe)

  //   controls.enablePan = false; //禁止右键拖拽
  //   controls.enableZoom = false;//禁止缩放
  // controls.enableRotate = false; //禁止旋转
  //相机位置与观察目标点最小值
  //   controls.minDistance = 200;
  //相机位置与观察目标点最大值
  //   controls.maxDistance = 400;

  //创建stats对象
  const stats = new Stats();
  // stats.domElement显示：渲染帧率  刷新频率,一秒渲染次数
  stats.setMode(0); //默认模式
  //stats.domElement显示：渲染周期 渲染一帧多长时间(单位：毫秒ms)
  // stats.setMode(1);
  document.body.appendChild(stats.domElement);

 // 创建后处理对象EffectComposer，WebGL渲染器作为参数
const composer = new EffectComposer(renderer);
// 1. 创建一个渲染器通道，场景和相机作为参数
const renderPass = new RenderPass(scene, camera);
// 设置renderPass通道
composer.addPass(renderPass);

// 2. 创建OutlinePass通道
const v2 = new THREE.Vector2(window.innerWidth, window.innerWidth);
const outlinePass = new OutlinePass(v2, scene, camera);
outlinePass.selectedObjects = [mesh];

//模型描边颜色，默认白色         
outlinePass.visibleEdgeColor.set(0xffff00); 
//高亮发光描边厚度
outlinePass.edgeThickness = 4; 
//高亮描边发光强度
outlinePass.edgeStrength = 6; 
 //模型闪烁频率控制，默认0不闪烁
outlinePass.pulsePeriod = 2;

composer.addPass(outlinePass);

// 3. 设置glitchPass通道
// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);


  // 渲染函数

  function render() {
    stats.update();
    composer.render();
    // renderer.render(scene, camera); //执行渲染操作
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
    // .position改变，重新执行lookAt(0,0,0)计算相机视线方向
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  render();

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


  document.getElementById('aaa').addEventListener('click',function(){
    console.log(outlinePass.selectedObjects)
    outlinePass.selectedObjects =  outlinePass.selectedObjects[0].name ==="正方体"?[mesh1]:[mesh];
})
});
</script>

<template>
<div id="aaa">

    点我切换描边
</div>
  <div id="webgl"></div>
</template>

<style scoped>
</style>
