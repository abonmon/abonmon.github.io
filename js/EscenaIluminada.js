/**
 * EscenaIluminada.js
 * 
 * Seminario 5 GPC: Pintar una escena con luces, materiales, sombras y vídeo
 * 
 * @author Yo, 2023
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js"
import {GLTFLoader} from "../lib/GLTFLoader.module.js"
import { OrbitControls } from "../lib/OrbitControls.module.js"
import {TWEEN} from "../lib/tween.module.min.js"
import Stats from "../lib/stats.module.js"
import {GUI} from "../lib/lil-gui.module.min.js"


// Variables de consenso 
let renderer, scene, camera;

// Otras globales
let esferaCubo, cubo, esfera, suelo;
let angulo = 0;
let cameraControls;
let stats;
let effectController;
let video;

// Acciones a realizar
init();
setupGUI();
loadScene();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight); // para que ocupe toda la pantalla
    renderer.setClearColor(new THREE.Color(0xAABBCC));
    document.getElementById("container").appendChild( renderer.domElement);
    renderer.antialias = true;
    renderer.shadowMap.enable = true;

    // Escena
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0.8,0.9,0.9);

    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 7);
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(0, 1, 0);

    //Luces
    const ambiental = new THREE.AmbientLight(0x222222);
    scene.add(ambiental);

    const direccional = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    direccional.position.set(-1, 1, -1); // izq arriba por detrás
    direccional.castShadow = true;
    scene.add(direccional);

    const puntual = new THREE.PointLight(0xFFFFFF, 0.3);
    puntual.position.set(2, 7, -4); // arriba a la dcha por detrás
    scene.add(puntual);

    const focal = new THREE.SpotLight(0xFFFFFF, 0.3); // es el cono que se proyecta en el suelo
    focal.position.set(-2, 7, 4); 
    focal.target.position.set(0, 0, 0);
    focal.angle = Math.PI/7;
    focal.penumbra = 0.3;
    focal.castShadow = true;
    scene.add(focal);
    scene.add(new THREE.CameraHelper(focal.shadow.camera));

    // Monitor
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '30px';
    stats.domElement.style.left = '0px';
    document.getElementById('container').appendChild(stats.domElement);

    // Eventos atendidos
    window.addEventListener('resize', updateAspectRatio);
    renderer.domElement.addEventListener('dblclick', animate);
}

function loadScene()
{
    // Definir el material que se va a utilizar
    //const material = new THREE.MeshBasicMaterial({color:'blue', wireframe: true});
    const texCubo = new THREE.TextureLoader().load('./images/wood512.jpg');
    const matCubo = new THREE.MeshLambertMaterial({color: 'red', map: texCubo});

    const entorno = ['./images/posx.jpg', './images/negx.jpg',
                    "./images/posy.jpg", "./images/negy.jpg",
                    "./images/posz.jpg", "./images/negz.jpg"];

    const texEsfera = new THREE.CubeTextureLoader().load(entorno);
    const matEsfera = new THREE.MeshPhongMaterial({color: 'white', specular: 'white', shininess: 30, envMap: texEsfera}); //material con brillo
    
    
    const texSuelo = new THREE.TextureLoader().load('./images/wet_ground_512x512.jpg');
    const matSuelo = new THREE.MeshStandardMaterial({color: 'gray', map: texSuelo});

    // Geometria del cubo + esfera
    const geoCubo = new THREE.BoxGeometry(2, 2, 2);
    const geoEsfera = new THREE.SphereGeometry(1, 20, 20);

    // Malla
    cubo = new THREE.Mesh(geoCubo, matCubo);
    cubo.castShadow = true;
    cubo.receiveShadow = true;

    esfera = new THREE.Mesh(geoEsfera, matEsfera);
    esfera.castShadow = true;
    esfera.receiveShadow = true;

    // Crear un objeto que no sea una malla
    esferaCubo = new THREE.Object3D();

    // Transformaciones de posición
    cubo.position.set(1, 0, 0); // para hacer matriz de traslación, para hacer un giro, sería con la propiedad rotation
    esfera.position.set(-1, 0, 0);
    esferaCubo.position.set(0, 1, 0);


    // Carga de la malla en la escena
    esferaCubo.add(cubo);
    esferaCubo.add(esfera);
    scene.add(esferaCubo);

    // Definir un suelo
    suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), matSuelo);
    suelo.rotation.x = -Math.PI/2;
    suelo.castShadow = true;
    suelo.receiveShadow = true;
    scene.add(suelo);

    // Importar un modelo JSON
    const loader = new THREE.ObjectLoader();
    loader.load("models/soldado/soldado.json",
                function(objeto){
                    cubo.add(objeto);
                    objeto.position.set(0,1,0);
                    objeto.rotation.y = Math.PI;
                    objeto.name = 'soldado';
                    objeto.castShadow = true;
                    objeto.receiveShadow = true;
                    //objeto.material.setValues({map: new THREE.TextureLoader().load('models/soldado/soldado.png'})});
                } );

    // Importar modelo en GLTF
    const gltfloader = new GLTFLoader();
    gltfloader.load("models/robota/scene.gltf",
                        function(gltf){
                            gltf.scene.position.y = 1;
                            gltf.scene.rotation.y = Math.PI/2;
                            esfera.add(gltf.scene);
                            gltf.scene.name = 'robota'
                            gltf.scene.traverse(ob=>{
                                if(ob.isObject3D) ob.castShadow = ob.receiveShadow = true;
                            })
                    });

    // Habitación
    const paredes = [];
    paredes.push(new THREE.MeshBasicMaterial({side: THREE.BackSide, 
                                            map:new THREE.TextureLoader().load('./images/posx.jpg')}));
    paredes.push(new THREE.MeshBasicMaterial({side: THREE.BackSide, 
                                            map:new THREE.TextureLoader().load('./images/negx.jpg')}));
    paredes.push(new THREE.MeshBasicMaterial({side: THREE.BackSide, 
                                            map:new THREE.TextureLoader().load('./images/posy.jpg')}));
    paredes.push(new THREE.MeshBasicMaterial({side: THREE.BackSide, 
                                             map:new THREE.TextureLoader().load('./images/negy.jpg')}));
    paredes.push(new THREE.MeshBasicMaterial({side: THREE.BackSide, 
                                            map:new THREE.TextureLoader().load('./images/posz.jpg')}));
    paredes.push(new THREE.MeshBasicMaterial({side: THREE.BackSide, 
                                             map:new THREE.TextureLoader().load('./images/negz.jpg')}));


    
    const geoHabitacion = new THREE.BoxGeometry(40, 40, 40);
    const habitacion = new THREE.Mesh(geoHabitacion, paredes);
    scene.add(habitacion); 

    // Pantala de cine
    video = document.createElement('video');
    video.src = "./videos/Pixar.mp4";
    video.load();
    video.muted = true;
    const videotextura = new THREE.VideoTexture(video);
    const matPantalla = new THREE.MeshBasicMaterial({map: videotextura, side: THREE.DoubleSide});
    const pantalla = new THREE.Mesh(new THREE.PlaneGeometry(20, 6, 4, 4), matPantalla);
    pantalla.position.set(0, 3, -6);
    scene.add(pantalla);


    // Añadir ejes
    scene.add(new THREE.AxisHelper(2));
}

function setupGUI()
{
    // Definicion del objeto controlador
    effectController = {
        mensaje: "Soldado y robot",
        giroY: 0.0,
        separacion: 0,
        coloralambres: 'rgb(150, 150, 150)',
        silencio: true,
        play: function(){video.play();},
        pause: function(){video.pause();}
    };

    // Crear la GUI
    const gui = new GUI();

    // Construir el menu de widgets
    const h = gui.addFolder('Controles')
    h.add(effectController, "mensaje").name("Aplicacion"); // como es string crea automaticamente una caja de texto
    h.add(effectController, "giroY", -180.0, 180.0, 0.025).name("Giro en Y");
    h.add(effectController, "separacion", {"Ninguna": 0, "Media": 2, "Total": 5}).name('Separacion');
    h.addColor(effectController, "coloralambres").name("Color alambres");
    const videoFolder = gui.addFolder("Video control");
    videoFolder.add(effectController, "silencio").onChange(v=>{video.muted = v;}).name("Mutear");
    videoFolder.add(effectController, "play");
    videoFolder.add(effectController, "pause");

}

function updateAspectRatio()
{
    renderer.setSize(window.innerWidth, window.innerHeight); // para que el motor ocupe toda la pantalla
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

}

function animate(event)
{
    
    // Capturar posición del click
    let x = event.clientX;
    let y = event.clientY;

    // Normalizar al cuadrado de 2x2
    x = (x/window.innerWidth) * 2 - 1;
    y = -(y/window.innerHeight) * 2 + 1;

    // Construir el rayo
    const rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x, y), camera);

    // Calcular las intersecciones con soldado y robot
    const soldado = scene.getObjectByName('soldado');
    let intersecciones = rayo.intersectObject(soldado, false);
    if(intersecciones.length > 0){
        console.log("Tocado!")
        // Animación
        new TWEEN.Tween(soldado.position)
        .to({x:[0,0], y:[3,1], z:[0,0]}, 2000) // 2000 para q lo haga en 2 segs
        .interpolation(TWEEN.Interpolation.Bezier) 
        .easing(TWEEN.Easing.Bounce.Out)
        .start();
    }

    const robot = scene.getObjectByName('robota');
    intersecciones = rayo.intersectObjects(robot.children, true);
    if(intersecciones.length > 0){
        console.log("Tocado!")
        // Animación
        new TWEEN.Tween(robot.rotation)
        .to({x:[0,0], y:[Math.PI,-Math.PI/2], z:[0,0]}, 5000) 
        .interpolation(TWEEN.Interpolation.Linear) 
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }

}

function update(delta)
{
    stats.update();
    TWEEN.update(delta);

    cubo.position.set(1 + effectController.separacion/2, 0, 0);
    esfera.position.set(-1 - effectController.separacion/2, 0, 0);
    suelo.material.setValues({color:effectController.coloralambres});
    esferaCubo.rotation.y = effectController.giroY * Math.PI/180;
}

function render(delta)
{
    requestAnimationFrame(render);
    update(delta);
    renderer.render(scene, camera);
}