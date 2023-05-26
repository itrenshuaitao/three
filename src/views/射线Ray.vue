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

//   const ray = new THREE.Ray();
//   ray.origin.set(0, 0, 70); //起点
//   // 表示射线沿着y轴正方向
//   ray.direction = new THREE.Vector3(0, 1, 0);
//   // 表示射线沿着y轴负方向
//   // ray.direction = new THREE.Vector3(0,-1,0);
//   console.log(ray);

//   // 三角形三个点坐标
//   const p1 = new THREE.Vector3(0, 25, 50);
//   const p2 = new THREE.Vector3(-30, 25, 80);
//   const p3 = new THREE.Vector3(30, 25, 80);
//   const point = new THREE.Vector3(); //用来记录射线和三角形的交叉点
//   // `.intersectTriangle()`计算射线和三角形是否相交叉，相交返回交点，不相交返回null
//   // .intersectTriangle()参数4设为true，表示进行背面剔除，虽然从几何空间上讲，该案例源码射线和三角形虽然交叉，但在threejs中，三角形背面对着射线，视为交叉无效，进行背面剔除，返回值r是null。
//   const result = ray.intersectTriangle(p1, p2, p3, false, point);
//   console.log("交叉点坐标", point);
//   console.log("查看是否相交", result);



const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#B71C1C' })
)
object1.position.setX(-4)
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#B71C1C' })
)
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#B71C1C' })
)
object3.position.setX(4)


scene.add(object1, object2, object3)

/**
 * Raycaster
 */
// const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-6, 0, 0)
// const rayDirections = new THREE.Vector3(10, 0, 0)
// rayDirections.normalize()
// raycaster.set(rayOrigin, rayDirections)


// const intersect = raycaster.intersectObject(object3)
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// if (intersects.length > 0) {
//     // 选中模型的第一个模型，设置为红色
//     intersects[0].object.material.color.set(0xffff00);
// }




// const arrowHelper = new THREE.ArrowHelper(
//   raycaster.ray.direction,
//   raycaster.ray.origin,
//   50,
//   0xff0000,
//   1,
//   0.5,
// )
// scene.add(arrowHelper)


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
//   const axesHelper = new THREE.AxesHelper(150);
//   scene.add(axesHelper);

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
    // .position改变，重新执行lookAt(0,0,0)计算相机视线方向
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  render();
  // 挂载到页面
  // document.body.appendChild(renderer.domElement)
  document.getElementById("webgl").appendChild(renderer.domElement);

document.getElementById("webgl").addEventListener('click',function(event){
    // event对象有很多鼠标事件相关信息
    const px = event.offsetX;
    const py = event.offsetY;
      //屏幕坐标px、py转标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;
    console.log(x,y);
        //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
    // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
    const intersects = raycaster.intersectObjects([object1, object2, object3]);
    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {
        // 选中模型的第一个模型，设置为红色
        intersects[0].object.material.color.set(0xffff00);
    }
})



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
