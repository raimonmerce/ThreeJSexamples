import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
    import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
    import { GUI } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/lil-gui.module.min.js';

    function main() {
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = 1;

        const objects = [];
        let gui;

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

        let color = 0xFFFFFF;
        
        let DirectionalLight = new THREE.DirectionalLight(color, 0);
        let PointLight = new THREE.PointLight(color, 0, 100);
        let SpotLight = new THREE.SpotLight(color, 0, 100, Math.Pi, 1.0, 1.0);
        let HemisphereLight = new THREE.HemisphereLight(0xffffff, 0xff0000, 0);
        let light = new THREE.AmbientLight(0xFFFFFF, 0.2);
        

        DirectionalLight.position.set(10, 10, 10);
        DirectionalLight.castShadow = true;

        PointLight.position.set(0.1, 0.1, 9.9);
        PointLight.castShadow = true;

        SpotLight.position.set(0.1, 9.9, 9.9);
        SpotLight.target.position.set(9.9, 0.1, 0.1);
        SpotLight.castShadow = true;

        HemisphereLight.position.set(9.9, 0.1, 9.9);
        HemisphereLight.castShadow = true;
        //console.log(HemisphereLight.shadow.mapSize.width);
        
        scene.add(DirectionalLight);
        scene.add(PointLight);
        scene.add(SpotLight);
        scene.add(SpotLight.target);
        scene.add(HemisphereLight);
        scene.add(light);

        let diectionalAPI = {
            c: '#FFFFFF',
            x: 10,
            y: 10,
            z: 10,
            i: 0,
            smwidth: 512,
            smheight: 512
        };
        let pointAPI = {
            c: '#FFFFFF',
            x: 0.1,
            y: 0.1,
            z: 9.9,
            i: 0,
            smwidth: 512,
            smheight: 512
        };
        let spotAPI = {
            c: '#FFFFFF',
            x: 0.1,
            y: 9.9,
            z: 9.9,
            tx: 0.1,
            ty: 9.9,
            tz: 9.9,
            i: 0,
            smwidth: 512,
            smheight: 512
        };
        let hemisphereAPI = {
            c: '#FFFFFF',
            groundColor: '#FF0000',
            i: 0
        };

        let shadowMaps = ["BasicShadowMap","PCFShadowMap","PCFSoftShadowMap","VSMShadowMap"];

        let shadowAPI = {
            shadowMap: shadowMaps[0]
        }

        //Axes Helper
        const axesHelper = new THREE.AxesHelper( 55 );
        scene.add( axesHelper );

        //Create Room

        var wallBack = addObject(5, 0, 5, -Math.PI / 2, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff}),
            false
            );
        
        var wallRight = addObject(0, 5, 5, 0, Math.PI / 2, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xff0000}),
            false
            );

        var wallLeft = addObject(10, 5, 5, 0, -Math.PI / 2, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0x00ff00}),
            false
            );
        
        var wallTop = addObject(5, 5, 10, Math.PI, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff, emissive : 0xffffff, emissiveIntensity: 0.2}),
            false
            );

        var wallBottom = addObject(5, 5, 0, 0, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff}),
            false
            );
        
        var wallLight = addObject(5, 5, 9.99, Math.PI, 0, 0,
            new THREE.PlaneGeometry( 2, 2 ), 
            new THREE.MeshStandardMaterial({color: 0xffffff, emissive : 0xffffff, emissiveIntensity: 1.0}),
            false
            );
        
        //Create Objects

        var cone = addObject(8, 2, 1.5, Math.PI/2, 0, 0,
            new THREE.ConeBufferGeometry(1, 3, 16), 
            new THREE.MeshLambertMaterial({color: 0xff0000}),
            true
            );

        var cylinder = addObject(2, 2, 1, 0, 0, Math.PI/4,
            new THREE.CylinderBufferGeometry(1, 1, 3, 16), 
            new THREE.MeshPhongMaterial({color: 0x00ff00}),
            true
            );

        var shpere = addObject(5, 4, 1.5, 0, 0, 0,
            new THREE.SphereBufferGeometry(1.5, 16, 16), 
            new THREE.MeshPhysicalMaterial({color: 0x0000ff}),
            true
            );
        
        //Create GUI
        gui = new GUI( { title: "Lights" } );
        let titleD = 'Directional Light';
        createLightGUI(gui, DirectionalLight, diectionalAPI, titleD);
        let titlep = 'Point Light';
        createLightGUI(gui, PointLight, pointAPI, titlep);
        let titleS = 'Spot Light';
        createLightGUI(gui, SpotLight, spotAPI, titleS);
        let titleH = 'Hemisphere Light';
        createLightGUI(gui, HemisphereLight, hemisphereAPI, titleH);
        
        //Shadow GUI
        let folder = gui.addFolder("Shadows")
            folder.add( shadowAPI, 'shadowMap', shadowMaps)
                .name( 'Shadow Map' )
                .onChange( function (value) {
                    console.log("A");
                    console.log(renderer.shadowMap.type);
                    if (value == "BasicShadowMap"){
                        renderer.shadowMap.type = 0;
                    } else if (value == "PCFShadowMap"){
                        renderer.shadowMap.type = 1;
                    } else if (value == "PCFSoftShadowMap"){
                        renderer.shadowMap.type = 2;
                    } else {
                        renderer.shadowMap.type = 3;
                    }
                    renderer.shadowMap.needsUpdate = true;
                } );
                    console.log(renderer.shadowMap.type);

        function createLightGUI(gui, light, API, title){
            
            let folder = gui.addFolder(title)
            folder.addColor( API, 'c')
                .name( 'Color' )
                .onChange( function () {
                    light.color.set(API.c);
                } );
            
            if (title == "Hemisphere Light"){    
                folder.addColor( API, 'groundColor')
                .name( 'Ground Color' )
                .onChange( function () {
                    light.groundColor.set(API.groundColor);
                } );
            }

            folder.add( API, 'i', 0, 1, 0.1 )
                .name( 'Intensity' )
                .onChange( function () {
                    light.intensity = API.i;
                } );

            if (title != "Hemisphere Light"){
                folder.add( API, 'x', 0.1, 9.9, 0.1)
                    .name( 'X position' )
                    .onChange( function () {
                        light.position.x = API.x;
                    } );
                folder.add( API, 'y', 0.1, 9.9, 0.1 )
                    .name( 'Y position' )
                    .onChange( function () {
                        light.position.y = API.y;
                    } );

                folder.add( API, 'z', 0.1, 9.9, 0.1 )
                    .name( 'Z position' )
                    .onChange( function () {
                        light.position.z = API.z;
                    } );
            }

            if (title == "Spot Light"){
                folder.add( API, 'tx', 0.1, 9.9, 0.1)
                    .name( 'Target X position' )
                    .onChange( function () {
                        light.target.position.x = API.tx;
                    } );
                folder.add( API, 'ty', 0.1, 9.9, 0.1 )
                    .name( 'Target Y position' )
                    .onChange( function () {
                        light.target.position.y = API.ty;
                    } );

                folder.add( API, 'tz', 0.1, 9.9, 0.1 )
                    .name( 'Target Z position' )
                    .onChange( function () {
                        light.target.position.z = API.tz;
                    } );
            }

            if (title != "Hemisphere Light"){
                folder.add( API, 'smwidth', 200, 700, 10 )
                    .name( 'Shadow Map Width' )
                    .onChange( function () {
                        light.shadow.mapSize.width = API.smwidth;
                    } );

                folder.add( API, 'smheight', 200, 700, 10 )
                    .name( 'Shadow Map Height' )
                    .onChange( function () {
                        light.shadow.mapSize.height = API.smheight;
                    } );
            }
        }

        function addObject(x, y, z, rx, ry, rz, geometry, material, shadow) {
            var obj = new THREE.Mesh(geometry, material);

            if (shadow) obj.castShadow = true;
            obj.receiveShadow = true;

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