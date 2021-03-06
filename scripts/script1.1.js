import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 40;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 150, 150);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x5F5F5F);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    //Create floor

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

    for (let i = -200; i < 200; i+= 4){
        for (let j = -200; j < 200; j+= 4){
            addCross(i, j, 0);
        }
    }


    //Create primitives
    const objects = [];
    const spread = 25;

    const height = 8;
    const width = 8;
    const depth = 8;
    const radius = 7;
    const segments = 24;
    const radiusTop = 4;
    const radiusBottom = 4;
    const radialSegments = 12;
    const extrudeSettings = {
            steps: 2,
            depth: 2,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 2,
        };
    const widthSegments = 2;
    const heightSegments = 2;
    const points = [];
    for (let i = 0; i < 10; ++i) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
    }
    const verticesOfCube = [
        -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
        -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
    ];
    const indicesOfFaces = [
        2, 1, 0, 0, 3, 2,
        0, 4, 7, 7, 3, 0,
        0, 1, 5, 5, 4, 0,
        1, 2, 6, 6, 5, 1,
        2, 3, 7, 7, 6, 2,
        4, 5, 6, 6, 7, 4,
    ];
    const detail = 2;
    const innerRadius = 2;
    const outerRadius = 7;

    const shape = new THREE.Shape();
        const x = -2.5;
        const y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
        shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
        shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    
    const tubeRadius = 2;
    const tubularSegments = 24;

    const tube = 1.5;
    const p = 2;
    const q = 3;

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

    const path = new CustomSinCurve(4);
    const closed = false;
    const bufferRadius = 7;
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