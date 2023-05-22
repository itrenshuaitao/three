<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//引入性能监视器stats.js
import Stats from "three/addons/libs/stats.module.js";

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { onMounted } from "vue";
onMounted(() => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(50, 50, 50); //长方体

  const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff, //材质颜色
    // side: THREE.FrontSide, //默认只有正面可见
    side: THREE.DoubleSide, //两面可见
    //            side: THREE.BackSide, //设置只有背面可见
    // wireframe: true, //线条模式渲染mesh对应的三角形数据
  });

  const mesh = new THREE.Mesh(geometry, material); //网格模型
  //   mesh.rotation.y += Math.PI/3;

  scene.add(mesh);

  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight("blue", 100);
  pointLight.position.set(100, 100, 100);
  scene.add(pointLight);

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  // 实例化一个透视投影相机对象
  const width = window.innerWidth - 200; //窗口文档显示区的宽度作为画布宽度
  const height = window.innerHeight - 97; //窗口文档显示区的高度作为画布高度
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
    //  alpha: true//背景透明

    //想把canvas画布上内容下载到本地，需要设置为true
    preserveDrawingBuffer: true,
  });

  //   renderer.setClearAlpha(0.6);
  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setClearColor(0x444444, 1); //设置背景颜色和透明度下

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

  //stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.domElement);
  // 渲染函数
  function render() {
    stats.update();
    // mesh.rotation.y+=0.01;
    // const axis = new THREE.Vector3(0,0,2);//向量axis
    // mesh.rotateOnAxis(axis,Math.PI/80);//绕axis轴旋转π/80
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
    const width = window.innerWidth - 200; //canvas画布高度
    const height = window.innerHeight - 97; //canvas画布宽度
    renderer.setSize(width, height);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = width / height;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
  };

  document.getElementById("red").addEventListener("click", function () {
    mesh.material.color.set(0xff0000);
  });
  document.getElementById("green").addEventListener("click", function () {
    mesh.material.color.set(0x00ff00);
  });

  // 鼠标单击id为download的HTML元素，threejs渲染结果以图片形式下载到本地
  document.getElementById("download").addEventListener("click", function () {
    console.log("download");
    const link = document.createElement("a");
    // 通过超链接herf属性，设置要保存到文件中的数据
    const canvas = renderer.domElement; //获取canvas对象
    link.href = canvas.toDataURL("image/png");
    // link.href = canvas.toDataURL("image/jpeg");
    // link.href = canvas.toDataURL("image/bmp");
    
    

    link.download = "threejs.png"; //下载文件名
    link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
  });
});
</script>

<template>
  <div class="main">
    <div style="height: 55px; background-color: rgb(0 0 0)">上面布局</div>
    <!-- 下 -->

    <div>
      <div
        id="left"
        style="
        position: absolute;
        top: 76px;
        background-color: blue
        width: 195px;
      "
      >
        下面左侧布局
        <div id="red" class="bu">红</div>
        <div id="green" class="bu" style="margin-left: 10px">绿</div>
        <button id="download" type="button" name="button">下载</button>
      </div>

      <div
        id="webgl"
        style="
          position: absolute;
          top: 76px;
          left: 200px;
          background-color: #ff0000;
        "
      >
        <div
          style="height: 55px; color: #ff0000; z-index: 2; position: absolute"
        >
          红色
        </div>

        下面右侧布局
      </div>
    </div>
  </div>
</template>
<style scoped>
.main {
  overflow: hidden;
  margin: 0px;
  background-color: pink;
}
</style>
