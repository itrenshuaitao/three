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

  // const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
  // const vertices = new Float32Array([
  //     0, 0, 0, //顶点1坐标
  //     50, 0, 0, //顶点2坐标
  //     0, 25, 0, //顶点3坐标
  // ]);
  // // 顶点位置
  // geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);

  // const colors = new Float32Array([
  //     1, 0, 0, //顶点1颜色
  //     0, 0, 1, //顶点2颜色
  //     0, 1, 0, //顶点3颜色
  // ]);
  // // 设置几何体attributes属性的颜色color属性
  // //3个为一组,表示一个顶点的颜色数据RGB
  // geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

  // 点渲染模式
  // const material = new THREE.PointsMaterial({
  //     // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
  //     vertexColors:true,//默认false，设置为true表示使用顶点颜色渲染
  //     size: 20.0, //点对象像素尺寸
  // });
  // const points = new THREE.Points(geometry, material); //点模型对象

  // const material = new THREE.LineBasicMaterial({
  //     vertexColors:true,//使用顶点颜色渲染
  // });
  // const line = new THREE.Line(geometry, material);

  // const material = new THREE.MeshBasicMaterial({
  //     // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
  //     vertexColors:true,//默认false，设置为true表示使用顶点颜色渲染
  //     side: THREE.DoubleSide,
  // });
  // const mesh = new THREE.Mesh(geometry, material);

  // scene.add(mesh)

  // 三维样条曲线
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(70, 0, 80),
  ]);

  // 样条曲线curve作为TubeGeometry参数生成管道
  const geometry = new THREE.TubeGeometry(curve, 200, 5, 30);
  const texLoader = new THREE.TextureLoader();
  //纹理贴图
  const texture = texLoader.load("./images/1.jpg");
  //UV坐标U方向阵列模式
  texture.wrapS = THREE.RepeatWrapping;
  //纹理沿着管道方向阵列(UV坐标U方向)
  texture.repeat.x = 5;
  const material = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide, //双面显示看到管道内壁
  });

  const mesh = new THREE.Mesh(geometry, material);

  // 点渲染模式
  //   const material = new THREE.PointsMaterial({
  //       color: 0xffff00,
  //       size: 1.0 //点对象像素尺寸
  //   });

  //   const mesh = new THREE.Points(geometry, material);

  scene.add(mesh);

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

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  //   controls.target.set(1000, 0, 1000);
  controls.update(); //update()函数内会执行camera.lookAt(controls.targe)

  //   controls.enablePan = false; //禁止右键拖拽
  //   controls.enableZoom = false;//禁止缩放
  // controls.enableRotate = false; //禁止旋转
  //相机位置与观察目标点最小值
  controls.minDistance = 200;
  //相机位置与观察目标点最大值
  controls.maxDistance = 400;

  //创建stats对象
  const stats = new Stats();
  // stats.domElement显示：渲染帧率  刷新频率,一秒渲染次数
  stats.setMode(0); //默认模式
  //stats.domElement显示：渲染周期 渲染一帧多长时间(单位：毫秒ms)
  // stats.setMode(1);
  document.body.appendChild(stats.domElement);
  // 渲染函数
  // 渲染循环
  // 从曲线上等间距获取一定数量点坐标
  const pointsArr = curve.getSpacedPoints(1000);
  let i = 0; //在渲染循环中累加变化
  function render() {
    stats.update();
    //相机位置与目标观察点距离
    // const dis = controls.getDistance();
    // console.log("dis", dis);

    if (i < pointsArr.length - 1) {
      // 相机位置设置在当前点位置
      camera.position.copy(pointsArr[i]);
      // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
      // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
      camera.lookAt(pointsArr[i + 1]);
      i += 1; //调节速度
    } else {
      i = 0;
    }

    renderer.render(scene, camera); //执行渲染操作
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
});
</script>

<template>
  <div id="webgl"></div>
</template>

<style scoped>
</style>
