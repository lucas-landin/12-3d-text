import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'


/**
 * Base
 */
// Debug
//const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/10.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/planetk.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'CyVr.Y2K',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - textGeometry.boundingBox.max.x * 0.5,
        //     - textGeometry.boundingBox.max.y * 0.5,
        //     - textGeometry.boundingBox.max.z * 0.5
        // )

        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text) 
    }
)

/**
 * Objects
 */

const donuts = []; // Array to store all the donuts


 const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
 const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
 
 for(let i = 0; i < 40; i++)
{
    const donut = createRandomMesh(donutGeometry, donutMaterial)
    donuts.push(donut);
    
}

    function createRandomMesh(geometry, material) {
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        mesh.scale.set(scale, scale, scale);

        scene.add(mesh);

        return mesh;
    }

    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    const cubes = [];

    for (let i = 0; i < 40; i++) {
        const cube = createRandomMesh(cubeGeometry, cubeMaterial);
        cubes.push(cube);
    }

    const pyramidGeometry = new THREE.ConeGeometry(0.5, 1, 4);
    const pyramidMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    const pyramids = [];

    for (let i = 0; i < 20; i++) {
        const pyramid = createRandomMesh(pyramidGeometry, pyramidMaterial);
        pyramids.push(pyramid);
    }

/**
 * Enviroment map
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/estrela.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 4
scene.add(camera)

/**
 * Camera movement along a semicircle
 */

// const radius = 4; // Raio do semicírculo
// let angle = 0; // Ângulo inicial

// const updateCameraPosition = () => {
//     // Movimento ao longo do semicírculo
//     const x = Math.sin(angle) * radius;
//     const z = Math.cos(angle) * radius;

//     // Ajusta a posição da câmera
//     camera.position.set(x, 1, z);

//     // Olha para o centro da cena
//     camera.lookAt(scene.position);
// };




// Defina os limites de distância para o zoom
const minZoomDistance = 2; // Distância mínima (zoom máximo)
const maxZoomDistance = 10; // Distância máxima (zoom mínimo)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Aplica os limites de distância aos controles
controls.minDistance = minZoomDistance;
controls.maxDistance = maxZoomDistance;


// Define os limites de rotação horizontal (azimute)
const minAzimuthAngle = -Math.PI / 8; // Ângulo mínimo
const maxAzimuthAngle = Math.PI / 8; // Ângulo máximo

// Aplica os limites aos controles
controls.minAzimuthAngle = minAzimuthAngle;
controls.maxAzimuthAngle = maxAzimuthAngle;

const minPolarAngle = Math.PI / 2; // Ângulo mínimo
const maxPolarAngle = (2 * Math.PI) /4; // Ângulo máximo

// Aplica os limites aos controles
controls.minPolarAngle = minPolarAngle;
controls.maxPolarAngle = maxPolarAngle;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    //  // Atualiza o ângulo para mover ao longo do semicírculo
    // angle += 0.002;

    // // Atualiza a posição da câmera ao longo do semicírculo
    // updateCameraPosition();

    const elapsedTime = clock.getElapsedTime()

    donuts.forEach((donut) => {
        donut.rotation.x = 0.5 * elapsedTime
    })

    cubes.forEach((cube) => {
        cube.rotation.z = 0.5 * elapsedTime
    })

    pyramids.forEach((pyramid) => {
        pyramid.rotation.y = 0.5 * elapsedTime
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()