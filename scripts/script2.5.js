import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
    import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
    import { GUI } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/lil-gui.module.min.js';
    import { RectAreaLightHelper }  from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/RectAreaLightHelper.js';

    function main() {
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ canvas });
        
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

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.PointLight(color, intensity, 100);
            light.position.set(5, 5, 9.5);
            scene.add(light);
        }

        function getObjectsKeys( obj ) {
            const keys = [];
            for ( const key in obj ) {
                if ( obj.hasOwnProperty( key ) ) {

                    keys.push( key );
                }
            }
            return keys;
        }

        const textureLoader = new THREE.TextureLoader();
        const cubeTextureLoader = new THREE.CubeTextureLoader();

        const envMaps = ( function () {
            const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/';
            const format = '.jpg';
            const urls = [
                path + 'px' + format, path + 'nx' + format,
                path + 'py' + format, path + 'ny' + format,
                path + 'pz' + format, path + 'nz' + format
            ];

            const reflectionCube = cubeTextureLoader.load( urls );

            const refractionCube = cubeTextureLoader.load( urls );
            refractionCube.mapping = THREE.CubeRefractionMapping;

            return {
                none: null,
                reflection: reflectionCube,
                refraction: refractionCube
            };
        } )();

        const diffuseMaps = ( function () {
            const bricks = textureLoader.load( 'https://threejs.org/examples/textures/brick_diffuse.jpg' );
            bricks.wrapS = THREE.RepeatWrapping;
            bricks.wrapT = THREE.RepeatWrapping;
            bricks.repeat.set( 9, 1 );

            return {
                none: null,
                bricks: bricks
            };
        } )();

        const alphaMaps = ( function () {
            const fibers = textureLoader.load( 'https://threejs.org/examples/textures/alphaMap.jpg' );
            fibers.wrapT = THREE.RepeatWrapping;
            fibers.wrapS = THREE.RepeatWrapping;
            fibers.repeat.set( 9, 1 );

            return {
                none: null,
                fibers: fibers
            };
        } )();

        const roughnessMaps = ( function () {
            const bricks = textureLoader.load( 'https://threejs.org/examples/textures/brick_roughness.jpg' );
            bricks.wrapT = THREE.RepeatWrapping;
            bricks.wrapS = THREE.RepeatWrapping;
            bricks.repeat.set( 9, 1 );

            return {
                none: null,
                bricks: bricks
            };
        } )();

        function updateTexture( material, materialKey, textures, key ) {
            material[ materialKey ] = textures[ key ];
            material.needsUpdate = true;
        }

        const envMapKeys = getObjectsKeys( envMaps );
        const diffuseMapKeys = getObjectsKeys( diffuseMaps );
        const roughnessMapKeys = getObjectsKeys( roughnessMaps );
        const alphaMapKeys = getObjectsKeys( alphaMaps );

        let allAPI = {
            opacity: 1.0,
            transparent: true,
            visible: true,
            color: '#FFFFFF',
            emissive: '#000000',
            emissiveMap: envMapKeys[0],
            map: diffuseMapKeys[0],
            alphaMap: alphaMapKeys[0],
            emissiveIntensity: 1.0,
            lightMapIntensity: 1.0,
            wireframe: false,
            metalness: 0.0,
            clearcoat: 0.0,
            reflectivity: 1.0,
            transmission: 0.0,
            roughness: 1.0,
            roughnessMap: roughnessMapKeys[0],
            specularIntensity: 1.0
        };

        //Axes Helper
        const axesHelper = new THREE.AxesHelper( 55 );
        scene.add( axesHelper );

        //Create Room

        var wallBack = addObject(5, 0, 5, -Math.PI / 2, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff})
            );
        addWall(5, -0.01, 5, -Math.PI / 2, 0, 0, new THREE.Color( 0xffffff ));
        
        var wallRight = addObject(0, 5, 5, 0, Math.PI / 2, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xff0000})
            );
        addWall(-0.01, 5, 5, 0, Math.PI / 2, 0, new THREE.Color( 0xff0000 ));

        var wallLeft = addObject(10, 5, 5, 0, -Math.PI / 2, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0x00ff00})
            );
        addWall(10.01, 5, 5, 0, -Math.PI / 2, 0, new THREE.Color( 0x00ff00 ));
        
        var wallTop = addObject(5, 5, 10, Math.PI, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff})
            );

        var wallBottom = addObject(5, 5, 0, 0, 0, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xffffff})
            );
        
        var wallLight = addObject(5, 5, 9.99, Math.PI, 0, 0,
            new THREE.PlaneGeometry( 2, 2 ), 
            new THREE.MeshStandardMaterial({color: 0xffffff})
            );
        
        //Create Objects

        var cone = addObject(8, 2, 1.5, Math.PI/2, 0, 0,
            new THREE.ConeBufferGeometry(1, 3, 16), 
            new THREE.MeshPhysicalMaterial({color: 0xffffff, transparency: true})
            );

        var cylinder = addObject(2, 2, 1, 0, 0, Math.PI/4,
            new THREE.CylinderBufferGeometry(1, 1, 3, 16), 
            new THREE.MeshPhysicalMaterial({color: 0xffffff, transparency: true})
            );

        var sphere = addObject(5, 4, 1.5, 0, 0, 0,
            new THREE.SphereBufferGeometry(1.5, 16, 16), 
            new THREE.MeshPhysicalMaterial({color: 0xffffff, transparency: true})
            );
        
        //Create GUI
        gui = new GUI( { title: "Objects" } );
        //All
        let folderAll = gui.addFolder("All")
        folderAll.add( allAPI, 'opacity', 0, 1, 0.1)
            .name( 'opacity' )
            .onChange( function () {
                cone.material.opacity = allAPI.opacity;
                cylinder.material.opacity = allAPI.opacity;
                sphere.material.opacity = allAPI.opacity;
            } );
        folderAll.add( allAPI, 'transparent')
            .name( 'transparent' )
            .onChange( function () {
                cone.material.transparent = allAPI.transparent;
                cylinder.material.transparent = allAPI.transparent;
                sphere.material.transparent = allAPI.transparent;
            } );
        folderAll.add( allAPI, 'visible')
            .name( 'visible' )
            .onChange( function () {
                cone.material.visible = allAPI.visible;
                cylinder.material.visible = allAPI.visible;
                sphere.material.visible = allAPI.visible;
            } );
        folderAll.addColor( allAPI, 'color')
            .name( 'color' )
            .onChange( function () {
                cone.material.color.set(allAPI.color);
                cylinder.material.color.set(allAPI.color);
                sphere.material.color.set(allAPI.color);
            } );
        folderAll.addColor( allAPI, 'emissive')
            .name( 'emissive' )
            .onChange( function () {
                cone.material.emissive.set(allAPI.emissive);
                cylinder.material.emissive.set(allAPI.emissive);
                sphere.material.emissive.set(allAPI.emissive);
            } );
        folderAll.add( allAPI, 'emissiveMap', envMapKeys)
            .name( 'emissiveMap' )
            .onChange( function (value) {
                updateTexture( cone.material, 'envMap', envMaps, value );
                updateTexture( cylinder.material, 'envMap', envMaps, value );
                updateTexture( sphere.material, 'envMap', envMaps, value );
            } );
        folderAll.add( allAPI, 'map', diffuseMapKeys)
            .name( 'map' )
            .onChange( function (value) {
                updateTexture( cone.material, 'map', diffuseMaps, value );
                updateTexture( cylinder.material, 'map', diffuseMaps, value );
                updateTexture( sphere.material, 'map', diffuseMaps, value );
            } );
        folderAll.add( allAPI, 'alphaMap', alphaMapKeys)
            .name( 'alphaMap' )
            .onChange( function (value) {
                updateTexture( cone.material, 'alphaMap', alphaMaps, value );
                updateTexture( cylinder.material, 'alphaMap', alphaMaps, value );
                updateTexture( sphere.material, 'alphaMap', alphaMaps, value );
            } );
        folderAll.add( allAPI, 'emissiveIntensity', 0, 1, 0.1)
            .name( 'emissiveIntensity' )
            .onChange( function () {
                cone.material.emissiveIntensity = allAPI.emissiveIntensity;
                cylinder.material.emissiveIntensity = allAPI.emissiveIntensity;
                sphere.material.emissiveIntensity = allAPI.emissiveIntensity;
            } );
        folderAll.add( allAPI, 'lightMapIntensity', 0, 1, 0.1)
            .name( 'lightMapIntensity' )
            .onChange( function () {
                cone.material.lightMapIntensity = allAPI.lightMapIntensity;
                cylinder.material.lightMapIntensity = allAPI.lightMapIntensity;
                sphere.material.lightMapIntensity = allAPI.lightMapIntensity;
            } );
        folderAll.add( allAPI, 'wireframe')
            .name( 'wireframe' )
            .onChange( function () {
                cone.material.wireframe = allAPI.wireframe;
                cylinder.material.wireframe = allAPI.wireframe;
                sphere.material.wireframe = allAPI.wireframe;
            } );
        folderAll.add( allAPI, 'metalness', 0, 1, 0.1)
            .name( 'metalness' )
            .onChange( function () {
                cone.material.metalness = allAPI.metalness;
                cylinder.material.metalness = allAPI.metalness;
                sphere.material.metalness = allAPI.metalness;
            } );
        folderAll.add( allAPI, 'clearcoat', 0, 1, 0.1)
            .name( 'clearcoat' )
            .onChange( function () {
                cone.material.clearcoat = allAPI.clearcoat;
                cylinder.material.clearcoat = allAPI.clearcoat;
                sphere.material.clearcoat = allAPI.clearcoat;
            } );
        folderAll.add( allAPI, 'reflectivity', 0, 1, 0.1)
            .name( 'reflectivity' )
            .onChange( function () {
                cone.material.reflectivity = allAPI.reflectivity;
                cylinder.material.reflectivity = allAPI.reflectivity;
                sphere.material.reflectivity = allAPI.reflectivity;
            } );
        folderAll.add( allAPI, 'transmission', 0, 1, 0.1)
            .name( 'transmission' )
            .onChange( function () {
                cone.material.transmission = allAPI.transmission;
                cylinder.material.transmission = allAPI.reflectivity;
                sphere.material.transmission = allAPI.reflectivity;
            } );
        folderAll.add( allAPI, 'roughness', 0, 1, 0.1)
            .name( 'roughness' )
            .onChange( function () {
                cone.material.roughness = allAPI.roughness;
                cylinder.material.roughness = allAPI.roughness;
                sphere.material.roughness = allAPI.roughness;

            } );
        folderAll.add( allAPI, 'roughnessMap', roughnessMapKeys)
            .name( 'roughnessMap' )
            .onChange( function (value) {
                updateTexture( cone.material, 'roughnessMap', roughnessMaps, value );
                updateTexture( cylinder.material, 'roughnessMap', roughnessMaps, value );
                updateTexture( sphere.material, 'roughnessMap', roughnessMaps, value );
            } );
        folderAll.add( allAPI, 'specularIntensity', 0, 1, 0.1)
            .name( 'specularIntensity' )
            .onChange( function () {
                cone.material.specularIntensity = allAPI.specularIntensity;
                cylinder.material.specularIntensity = allAPI.specularIntensity;
                sphere.material.specularIntensity = allAPI.specularIntensity;
            } );

        function addWall(x, y, z, rx, ry, rz, color) {
            let width = 10;
            let height = 10;
            let intensity = 1;
            let rectLight = new THREE.RectAreaLight( color, intensity,  width, height );
            rectLight.position.set( x, y, z );
            rectLight.rotation.set( rx, ry, rz );
            rectLight.lookAt( 5, 5, 5 );
            console.log(rectLight.power);
            //rectLight.power = 1.0;
            console.log(rectLight.power);
            scene.add( rectLight );

            const rectLightHelper = new RectAreaLightHelper( rectLight );
            rectLight.add( rectLightHelper );

            return rectLight;
        }

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