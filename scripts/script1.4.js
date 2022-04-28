import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
    import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

    var dict = {};
        //A1 B1
        dict["Digit1"] = false; //1
        dict["Digit2"] = false; //2
        dict["Digit3"] = false; //3
        dict["Digit4"] = false; //4
        //A2 B2
        dict["KeyQ"] = false; //q
        dict["KeyW"] = false; //w
        dict["KeyE"] = false; //e
        dict["KeyR"] = false; //r
        //A3 B3
        dict["KeyA"] = false; //a
        dict["KeyS"] = false; //s
        dict["KeyD"] = false; //d
        dict["KeyF"] = false; //f
        //A4 B4
        dict["KeyZ"] = false; //z
        dict["KeyX"] = false; //x
        dict["KeyC"] = false; //c
        dict["KeyV"] = false; //v
        //Claws
        dict["KeyZ"] = false; //n
        dict["KeyX"] = false; //m
        dict["KeyC"] = false; //n
        dict["KeyV"] = false; //m

    function main() {
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ canvas });
        
        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 30, 30);
        camera.up.set(0, 0, 1);
        camera.lookAt(0, 0, 4);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 5, 0);
        controls.update();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x5F5F5F);

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }

        const axesHelper = new THREE.AxesHelper( 55 );
        scene.add( axesHelper );

        const objects = [];

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
        scene.add(Floor);

        const robotArm = new THREE.Object3D();
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

        function animateArms() {
            if (dict["Digit1"] == true && B1Mesh.rotation.x < Math.PI) B1Mesh.rotation.x = B1Mesh.rotation.x + 0.01;
            if (dict["Digit2"] == true && B1Mesh.rotation.x > 0) B1Mesh.rotation.x = B1Mesh.rotation.x - 0.01;
            if (dict["Digit3"] == true) robotArm.rotation.z = robotArm.rotation.z + 0.01;
            if (dict["Digit4"] == true) robotArm.rotation.z = robotArm.rotation.z - 0.01;

            if (dict["KeyQ"] == true && B2Mesh.rotation.x < Math.PI/2) B2Mesh.rotation.x = B2Mesh.rotation.x + 0.01;
            if (dict["KeyW"] == true && B2Mesh.rotation.x > -Math.PI/2) B2Mesh.rotation.x = B2Mesh.rotation.x - 0.01;
            if (dict["KeyE"] == true) B1Mesh.rotation.y = B1Mesh.rotation.y + 0.01;
            if (dict["KeyR"] == true) B1Mesh.rotation.y = B1Mesh.rotation.y - 0.01;
            
            if (dict["KeyA"] == true && B3Mesh.rotation.x < Math.PI/2) B3Mesh.rotation.x = B3Mesh.rotation.x + 0.01;
            if (dict["KeyS"] == true && B3Mesh.rotation.x > -Math.PI/2) B3Mesh.rotation.x = B3Mesh.rotation.x - 0.01;
            if (dict["KeyD"] == true) B2Mesh.rotation.y = B2Mesh.rotation.y + 0.01;
            if (dict["KeyF"] == true) B2Mesh.rotation.y = B2Mesh.rotation.y - 0.01;
            
            if (dict["KeyZ"] == true && artF1.rotation.x < 0.4){
                artF1.rotation.x = artF1.rotation.x + 0.01;
                artF2.rotation.x = artF2.rotation.x - 0.01;
            } 
            if (dict["KeyX"] == true && artF1.rotation.x > -0.2){
                artF1.rotation.x = artF1.rotation.x - 0.01;
                artF2.rotation.x = artF2.rotation.x + 0.01;
            }
            if (dict["KeyC"] == true) B3Mesh.rotation.y = B3Mesh.rotation.y + 0.01;
            if (dict["KeyV"] == true) B3Mesh.rotation.y = B3Mesh.rotation.y - 0.01; 
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

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

    }

    main();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    function onKeyDown(e) {
        var keyCode = e.code;
        if (keyCode in dict) {
            dict[keyCode] = true;
        }
    };

    function onKeyUp(e) {
        var keyCode = e.code;
        if (keyCode in dict) {
            dict[keyCode] = false;
        }
    };