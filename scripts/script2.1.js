import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
    import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

    function main() {
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ canvas });
        
        const objects = [];

        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(5, 25, 5);
        camera.up.set(0, 0, 1);
        camera.lookAt(5, 0, 5);
        
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(5, 5, 5);
        controls.update();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x5F5F5F);

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.PointLight(color, intensity, 100);
            light.position.set(5, 5, 9.5);
            //light.position.set(5, 5, 9);
            scene.add(light);
        }

        //Axes Helper
        const axesHelper = new THREE.AxesHelper( 55 );
        scene.add( axesHelper );

        //Create Room

        var wallBack = addObject(5, 0, 5, -Math.PI / 2, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff})
            );
        
        var wallLeft = addObject(0, 5, 5, 0, Math.PI / 2, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xff0000})
            );

        var wallRight = addObject(10, 5, 5, 0, -Math.PI / 2, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0x00ff00})
            );
        
        var wallTop = addObject(5, 5, 10, Math.PI, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff, emissive : 0xffffff, emissiveIntensity: 0.2})
            );

        var wallBottom = addObject(5, 5, 0, 0, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff})
            );
        
        var wallLight = addObject(5, 5, 9.99, Math.PI, 0, 0,
            new THREE.PlaneGeometry( 2, 2 ), 
            new THREE.MeshStandardMaterial({color: 0xffffff, emissive : 0xffffff, emissiveIntensity: 1.0})
            );
        
        //Create Objects

        var cone = addObject(8, 2, 1.5, Math.PI/2, 0, 0,
            new THREE.ConeBufferGeometry(1, 3, 16), 
            new THREE.MeshLambertMaterial({color: 0xff0000})
            );

        var cylinder = addObject(2, 2, 1, 0, 0, Math.PI/4,
            new THREE.CylinderBufferGeometry(1, 1, 3, 16), 
            new THREE.MeshPhongMaterial({color: 0x00ff00})
            );

        var shpere = addObject(5, 4, 1.5, 0, 0, 0,
            new THREE.SphereBufferGeometry(1.5, 16, 16), 
            new THREE.MeshPhysicalMaterial({color: 0x0000ff})
            );

        function addObject(x, y, z, rx, ry, rz, geometry, material) {
            var obj = new THREE.Mesh(geometry, material);
            obj.rotation.x = rx;
            obj.rotation.y = ry;
            obj.rotation.z = rz;

            obj.position.x = x;
            obj.position.y = y;
            obj.position.z = z;

            scene.add(obj);
            objects.push(obj);
            return obj;
        }

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

        function render() {

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

    }

    main();