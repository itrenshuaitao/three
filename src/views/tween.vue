<script setup>
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
//引入性能监视器stats.js
import Stats from "three/addons/libs/stats.module.js";

// 引入CSS3渲染器CSS3DRenderer
import { CSS3DRenderer as CSS2DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

// 引入CSS3模型对象CSS3DObject
import { CSS3DObject as CSS2DObject } from "three/addons/renderers/CSS3DRenderer.js";

// 引入渲染器通道RenderPass
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// 引入OutlinePass通道
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { onMounted } from "vue";
onMounted(() => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#d2ead2");
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  //材质对象Material
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ffff, //设置材质颜色
    // transparent: true, //开启透明
    opacity: 0.9, //设置透明度
  });
  // for (let i = 0; i < 10; i++) {
  //     const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  //     // 沿着x轴分布
  //     mesh.position.set(i*200,0,0);
  //     scene.add(mesh); //网格模型添加到场景中
  // }

  // 双层循环
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      // 在XOZ平面上分布
      mesh.position.set(i * 200, 0, j * 200);
      mesh.ancestors = mesh;
      scene.add(mesh); //网格模型添加到场景中
    }
  }

  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight(0xffffff, 1.0);
  pointLight.position.set(800, 900, 800);
  scene.add(pointLight);

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  //   scene.add(ambient);

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  directionalLight.position.set(900, 1160, 50);

  scene.add(directionalLight);

  // 光源辅助观察
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
  scene.add(pointLightHelper);

  // DirectionalLightHelper：可视化平行光
  const dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5,
    0xff0000
  );
  scene.add(dirLightHelper);

  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  const div = document.getElementById("tag");
  // HTML元素转化为threejs的CSS2模型对象
  const tag = new CSS2DObject(div);
  tag.position.z = -200;
  tag.rotation.x = Math.PI * 1.5;

  // 实例化一个透视投影相机对象
  const width = window.innerWidth; //窗口文档显示区的宽度作为画布宽度
  const height = window.innerHeight; //窗口文档显示区的高度作为画布高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 8000);
  //相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值
  camera.position.set(2000, 2000, 2000);
  camera.lookAt(1000, 0, 1000);
  // camera.lookAt(mesh.position);//指向mesh对应的位置

  // 创建一个CSS2渲染器CSS2DRenderer
  const css2Renderer = new CSS2DRenderer();
  css2Renderer.setSize(width, height);
  // HTML标签<div id="tag"></div>外面父元素叠加到canvas画布上且重合
  css2Renderer.domElement.style.position = "absolute";
  css2Renderer.domElement.style.top = "126px";
  //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
  css2Renderer.domElement.style.pointerEvents = "none";
  document.body.appendChild(css2Renderer.domElement);

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer();
  // 定义threejs输出画布的尺寸(单位:像素px)

  renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
  renderer.render(scene, camera); //执行渲染操作

  // 创建后处理对象EffectComposer，WebGL渲染器作为参数
  const composer = new EffectComposer(renderer);
  // 1. 创建一个渲染器通道，场景和相机作为参数
  const renderPass = new RenderPass(scene, camera);
  // 设置renderPass通道
  composer.addPass(renderPass);

  // 2. 创建OutlinePass通道
  const v2 = new THREE.Vector2(window.innerWidth, window.innerWidth);
  const outlinePass = new OutlinePass(v2, scene, camera);

  //模型描边颜色，默认白色
  outlinePass.visibleEdgeColor.set(0xffff00);
  //高亮发光描边厚度
  outlinePass.edgeThickness = 4;
  //高亮描边发光强度
  outlinePass.edgeStrength = 6;
  //模型闪烁频率控制，默认0不闪烁
  outlinePass.pulsePeriod = 2;

  composer.addPass(outlinePass);

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
    TWEEN.update(); //tween更新.update()，tween才能正常执行
    //  const spt = clock.getDelta()*1000;//毫秒
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
    stats.update();
    // renderer.render(scene, camera); //执行渲染操作
    composer.render();
    css2Renderer.render(scene, camera);
    //   mesh.rotateX(0.01);//每次绕y轴旋转0.01弧度
    // mesh.rotateY(0.02);//每次绕y轴旋转0.01弧度
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }
  render();

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
  controls.target.set(1000, 0, 1000);
  controls.update(); //update()函数内会执行camera.lookAt(controls.targe)

  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  // controls.addEventListener('change', function () {
  //       console.log('camera.position',camera.position);
  //     renderer.render(scene, camera); //执行渲染操作
  // });//监听鼠标、键盘事件

  // 挂载到页面
  // document.body.appendChild(renderer.domElement)
  document.getElementById("webgl").appendChild(renderer.domElement);

  let chooseObj = null;
  renderer.domElement.addEventListener("click", function (event) {
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标px、py转WebGL标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / width) * 2 - 1;
    const y = -(py / height) * 2 + 1;
    //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
    // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
    const intersects = raycaster.intersectObjects([
      ...scene.children.slice(0, 100),
    ]);
    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {
      // 通过.ancestors属性判断那个模型对象被选中了
      if (chooseObj === intersects[0].object.ancestors) {
        // 标签淡出
        new TWEEN.Tween({ opacity: 1 })
          .to({ opacity: 0 }, 1000)
          .onUpdate(function (obj) {
            //动态更新div元素透明度
            div.style.opacity = obj.opacity;
          })
          .onComplete(function () {
            outlinePass.selectedObjects = []; //无发光描边
            chooseObj.remove(tag); //从场景移除
            chooseObj=null; 
          })
          .start();
          return true;
      }
      outlinePass.selectedObjects = [intersects[0].object.ancestors];
      //tag会标注在intersects[0].object.ancestors模型的局部坐标系原点位置
      tag.element.innerHTML = `当前选中模型坐标：X-${intersects[0].object.position.x};Z-${intersects[0].object.position.z}`;
      intersects[0].object.ancestors.add(tag);
      chooseObj = intersects[0].object.ancestors;

      // 标签淡入
      new TWEEN.Tween({ opacity: 0 })
        .to({ opacity: 1.0 }, 1000)
        .onUpdate(function (obj) {
          //动态更新div元素透明度
          div.style.opacity = obj.opacity;
        })
        .start();
    } else {
      if (chooseObj) {
        //把原来选中模型对应的标签和发光描边隐藏
        outlinePass.selectedObjects = []; //无发光描边
        chooseObj.remove(tag); //从场景移除
      }
    }
  });
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

  <div id="tag" style="display: none; backface-visibility: hidden">
    11111111111111111
  </div>
</template>
<style scoped>
#tag {
  padding: 28px;
  box-sizing: border-box;
  background-image: url(./images/bg.png);
  background-size: 200px 200px;
  width: 200px;
  height: 200px;
  background-repeat: no-repeat;
  background-color: rgb(144 126 255);
  color: #eee799;
}
</style>