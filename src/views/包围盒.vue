<template>
  <div class="about">
    <div id="container">
      <!-- 进度条 -->
      <div id="per"></div>
    </div>
  </div>
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
  const texLoader = new THREE.TextureLoader();
  const texture = texLoader.load("images/3.jpg"); // 立方纹理加载器
  texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.wrapT = THREE.MirroredRepeatWrapping;
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  const scene = new THREE.Scene();

  const gui = new GUI();

  objLoader.load(
    // "机床.obj",
    "ImageToStlcom_cb-212.obj",
    // "Alfred.OBJ",
    // "ImageToStl.obj",
    (root) => {
      console.log(root);
      document.getElementById("container").style.display = "none";
      root.children[0].geometry.center();
      root.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          const box3 = new THREE.Box3();
          box3.expandByObject(child); // 计算模型包围盒
          console.log("查看包围盒", box3);
          const scale = new THREE.Vector3();
          // getSize()计算包围盒尺寸
          // 获得包围盒长宽高尺寸，结果保存在参数三维向量对象scale中
          box3.getSize(scale);
          console.log("模型包围盒尺寸", scale);

          // 计算包围盒中心坐标
          const center = new THREE.Vector3();
          box3.getCenter(center);
          console.log("模型中心坐标", center);
          // 显示包围盒
          let helper = new THREE.BoxHelper(child, 0xff0000);
          helper.update();
          scene.add(helper);

          child.material = new THREE.MeshPhongMaterial({
            map: texture,
            //  metalness: 0,//金属度属性 MeshStandardMaterial
          });

          // 模型边线设置
          //   const edges = new THREE.EdgesGeometry(child.geometry);
          //   const edgesMaterial = new THREE.LineBasicMaterial({
          //     color: 0x00ffff,
          //   });
          //   const line = new THREE.LineSegments(edges, edgesMaterial);
          //   child.add(line);
        }
      });

      console.log(root);

      gui.addColor(root.children[0].material, "color").name("机床颜色");

      // scene.background = new THREE.Color("#d2ead2");
      // gui.addColor(scene, "background").name("场景颜色");

      const lightsGeometry = new THREE.CylinderGeometry(50, 50, 200);
      //材质对象Material
      const lightsMaterial = new THREE.MeshPhongMaterial({
        color: "red", //设置材质颜色
        // color: '#cb791a',
        // specular: 0xfffffff, //高光部分的颜色0xff0000
        shininess: 20,
        transparent: true, //开启透明
        opacity: 1, //设置透明度
        side: THREE.DoubleSide, //材质两面可见
      });
      // 信号灯
      const lightsMesh = new THREE.Mesh(lightsGeometry, lightsMaterial);
      lightsMesh.position.set(595, 645, 1440);
      scene.add(lightsMesh);

      // 加载贴图
      var textureLights = texLoader.load("images/4.png");
      // 点精灵材质
      var spriteMaterial = new THREE.SpriteMaterial({
        map: textureLights, //贴图
        color: 0xff0000,
        // color: '#cb791a',
        blending: THREE.AdditiveBlending, //在使用此材质显示对象时要使用何种混合。加法
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      // 发光范围
      sprite.scale.set(330, 330, 1.0);

      sprite.position.set(0, 80, 50);

      gui.add(sprite.position, "x", 450, 800).step(5).name("光源");
      gui.add(sprite.position, "y", 400, 800).step(5).name("光源");
      gui.add(sprite.position, "z", 1200, 1700).step(5).name("光源");
      lightsMesh.add(sprite);

      console.log(lightsMesh);

      const children = gui.addFolder("信号灯");
      children.close();
      children
        .addColor(lightsMesh.material, "color")
        .name("信号灯颜色")
        .onChange((value) => {
          sprite.material.color.set("#cb791a");
          lightsMesh.material.color.set("#cb791a");
        });
      children.add(lightsMesh.position, "x", -10000, 18000).step(1);

      children.add(lightsMesh.position, "y", -10000, 18000).step(1);

      children.add(lightsMesh.position, "z", -10000, 18000).step(1);

      // 实例光源
      const pointLight = new THREE.DirectionalLight(0xfffdff, 2);
      pointLight.position.set(500, -350, 3800);
      scene.add(pointLight); //点光源添加到场景中
      const pointLight1 = new THREE.PointLight(0xfffdff, 2.0);
      pointLight1.position.set(-1400, -950, 950);
      scene.add(pointLight1); //点光源添加到场景中
      const pointLight2 = new THREE.DirectionalLight(0xfffdff, 3.0);
      pointLight2.position.set(-5600, 3000, -1600);
      scene.add(pointLight2); //点光源添加到场景中
      const pointLight3 = new THREE.DirectionalLight(0xfffdff, 3.0);
      pointLight3.position.set(1450, 3050, -300);
      scene.add(pointLight3); //点光源添加到场景中

      // // 光源辅助观察
      const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 10);
      scene.add(pointLightHelper1); // 光源辅助观察
      const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 10);
      scene.add(pointLightHelper2);
      const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 10);
      scene.add(pointLightHelper3);
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
      scene.add(pointLightHelper);

      const childPoint = gui.addFolder("光源");
      childPoint.close();
      childPoint.add(pointLight.position, "x", -10000, 18000).step(50);

      childPoint.add(pointLight.position, "y", -10000, 18000).step(50);

      childPoint.add(pointLight.position, "z", -10000, 18000).step(50);

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

      // 你可以看到模型相比原来上下颠倒  y坐标轴朝下
      // camera.up.set(0,-1,0)
      //渲染效果：红色x轴向上
    //   camera.up.set(1, 0, 0);
      //渲染效果：蓝色z轴向上
// camera.up.set(0, 0, 1);


      // 创建渲染器对象
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        // alpha: true, //背景透明
      });
      //解决加载模型纹理贴图和原图不一样问题
      // renderer.outputEncoding = THREE.sRGBEncoding;
      // renderer.setClearAlpha(0.1);

      renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

      renderer.render(scene, camera); //执行渲染操作

      var controls = new OrbitControls(camera, renderer.domElement); //创建控件对象

      let spriteConfig = {
        spriteMax: 330,
        spriteMin: 100,
        isAdd: false,
        step: 10,
      };
      let angle = 0; //用于圆周运动计算的角度值
      const R = 12000; //相机圆周运动的半径
      // 渲染函数
      function render() {
        angle += 0.01;
        // // 相机y坐标不变，在XOZ平面上做圆周运动
        camera.position.x = R * Math.cos(angle);
        camera.position.z = R * Math.sin(angle);

        renderer.render(scene, camera); //执行渲染操作
        camera.lookAt(0, 0, 0);
        requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
      }
      render();
      document.body.appendChild(renderer.domElement);
    },
    function (xhr) {
      const percentDiv = document.getElementById("per"); // 获取进度条元素
      const percent = xhr.loaded / xhr.total;
      percentDiv.style.width = percent * 400 + "px"; //进度条元素长度
      percentDiv.style.textIndent = percent * 400 + 5 + "px"; //缩进元素中的首行文本
      // Math.floor:小数加载进度取整
      percentDiv.innerHTML = Math.floor(percent * 100) + "%"; //进度百分比
    },
    (err) => {
      console.error(err);
    }
  );
});
</script>

<style>
#container {
  position: absolute;
  width: 400px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -8px;
  border-radius: 8px;
  border: 1px solid #009999;
  overflow: hidden;
}
#per {
  height: 100%;
  width: 0px;
  background: #00ffff;
  color: #00ffff;
  line-height: 15px;
}
</style>
