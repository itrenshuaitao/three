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

  //BoxGeometry：长方体
  // const geometry = new THREE.BoxGeometry(100, 100, 100);
  // SphereGeometry：球体
  // const geometry = new THREE.SphereGeometry(50);
  // CylinderGeometry：圆柱
  // const geometry = new THREE.CylinderGeometry(50,50,100);
  // PlaneGeometry：矩形平面
  // const geometry = new THREE.PlaneGeometry(100,50);
  // CircleGeometry：圆形平面
  // const geometry = new THREE.CircleGeometry(50);

  //创建一个空的几何体对象
//   const geometry = new THREE.BufferGeometry();
 //矩形几何体PlaneGeometry的参数3,4表示细分数，默认是1,1
// const geometry = new THREE.PlaneGeometry(100,50,1,1);
// const geometry = new THREE.PlaneGeometry(100,50,2,2);

// 球体SphereGeometry参数2、3分别代表宽、高度两个方向上的细分数
// const geometry = new THREE.SphereGeometry( 30, 20, 24 );
// 几何体xyz三个方向缩放
// geometry.scale(1, 2, 1)

// 几何体沿着x轴平移50
// geometry.translate(50, 100, 0);

// 几何体绕着x轴旋转45度
// geometry.rotateZ(Math.PI / 4);
// geometry.center();

  // const geometry = new THREE.PlaneGeometry(100,50); //矩形平面几何体
  const geometry = new THREE.BoxGeometry(50,50,50); //长方体

  // console.log('几何体',geometry);
  // console.log('顶点位置数据',geometry.attributes.position);
  // console.log('顶点索引数据',geometry.index);
  //类型化数组创建顶点数据
  // const vertices = new Float32Array([
  //     0, 0, 0, //顶点1坐标
  //     50, 0, 0, //顶点2坐标
  //     0, 100, 0, //顶点3坐标
  //     0, 0, 10, //顶点4坐标
  //     0, 0, 100, //顶点5坐标
  //     50, 0, 10, //顶点6坐标
  // ]);

  // const vertices = new Float32Array([
  //     0, 0, 0, //顶点1坐标
  //     80, 0, 0, //顶点2坐标
  //     80, 80, 0, //顶点3坐标

  //     0, 0, 0, //顶点4坐标   和顶点1位置相同
  //     80, 80, 0, //顶点5坐标  和顶点3位置相同
  //     0, 80, 0, //顶点6坐标
  // ]);

  // 矩形平面，无索引，两个三角形，6个顶点
  // 每个顶点的法线数据和顶点位置数据一一对应
  // const normals = new Float32Array([
  //     0, 0, 1, //顶点1法线( 法向量 )
  //     0, 0, 1, //顶点2法线
  //     0, 0, 1, //顶点3法线
  //     0, 0, 1, //顶点4法线
  //     0, 0, 1, //顶点5法线
  //     0, 0, 1, //顶点6法线
  // ]);
  // // 设置几何体的顶点法线属性.attributes.normal
  // geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

  // 矩形平面，有索引，两个三角形，有2个顶点重合，有4个顶点
  // 每个顶点的法线数据和顶点位置数据一一对应
  const normals = new Float32Array([
    0,
    0,
    1, //顶点1法线( 法向量 )
    0,
    0,
    1, //顶点2法线
    0,
    0,
    1, //顶点3法线
    0,
    0,
    1, //顶点4法线
  ]);
  // 设置几何体的顶点法线属性.attributes.normal
//   geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

  const vertices = new Float32Array([
    0,
    0,
    0, //顶点1坐标
    80,
    0,
    0, //顶点2坐标
    80,
    80,
    0, //顶点3坐标
    0,
    80,
    0, //顶点4坐标
  ]);

  // Uint16Array类型数组创建顶点索引数据
  const indexes = new Uint16Array([
    // 下面索引值对应顶点位置数据中的顶点坐标
    0, 1, 2, 0, 2, 3,
  ]);

  // 创建属性缓冲区对象
  //3个为一组，表示一个顶点的xyz坐标
  const attribue = new THREE.BufferAttribute(vertices, 3);

  // 设置几何体attributes属性的位置属性
//   geometry.attributes.position = attribue;
  // 索引数据赋值给几何体的index属性
//   geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组

  const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff, //材质颜色
    // side: THREE.FrontSide, //默认只有正面可见
    side: THREE.DoubleSide, //两面可见
    //            side: THREE.BackSide, //设置只有背面可见
    // wireframe: true, //线条模式渲染mesh对应的三角形数据
  });

  // 点渲染模式
  // const material = new THREE.PointsMaterial({
  //     color: 0xffff00,
  //     size: 20.0 //点对象像素尺寸
  // });

  // 线材质对象
  // const material = new THREE.LineBasicMaterial({
  //     color: 0xff0000 //线条颜色
  // });
  // 创建线模型对象
  // const line = new THREE.Line(geometry, material);
  // 闭合线条
  // const line = new THREE.LineLoop(geometry, material);
  //非连续的线条
  const line = new THREE.LineSegments(geometry, material);

  const points = new THREE.Points(geometry, material); //点模型对象

  const mesh = new THREE.Mesh(geometry, material); //网格模型
  mesh.rotation.y += Math.PI/3;
//   mesh.rotation.y += Math.PI/3;
//   mesh.rotation.y -= Math.PI/3;
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
  renderer.setClearColor(0x444444, 1); //设置背景颜色

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
