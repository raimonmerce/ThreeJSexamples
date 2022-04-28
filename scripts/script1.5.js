import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import {VRButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/VRButton.js';
function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    
    const fov = 40;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 30, 30);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x5F5F5F);
    scene.add( camera );

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
    
    var action = [];
    for (let step = 0; step < 8; step++) {
        action.push(Math.floor(Math.random() * 3));
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const axesHelper = new THREE.AxesHelper( 55 );
    scene.add( axesHelper );

    const radiusTop = 1;
    const radiusBottom = 1;
    const height = 4;
    const radialSegments = 6;

    const cylinderGeometry = new THREE.CylinderBufferGeometry(
        radiusTop, radiusBottom, height, radialSegments);
    
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;  

    const sphereGeometry = new THREE.SphereBufferGeometry(
        radius, widthSegments, heightSegments);
    
    const materialA = new THREE.MeshPhongMaterial({ emissive: 0x777777 });
    const materialB = new THREE.MeshPhongMaterial({ emissive: 0x222222 });

    const radiusSph = 9;  // ui: radius
    const segments = 24;  // ui: segments
    const geometry = new THREE.CircleGeometry(radiusSph, segments);
    const Floor = new THREE.Mesh(geometry, materialB);
    Floor.rotation.x = -Math.PI / 2;
    Floor.scale.set(0.5,0.5,0.5);
    scene.add(Floor);

    const robotArm = new THREE.Object3D();
    robotArm.rotation.x = -Math.PI / 2;
    robotArm.scale.set(0.3,0.3,0.3);
    scene.add(robotArm);

    const B1Mesh = new THREE.Mesh(sphereGeometry, materialB);
    B1Mesh.rotation.x = Math.PI / 2;
    robotArm.add(B1Mesh);

    const A1Mesh = new THREE.Mesh(cylinderGeometry, materialA);
    A1Mesh.position.y = 3;
    B1Mesh.add(A1Mesh);

    const B2Mesh = new THREE.Mesh(sphereGeometry, materialB);
    B2Mesh.position.y = 3;
    A1Mesh.add(B2Mesh);
    
    const A2Mesh = new THREE.Mesh(cylinderGeometry, materialA);
    A2Mesh.position.y = 3;
    B2Mesh.add(A2Mesh);

    const B3Mesh = new THREE.Mesh(sphereGeometry, materialB);
    B3Mesh.position.y = 3;
    A2Mesh.add(B3Mesh);
    
    const A3Mesh = new THREE.Mesh(cylinderGeometry, materialA);
    A3Mesh.position.y = 3;
    B3Mesh.add(A3Mesh);

    const B4Mesh = new THREE.Mesh(sphereGeometry, materialB);
    B4Mesh.position.y = 3;
    A3Mesh.add(B4Mesh);

    const artF1 = new THREE.Object3D();
    B4Mesh.add(artF1);

    const artF2 = new THREE.Object3D();
    B4Mesh.add(artF2);

    var fGeometry = new THREE.CylinderBufferGeometry(0.1, 0.5, 4, 3);
    const F1Mesh = new THREE.Mesh(fGeometry, materialA);
    F1Mesh.position.y = 2;
    F1Mesh.position.z = 1;
    artF1.add(F1Mesh);

    const F2Mesh = new THREE.Mesh(fGeometry, materialA);
    F2Mesh.position.y = 2;
    F2Mesh.position.z = -1;
    F2Mesh.rotation.y = Math.PI;
    artF2.add(F2Mesh);
    
    renderer.xr.enabled = true;
    document.body.appendChild( VRButton.createButton( renderer ) );

    function animateArms() {

        //console.log(Math.floor(Math.random() * 3));
        if (action[0] == 1){
            if (B1Mesh.rotation.x < Math.PI){
                B1Mesh.rotation.x = B1Mesh.rotation.x + 0.01;
            } else {
                action[0] = 2;
            }
        } else if (action[0] == 2){
            if (B1Mesh.rotation.x > 0){
                B1Mesh.rotation.x = B1Mesh.rotation.x - 0.01;
            } else {
                action[0] = 1;
            }
        }

        if (action[1] == 1){
            robotArm.rotation.z = robotArm.rotation.z + 0.01;
        } else if (action[1] == 2){
            robotArm.rotation.z = robotArm.rotation.z - 0.01;
        }

        if (action[2] == 1){
            if (B2Mesh.rotation.x < Math.PI/2){
                B2Mesh.rotation.x = B2Mesh.rotation.x + 0.01;
            } else {
                action[2] = 2;
            }
        } else if (action[2] == 2){
            if (B2Mesh.rotation.x > -Math.PI/2){
                B2Mesh.rotation.x = B2Mesh.rotation.x - 0.01;
            } else {
                action[2] = 1;
            }
        }

        if (action[3] == 1){
            B1Mesh.rotation.y = B1Mesh.rotation.y + 0.01;
        } else if (action[3] == 2){
            B1Mesh.rotation.y = B1Mesh.rotation.y - 0.01;
        }

        if (action[4] == 1){
            if (B3Mesh.rotation.x < Math.PI/2){
                B3Mesh.rotation.x = B3Mesh.rotation.x + 0.01;
            } else {
                action[4] = 2;
            }
        } else if (action[4] == 2 ){
            if (B3Mesh.rotation.x > -Math.PI/2){
                B3Mesh.rotation.x = B3Mesh.rotation.x - 0.01;
            } else {
                action[4] = 1;
            }
        }

        if (action[5] == 1){
            B2Mesh.rotation.y = B2Mesh.rotation.y + 0.01;
        } else if (action[5] == 2){
            B2Mesh.rotation.y = B2Mesh.rotation.y - 0.01;
        }

        if (action[6] == 1){
            if (artF1.rotation.x < 0.4){
                artF1.rotation.x = artF1.rotation.x + 0.01;
                artF2.rotation.x = artF2.rotation.x - 0.01;
            } else {
                action[6] = 2;
            }
        } else if (action[6] == 2){
            if (artF1.rotation.x > -0.2){
                artF1.rotation.x = artF1.rotation.x - 0.01;
                artF2.rotation.x = artF2.rotation.x + 0.01;
            } else {
                action[6] = 1;
            }
        }

        if (action[7] == 1){
            B3Mesh.rotation.y = B3Mesh.rotation.y + 0.01;
        } else if (action[7] == 2){
            B3Mesh.rotation.y = B3Mesh.rotation.y - 0.01; 
        }
    };

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

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        animateArms();

        renderer.render(scene, camera);

        renderer.setAnimationLoop(render);
    }

    renderer.setAnimationLoop(render);       
}

main();
