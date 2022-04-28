import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
    import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
    import { GUI } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/lil-gui.module.min.js';

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
            metalness: 0.0
        };

        let PhongAPI = {
            shininess: 1.0,
            specular: '#FFFFFF'
        };

        let PhysicalAPI = {
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
        
        var wallRight = addObject(0, 5, 5, 0, Math.PI / 2, 0,
            new THREE.PlaneGeometry( 10, 10 ), 
            new THREE.MeshLambertMaterial({color: 0xff0000})
            );

        var wallLeft = addObject(10, 5, 5, 0, -Math.PI / 2, 0,
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

        var objLamb = addObject(8, 2, 1.5, Math.PI/2, 0, 0,
            new THREE.ConeBufferGeometry(1, 3, 16), 
            new THREE.MeshLambertMaterial({color: 0xffffff, transparency: true})
            );

        var objPhong = addObject(2, 2, 1, 0, 0, Math.PI/4,
            new THREE.CylinderBufferGeometry(1, 1, 3, 16), 
            new THREE.MeshPhongMaterial({color: 0xffffff, transparency: true})
            );

        var objPhy = addObject(5, 4, 1.5, 0, 0, 0,
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
                objLamb.material.opacity = allAPI.opacity;
                objPhong.material.opacity = allAPI.opacity;
                objPhy.material.opacity = allAPI.opacity;
            } );
        folderAll.add( allAPI, 'transparent')
            .name( 'transparent' )
            .onChange( function () {
                objLamb.material.transparent = allAPI.transparent;
                objPhong.material.transparent = allAPI.transparent;
                objPhy.material.transparent = allAPI.transparent;
            } );
        folderAll.add( allAPI, 'visible')
            .name( 'visible' )
            .onChange( function () {
                objLamb.material.visible = allAPI.visible;
                objPhong.material.visible = allAPI.visible;
                objPhy.material.visible = allAPI.visible;
            } );
        folderAll.addColor( allAPI, 'color')
            .name( 'color' )
            .onChange( function () {
                objLamb.material.color.set(allAPI.color);
                objPhong.material.color.set(allAPI.color);
                objPhy.material.color.set(allAPI.color);
            } );
        folderAll.addColor( allAPI, 'emissive')
            .name( 'emissive' )
            .onChange( function () {
                objLamb.material.emissive.set(allAPI.emissive);
                objPhong.material.emissive.set(allAPI.emissive);
                objPhy.material.emissive.set(allAPI.emissive);
            } );
        folderAll.add( allAPI, 'emissiveMap', envMapKeys)
            .name( 'emissiveMap' )
            .onChange( function (value) {
                updateTexture( objLamb.material, 'envMap', envMaps, value );
                updateTexture( objPhong.material, 'envMap', envMaps, value );
                updateTexture( objPhy.material, 'envMap', envMaps, value );
            } );
        folderAll.add( allAPI, 'map', diffuseMapKeys)
            .name( 'map' )
            .onChange( function (value) {
                updateTexture( objLamb.material, 'map', diffuseMaps, value );
                updateTexture( objPhong.material, 'map', diffuseMaps, value );
                updateTexture( objPhy.material, 'map', diffuseMaps, value );
            } );
        folderAll.add( allAPI, 'alphaMap', alphaMapKeys)
            .name( 'alphaMap' )
            .onChange( function (value) {
                updateTexture( objLamb.material, 'alphaMap', alphaMaps, value );
                updateTexture( objPhong.material, 'alphaMap', alphaMaps, value );
                updateTexture( objPhy.material, 'alphaMap', alphaMaps, value );
            } );
        folderAll.add( allAPI, 'emissiveIntensity', 0, 1, 0.1)
            .name( 'emissiveIntensity' )
            .onChange( function () {
                objLamb.material.emissiveIntensity = allAPI.emissiveIntensity;
                objPhong.material.emissiveIntensity = allAPI.emissiveIntensity;
                objPhy.material.emissiveIntensity = allAPI.emissiveIntensity;
            } );
        folderAll.add( allAPI, 'lightMapIntensity', 0, 1, 0.1)
            .name( 'lightMapIntensity' )
            .onChange( function () {
                objLamb.material.lightMapIntensity = allAPI.lightMapIntensity;
                objPhong.material.lightMapIntensity = allAPI.lightMapIntensity;
                objPhy.material.lightMapIntensity = allAPI.lightMapIntensity;
            } );
        folderAll.add( allAPI, 'wireframe')
            .name( 'wireframe' )
            .onChange( function () {
                objLamb.material.wireframe = allAPI.wireframe;
                objPhong.material.wireframe = allAPI.wireframe;
                objPhy.material.wireframe = allAPI.wireframe;
            } );
        folderAll.add( allAPI, 'metalness', 0, 1, 0.1)
            .name( 'metalness' )
            .onChange( function () {
                objLamb.material.metalness = allAPI.metalness;
                objPhong.material.metalness = allAPI.metalness;
                objPhy.material.metalness = allAPI.metalness;
            } );
        //Phong
        let folderPhong = gui.addFolder("Phong")
        folderPhong.add( PhongAPI, 'shininess', 0, 1, 0.1)
            .name( 'shininess' )
            .onChange( function () {
                objPhong.material.shininess = PhongAPI.shininess;
            } );
        folderPhong.addColor( PhongAPI, 'specular')
            .name( 'specular' )
            .onChange( function () {
                objPhong.material.specular.set(PhongAPI.specular);
            } );
        //Physical
        let folderPhysical = gui.addFolder("Physical")
        folderPhysical.add( PhysicalAPI, 'clearcoat', 0, 1, 0.1)
            .name( 'clearcoat' )
            .onChange( function () {
                objPhy.material.clearcoat = PhysicalAPI.clearcoat;
            } );

        folderPhysical.add( PhysicalAPI, 'reflectivity', 0, 1, 0.1)
            .name( 'reflectivity' )
            .onChange( function () {
                objPhy.material.reflectivity = PhysicalAPI.reflectivity;
            } );
        folderPhysical.add( PhysicalAPI, 'transmission', 0, 1, 0.1)
            .name( 'transmission' )
            .onChange( function () {
                objPhy.material.transmission = PhysicalAPI.transmission;
            } );
        folderPhysical.add( PhysicalAPI, 'roughness', 0, 1, 0.1)
            .name( 'roughness' )
            .onChange( function () {
                objPhy.material.roughness = PhysicalAPI.roughness;
            } );
        folderPhysical.add( PhysicalAPI, 'roughnessMap', roughnessMapKeys)
            .name( 'roughnessMap' )
            .onChange( function (value) {
                updateTexture( objPhy.material, 'roughnessMap', roughnessMaps, value );
            } );
        folderPhysical.add( PhysicalAPI, 'specularIntensity', 0, 1, 0.1)
            .name( 'specularIntensity' )
            .onChange( function () {
                objPhy.material.specularIntensity = PhysicalAPI.specularIntensity;
            } );

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