<template>
  <div class="about"></div>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
// 引入dat.gui.js的一个类GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

onMounted(() => {
  const texture = new THREE.TextureLoader().load("images/3.jpg"); // 立方纹理加载器
  texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.wrapT = THREE.MirroredRepeatWrapping;
  const objLoader = new OBJLoader();
  const gui = new GUI();
  objLoader.load(
    "ImageToStlcom_cb-212.obj",
    (root) => {
      console.log(root);
      root.children[0].geometry.center();

      root.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          // MeshBasicMaterial  基础（无反射效果）
          // MeshLambertMaterial  漫反射
          // MeshPhongMaterial   高光 镜面
          // MeshStandardMaterial   物理
          // MeshPhysicalMaterial   物理

          child.material = new THREE.MeshPhongMaterial({
            map: texture,
          });
        }
      });

      console.log(root);

      gui.addColor(root.children[0].material, "color").name("机床颜色");

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#d2ead2");
      gui.addColor(scene, "background").name("场景颜色");

      const lightsGeometry = new THREE.CylinderGeometry(450, 200, 1600);
      //材质对象Material
      const lightsMaterial = new THREE.MeshPhongMaterial({
        color: "red", //设置材质颜色
        // color: 0x9de363,
        // specular: 0xfffffff, //高光部分的颜色0xff0000
        shininess: 20,
        transparent: false, //开启透明
        opacity: 0.7, //设置透明度
        side: THREE.DoubleSide, //材质两面可见
      });
      // 信号灯
      const lightsMesh = new THREE.Mesh(lightsGeometry, lightsMaterial);
      lightsMesh.position.set(0, 0, 0);
      scene.add(lightsMesh);
      const children = gui.addFolder("信号灯");
      children.close();
      children.add(lightsMesh.position, "x", -10000, 18000).step(50);

      children.add(lightsMesh.position, "y", -10000, 18000).step(50);

      children.add(lightsMesh.position, "z", -10000, 18000).step(50);

      // 实例光源
      const pointLight = new THREE.DirectionalLight(0xfffdff, 2.0);
      pointLight.position.set(1650, -200, 2700);
      scene.add(pointLight); //点光源添加到场景中
      const pointLight2 = new THREE.DirectionalLight(0xfffdff, 2.0);
      pointLight2.position.set(-5600, 3000, -1600);
      scene.add(pointLight2); //点光源添加到场景中
      const pointLight1 = new THREE.PointLight(0xfffdff, 2.0);
      pointLight1.position.set(-1400, -950, 950);
      scene.add(pointLight1); //点光源添加到场景中

      // 光源辅助观察
      // const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 10);
      // scene.add(pointLightHelper1);  // 光源辅助观察
      // const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 10);
      // scene.add(pointLightHelper2);

      // //环境光
      let ambient = new THREE.AmbientLight("#fff", 2);
      scene.add(ambient);
      gui.addColor(ambient, "color");
      scene.add(root);

      //写地面
      // const planeBufferGeometry = new THREE.PlaneBufferGeometry(100000, 100000);
      // const plane = new THREE.Mesh(
      //   planeBufferGeometry,
      //   new THREE.MeshBasicMaterial({ color: 0x555b68 })
      // );
      // plane.rotation.x = -Math.PI / 2;
      // plane.name = "plane";
      // scene.add(plane);
      // scene.add(new THREE.GridHelper(10000, 10000));

      //创建一个长方体几何对象Geometry
      const geometry = new THREE.BoxGeometry(120, 100, 50);

      // 实例化一个透视投影相机对象
      // const camera = new THREE.PerspectiveCamera();

      // width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
      const width = window.innerWidth; //窗口文档显示区的宽度作为画布宽度
      const height = window.innerHeight; //窗口文档显示区的高度作为画布高度
      // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
      const camera = new THREE.PerspectiveCamera(30, width / height, 1, 30000);
      //相机在Three.js三维坐标系中的位置
      // 根据需要设置相机位置具体值
      camera.position.set(-6551, 3519, 16682);

      //相机观察目标指向Threejs 3D空间中某个位置
      camera.lookAt(0, 0, 0); //坐标原点

      // camera.lookAt(0, 10, 0);  //y轴上位置10

      // camera.lookAt(mesh.position);//指向mesh对应的位置

      // 创建渲染器对象
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      //解决加载模型纹理贴图和原图不一样问题
      // renderer.outputEncoding = THREE.sRGBEncoding;
      // renderer.setClearAlpha(0.1);

      renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

      renderer.render(scene, camera); //执行渲染操作
      console.log(scene);

      var controls = new OrbitControls(camera, renderer.domElement); //创建控件对象

      // 渲染函数
      function render() {
        //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
        renderer.render(scene, camera); //执行渲染操作

        requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
      }
      render();
      document.body.appendChild(renderer.domElement);
    },
    () => {},
    (err) => {
      console.error(err);
    }
  );
});
</script>

<style>
</style>
