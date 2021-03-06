import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
    import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';



function main() 
{
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  window.addEventListener("click", onclick, true);

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  var controls = new OrbitControls( camera, renderer.domElement );
  controls.listenToKeyEvents( window ); // optional

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x333333 );

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // NOT A GOOD EXAMPLE OF HOW TO MAKE A CUBE!
  // Only trying to make it clear most vertices are unique
  const vertices = [
    // front
    { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], }, // 0
    { pos: [-0.5, -1,  1], norm: [ 0,  0,  1], uv: [0.25, 0], }, // 1
    { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], }, // 2
    { pos: [-0.5,  1,  1], norm: [ 0,  0,  1], uv: [0.25, 1], }, // 3

    { pos: [-0.5, 0.5,  1], norm: [ 0,  0,  1], uv: [0.25, 0.75], }, // 4
    { pos: [ 0.5, 0.5,  1], norm: [ 0,  0,  1], uv: [0.75, 0.75], }, // 5
    { pos: [ 0.5,  1,  1], norm: [ 0,  0,  1], uv: [0.75, 1], }, // 6
    { pos: [ 0.5, -1,  1], norm: [ 0,  0,  1], uv: [0.75, 0], }, // 7

    { pos: [-0.5,  -0.5,  1], norm: [ 0,  0,  1], uv: [0.25, 0.25], }, // 8
    { pos: [ 0.5,  -0.5,  1], norm: [ 0,  0,  1], uv: [0.75, 0.25], }, // 9
    { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], }, // 10
    { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], }, // 11

    // right
    { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], }, // 12
    { pos: [ 1, -1, 0.5], norm: [ 1,  0,  0], uv: [0.25, 0], }, // 13
    { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], }, // 11
    { pos: [ 1,  1, 0.5], norm: [ 1,  0,  0], uv: [0.25, 1], }, // 15

    { pos: [ 1, 0.5,  0.5], norm: [ 1,  0,  0], uv: [0.25, 0.75], }, // 16
    { pos: [ 1, 0.5, -0.5], norm: [ 1,  0,  0], uv: [0.75, 0.75], }, // 17
    { pos: [ 1,  1, -0.5], norm: [ 1,  0,  0], uv: [0.75, 1], }, // 18

    { pos: [ 1, -1, -0.5], norm: [ 1,  0,  0], uv: [0.75, 0], }, // 19
    { pos: [ 1, -0.5, 0.5], norm: [ 1,  0,  0], uv: [0.25, 0.25], }, // 20
    { pos: [ 1, -0.5, -0.5], norm: [ 1,  0,  0], uv: [0.75, 0.25], }, // 21

    { pos: [ 1,  -1, -1], norm: [ 1,  0,  0], uv: [1, 0], }, // 22
    { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], }, // 23

    // back
    { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], }, // 24
    { pos: [0.5, -1, -1], norm: [ 0,  0, -1], uv: [0.25, 0], }, // 25
    { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], }, // 26
    { pos: [0.5,  1, -1], norm: [ 0,  0, -1], uv: [0.25, 1], }, // 27

    { pos: [ 0.5, 0.5, -1], norm: [ 0,  0, -1], uv: [0.25, 0.75], }, // 28
    { pos: [-0.5, 0.5, -1], norm: [ 0,  0, -1], uv: [0.75, 0.75], }, // 29
    { pos: [-0.5, 1, -1], norm: [ 0,  0, -1], uv: [0.75, 1], }, // 30

    { pos: [-0.5,  -1, -1], norm: [ 0,  0, -1], uv: [0.75, 0], }, // 31
    { pos: [ 0.5, -0.5, -1], norm: [ 0,  0, -1], uv: [0.25, 0.25], }, // 32
    { pos: [-0.5, -0.5, -1], norm: [ 0,  0, -1], uv: [0.75, 0.25], }, // 33

    { pos: [ -1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], }, // 34
    { pos: [ -1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], }, // 35
    // left
    { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], }, // 36
    { pos: [-1, -1, -0.5], norm: [-1,  0,  0], uv: [0.25, 0], }, // 37
    { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], }, // 38
    { pos: [-1,  1, -0.5], norm: [-1,  0,  0], uv: [0.25, 1], }, // 39

    { pos: [-1, 0.5, -0.5], norm: [-1,  0,  0], uv: [0.25, 0.75], }, // 40
    { pos: [-1, 0.5,  0.5], norm: [-1,  0,  0], uv: [0.75, 0.75], }, // 41
    { pos: [-1,  1, 0.5], norm: [-1,  0,  0], uv: [0.75, 1], }, // 42

    { pos: [-1, -1,  0.5], norm: [-1,  0,  0], uv: [0.75, 0], }, // 43
    { pos: [-1, -0.5, -0.5], norm: [-1,  0,  0], uv: [0.25, 0.25], }, // 44
    { pos: [-1, -0.5,  0.5], norm: [-1,  0,  0], uv: [0.75, 0.25], }, // 45

    { pos: [-1, -1, 1], norm: [-1,  0,  0], uv: [1, 0], }, // 46
    { pos: [-1, 1, 1], norm: [-1,  0,  0], uv: [1, 1], }, // 47
    // top
    { pos: [ -1, 1, 1], norm: [ 0,  1,  0], uv: [0, 0], }, // 48
    { pos: [-0.5, 1, 1], norm: [ 0,  1,  0], uv: [0.25, 0], }, // 49
    { pos: [ -1, 1, -1], norm: [ 0,  1,  0], uv: [0, 1], }, // 50
    { pos: [-0.5, 1, -1], norm: [ 0,  1,  0], uv: [0.25, 1], }, // 51

    { pos: [-0.5,  1, -0.5], norm: [ 0,  1,  0], uv: [0.25, 0.75], }, // 52
    { pos: [0.5, 1, -0.5], norm: [ 0,  1,  0], uv: [0.75, 0.75], }, // 53
    { pos: [0.5, 1, -1], norm: [ 0,  1,  0], uv: [0.75, 1], }, // 54
    
    { pos: [0.5, 1, 1], norm: [ 0,  1,  0], uv: [0.75, 0], }, // 55
    { pos: [-0.5, 1, 0.5], norm: [ 0,  1,  0], uv: [0.25, 0.25], }, // 56
    { pos: [0.5, 1, 0.5], norm: [ 0,  1,  0], uv: [0.75, 0.25], }, // 57
    
    { pos: [1,  1, 1], norm: [ 0,  1,  0], uv: [1, 0], }, // 58
    { pos: [1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], }, // 59
    // bottom
    { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], }, // 60
    { pos: [0.5, -1,  1], norm: [ 0, -1,  0], uv: [0.25, 0], }, // 61
    { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], }, // 62
    { pos: [0.5, -1, -1], norm: [ 0, -1,  0], uv: [0.25, 1], }, // 63

    { pos: [ 0.5, -1, -0.5], norm: [ 0, -1,  0], uv: [0.25, 0.75], }, // 64
    { pos: [-0.5, -1, -0.5], norm: [ 0, -1,  0], uv: [0.75, 0.75], }, // 65
    { pos: [ -0.5, -1, -1], norm: [ 0, -1,  0], uv: [0.75, 1], }, // 66
    
    { pos: [-0.5, -1, 1], norm: [ 0, -1,  0], uv: [0.75, 0], }, // 67
    { pos: [ 0.5, -1, 0.5], norm: [ 0, -1,  0], uv: [0.25, 0.25], }, // 68
    { pos: [-0.5, -1, 0.5], norm: [ 0, -1,  0], uv: [0.75, 0.25], }, // 69
    
    { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], }, // 70
    { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], }, // 71
    
  ];
  const numVertices = vertices.length;
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2;
  const positions = new Float32Array(numVertices * positionNumComponents);
  const normals = new Float32Array(numVertices * normalNumComponents);
  const uvs = new Float32Array(numVertices * uvNumComponents);
  let posNdx = 0;
  let nrmNdx = 0;
  let uvNdx = 0;
  for (const vertex of vertices) {
    positions.set(vertex.pos, posNdx);
    normals.set(vertex.norm, nrmNdx);
    uvs.set(vertex.uv, uvNdx);
    posNdx += positionNumComponents;
    nrmNdx += normalNumComponents;
    uvNdx += uvNumComponents;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, positionNumComponents));
  geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(normals, normalNumComponents));
  geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(uvs, uvNumComponents));

  geometry.setIndex([
    // front
    0,  1,  2,   2,  1,  3, 
    4,  5,  3,   3,  5,  6,  
    1,  7, 8,  8,  7, 9, 
    7, 10, 6,  6, 10, 11,
    
    // right
    12, 13, 14,  14, 13, 15, 
    16, 17, 15,  15, 17, 18,  
    13, 19, 20,  20, 19, 21, 
    19, 22, 18,  18, 22, 23,
    
    // back
    24, 25, 26,  26, 25, 27, 
    28, 29, 27,  27, 29, 30,  
    25, 31, 32,  32, 31, 33, 
    31, 34, 30,  30, 34, 35,
    
    // left
    36, 37, 38,  38, 37, 39, 
    40, 41, 39,  39, 41, 42,  
    37, 43, 44,  44, 43, 45, 
    43, 46, 42,  42, 46, 47,

    // top
    48, 49, 50,  50, 49, 51, 
    52, 53, 51,  51, 53, 54,  
    49, 55, 56,  56, 55, 57, 
    55, 58, 54,  54, 58, 59,

    // bottom
    60, 61, 62,  62, 61, 63, 
    64, 65, 63,  63, 65, 66,  
    61, 67, 68,  68, 67, 69, 
    67, 70, 66,  66, 70, 71,
  ]);

  const loader = new THREE.TextureLoader();
  const texture = loader.load('grenouille.jpg');

  const axesHelper = new THREE.AxesHelper( 55 );
  scene.add( axesHelper );

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshBasicMaterial({color, map: texture});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0xFFFFFF,  0),
    makeInstance(geometry, 0xFFFFFF, -4),
    makeInstance(geometry, 0xFFFFFF,  4),
  ];


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
//    time *= 0.0004;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }


  requestAnimationFrame(render);
}

main();