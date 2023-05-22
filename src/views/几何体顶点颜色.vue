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

  const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
  // 三维样条曲线
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(70, 0, 80),
  ]);
  const pointsArr = curve.getSpacedPoints(100); //曲线取点
  geometry.setFromPoints(pointsArr); //pointsArr赋值给顶点位置属性

  const pos = geometry.attributes.position;
  const count = pos.count; //顶点数量
  //   // 计算每个顶点的颜色值
  const colorsArr = [];
  //   for (let i = 0; i < count; i++) {
  //     const percent = i / count; //点索引值相对所有点数量的百分比
  //     //根据顶点位置顺序大小设置颜色渐变
  //     // 红色分量从0到1变化，蓝色分量从1到0变化
  //     colorsArr.push(percent, 0, 1 - percent); //蓝色到红色渐变色
  //   }

  // 根据顶点距离起点远近进行颜色插值计算
  const c1 = new THREE.Color(0x00ffff); //曲线起点颜色 青色
  const c2 = new THREE.Color(0xffff00); //曲线结束点颜色 黄色
  for (let i = 0; i < count; i++) {
    const percent = i / count; //点索引值相对所有点数量的百分比
    //根据顶点位置顺序大小设置颜色渐变
    const c = c1.clone().lerp(c2, percent); //颜色插值计算
    colorsArr.push(c.r, c.g, c.b);
  }

  //类型数组创建顶点颜色color数据
  const colors = new Float32Array(colorsArr);
  // 设置几何体attributes属性的颜色color属性
  geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

  const material = new THREE.LineBasicMaterial({
    vertexColors: true, //使用顶点颜色渲染
  });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  //   const c1 = new THREE.Color(0xff0000); //红色
  //   const c2 = new THREE.Color(0x0000ff); //蓝色
  // const c = new THREE.Color();

  // 执行.lerpColors(Color1,Color2, percent)通过一个百分比参数percent，可以控制Color1和Color2两种颜色混合的百分比，Color1对应1-percent，Color2对应percent。
  //   c.lerpColors(c1, c2, 1);
  // console.log('颜色插值结果',c);

  // .lerp c1与c2颜色混合，混合后的rgb值，赋值给c1的.r、.g、.b属性。

  // c1.lerp(c2, .5);
  // console.log(c1)
  //   const c = c1.clone().lerp(c2, 1); //颜色插值计算
  //   const c = c1.lerp(c2, 1); //颜色插值计算
  //   console.log("c=", c, "c1=", c1);

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
  // 渲染函数

  let angle = 0; //用于圆周运动计算的角度值
  const R = 500; //相机圆周运动的半径
  function render() {
    stats.update();
    angle += 0.01;
    // 相机y坐标不变，在XOZ平面上做圆周运动
    camera.position.x = R * Math.cos(angle);
    camera.position.z = R * Math.sin(angle);
    renderer.render(scene, camera); //执行渲染操作
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
        // .position改变，重新执行lookAt(0,0,0)计算相机视线方向
    camera.lookAt(0,0,0);
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
