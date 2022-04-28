import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
    import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
    import {FlyControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/FlyControls.js';

    function main() {

        const canvas = document.querySelector('#c');
        const view1Elem = document.querySelector('#view1');
        const view2Elem = document.querySelector('#view2');
        const renderer = new THREE.WebGLRenderer({canvas});

        const scene = new THREE.Scene();
        const clock = new THREE.Clock();

        let objects = [];
        let spread = 25;
        let size = 100;

        let camera, camera2, controls, controls2;

        init();
        requestAnimationFrame(render);

        function init() {
            let fov = 40;
            let aspect = 2;  // the canvas default
            let near = 0.1;
            let far = 1000;

            camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
            camera.position.set(0, 150, 150);
            camera.up.set(0, 0, 1);
            camera.lookAt(0, 0, 0);

            controls = new OrbitControls(camera, view1Elem);
            controls.target.set(0, 5, 0);
            controls.update();

            camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera2.position.set(0, 150, 150);
            camera2.up.set(0, 0, 1);
            camera2.lookAt(0, 0, 0);

            controls2 = new FlyControls(camera2, view2Elem);
        
            controls2.movementSpeed = 100;
            controls2.rollSpeed  = 1;
            controls2.autoForward = false;
            controls2.dragToLook = true;
            
            scene.background = new THREE.Color(0x5F5F5F);

            {
                let color = 0xFFFFFF;
                let intensity = 1;
                let light = new THREE.DirectionalLight(color, intensity);
                light.position.set(-1, 2, 4);
                scene.add(light);
            }

            //Create floor
            for (let i = -200; i < 200; i+= 4){
                for (let j = -200; j < 200; j+= 4){
                    addCross(i, j, 0);
                }
            }

            //Create Primitives
            createPrimitives();
        }

        function verticalPoints(x, y){
            let points = [];
            points.push( new THREE.Vector3( x, y - 1, 0 ) );
            points.push( new THREE.Vector3( x, y + 1, 0 ) );
            return points;
        }

        function horizontalPoints(x, y){
            let points = [];
            points.push( new THREE.Vector3( x - 1, y, 0 ) );
            points.push( new THREE.Vector3( x + 1, y, 0 ) );
            return points;
        }

        function getOpacity(x, y){
            let dist = Math.sqrt((x * x) + (y * y));
            return dist/100;
        }

        function addCross(x, y, diff) {
            let vp = verticalPoints(x, y);
            let geometry = new THREE.BufferGeometry().setFromPoints( vp );
            //let  material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
            let op = 1.0 - getOpacity(x, y);
            let  material = new THREE.LineBasicMaterial({ 
                color: 0xFFFFFF ,
                opacity: op,
                transparent: true
            });
            let line = new THREE.Line( geometry, material );
            scene.add( line );

            let hp = horizontalPoints(x, y);
            geometry = new THREE.BufferGeometry().setFromPoints( hp );
            line = new THREE.Line( geometry, material );
            scene.add( line );
        }

        function createPrimitives(){
            
            let height = 8;
            let width = 8;
            let depth = 8;
            let radius = 7;
            let segments = 24;
            let radiusTop = 4;
            let radiusBottom = 4;
            let radialSegments = 12;
            let extrudeSettings = {
                    steps: 2,
                    depth: 2,
                    bevelEnabled: true,
                    bevelThickness: 1,
                    bevelSize: 1,
                    bevelSegments: 2,
                };
            let widthSegments = 2;
            let heightSegments = 2;
            let points = [];

            for (let i = 0; i < 10; ++i) {
                points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
            }

            let verticesOfCube = [
                -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
                -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
            ];
            let indicesOfFaces = [
                2, 1, 0, 0, 3, 2,
                0, 4, 7, 7, 3, 0,
                0, 1, 5, 5, 4, 0,
                1, 2, 6, 6, 5, 1,
                2, 3, 7, 7, 6, 2,
                4, 5, 6, 6, 7, 4,
            ];
            let detail = 2;
            let innerRadius = 2;
            let outerRadius = 7;

            let shape = new THREE.Shape();
                let x = -2.5;
                let y = -5;
                shape.moveTo(x + 2.5, y + 2.5);
                shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
                shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
                shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
                shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
                shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
                shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
            
            let tubeRadius = 2;
            let tubularSegments = 24;

            let tube = 1.5;
            let p = 2;
            let q = 3;

            class CustomSinCurve extends THREE.Curve {
                constructor(scale) {
                    super();
                    this.scale = scale;
                }
                getPoint(t) {
                    const tx = t * 3 - 1.5;
                    const ty = Math.sin(2 * Math.PI * t);
                    const tz = 0;
                    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
                }
            }

            let path = new CustomSinCurve(4);
            let closed = false;
            let bufferRadius = 7;
            let z = 0;
            let change = 0;
            for (let i = 0; i < 3; i++) {
                addSolidGeometry(-2, 2, z, new THREE.BoxBufferGeometry(width - change, height, depth));
                addSolidGeometry(-1, 2, z, new THREE.CircleBufferGeometry(radius - change, segments));
                addSolidGeometry(0, 2, z, new THREE.ConeBufferGeometry(radius - change, height, segments));
                addSolidGeometry(1, 2, z, new THREE.CylinderBufferGeometry(radiusTop - change, radiusBottom, height, radialSegments));
                addSolidGeometry(2, 2, z, new THREE.DodecahedronBufferGeometry(radius - change));
                addSolidGeometry(-2, 1, z, new THREE.ExtrudeBufferGeometry(shape, extrudeSettings));
                addSolidGeometry(-1, 1, z, new THREE.IcosahedronBufferGeometry(radius - change));
                addSolidGeometry(0, 1, z, new THREE.LatheBufferGeometry(points));
                addSolidGeometry(1, 1, z, new THREE.OctahedronBufferGeometry(radius  - change));
                addSolidGeometry(-2, 0, z, new THREE.PlaneBufferGeometry(width  - change, height, widthSegments, heightSegments));
                addSolidGeometry(-1, 0, z, new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, radius  - change, detail));
                addSolidGeometry(0, 0, z, new THREE.RingBufferGeometry(innerRadius, outerRadius, segments  - change));
                addSolidGeometry(1, 0, z, new THREE.ShapeBufferGeometry(shape));
                addSolidGeometry(2, 0, z, new THREE.SphereBufferGeometry(radius  - change, widthSegments, heightSegments));
                addSolidGeometry(-2, -1, z, new THREE.TetrahedronBufferGeometry(radius  - change));
                addSolidGeometry(0, -1, z, new THREE.TorusBufferGeometry(radius  - change, tubeRadius, radialSegments, tubularSegments));
                addSolidGeometry(1, -1, z, new THREE.TorusKnotBufferGeometry(radius  - change, tube, tubularSegments, radialSegments, p, q));
                addSolidGeometry(2, -1, z, new THREE.TubeBufferGeometry(path, tubularSegments, bufferRadius - change, radialSegments, closed));
                z += spread;
                change += 2;
            }
        }

        function addObject(x, y, z, obj) {
            obj.position.x = x * spread;
            obj.position.y = y * spread;
            obj.position.z = z;

            scene.add(obj);
            objects.push(obj);
        }

        function createMaterial() {
            const material = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
            });

            const hue = Math.random();
            const saturation = 1;
            const luminance = .5;
            material.color.setHSL(hue, saturation, luminance);

            return material;
        }

        function addSolidGeometry(x, y, z, geometry) {
            const mesh = new THREE.Mesh(geometry, createMaterial());
            addObject(x, y, z, mesh);
        }

        function addLineGeometry(x, y, z, geometry) {
            const material = new THREE.LineBasicMaterial({ color: 0x000000 });
            const mesh = new THREE.LineSegments(geometry, material);
            addObject(x, y, z, mesh);
        }

        function setScissorForElement(elem) {
            const canvasRect = canvas.getBoundingClientRect();
            const elemRect = elem.getBoundingClientRect();

            // compute a canvas relative rectangle
            const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
            const left = Math.max(0, elemRect.left - canvasRect.left);
            const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
            const top = Math.max(0, elemRect.top - canvasRect.top);

            const width = Math.min(canvasRect.width, right - left);
            const height = Math.min(canvasRect.height, bottom - top);

            // setup the scissor to only render to that part of the canvas
            const positiveYUpBottom = canvasRect.height - bottom;
            renderer.setScissor(left, positiveYUpBottom, width, height);
            renderer.setViewport(left, positiveYUpBottom, width, height);

            // return the aspect
            return width / height;
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
            resizeRendererToDisplaySize(renderer);
            renderer.setScissorTest(true);
            const delta = clock.getDelta();
            // render the original view

            
            {
                const aspect = setScissorForElement(view1Elem);
                camera.left = -aspect * size / 2;
                camera.right = aspect * size  / 2
                camera.top = size / 2;
                camera.bottom = -size / 2;
                camera.updateProjectionMatrix();
                renderer.render(scene, camera);
            }
            

            // render from the 2nd camera
            {
                const aspect = setScissorForElement(view2Elem);
                camera2.aspect = aspect;
                camera2.updateProjectionMatrix();
				controls2.update( delta );
                renderer.render(scene, camera2);
            }

            requestAnimationFrame(render);
        }
    }

    main();