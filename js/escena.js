/**
 * Escena.js
 * Seminario #2 GPC. Pintar una escena con transfromaciones, animación y módulos importados.
 * @author: abonmon@upv.edu.es
 */


// Modulos necesarios
import * as THREE from "../lib/three.module.js"
import { GLTFLoader } from "../lib/GLTFLoader.module.js" //Para hacer carga de ficheros gltf

// Variables globales de consenso
let renderer, scene, camera

// Otras globales
let esferaCubo
let angulo = 0

// Funciones
function init() {
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight ); //Ocupar todo el área de dibujo, recogiendo el objeto window del navegador
    document.getElementById('container').appendChild( renderer.domElement ); //Le añadimos el Canvas, que está como una propiedad del motor

    // Instanciar el nodo raíz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.7,0.9,0.9); //El background también se le podría decir al render (color azul )

    // Instanciar cámara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0.5, 2, 7);
    camera.lookAt( 0, 1, 0 ) ;
}

function loadScene() {
    // Material sencillo
    const material = new THREE.MeshBasicMaterial({ color:'yellow', wireframe:true }); //a true saldría en modo alambre (cubo rellenado)
    const geoCubo = new THREE.BoxGeometry( 2, 2, 2 );
    const cubo = new THREE.Mesh( geoCubo, material ); // Hasta esta línea se puede ejecutar y con render (sobra de aquí a render)
    const geoEsfera = new THREE.SphereGeometry( 1, 20, 20 );

    // Suelo
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10, 10, 10 ), material )
    suelo.rotation.x = -Math.PI/2
    scene.add( suelo )

    // Esfera
    const esfera = new THREE.Mesh( geoEsfera, material );
    esferaCubo = new THREE.Object3D();
    esferaCubo.add( esfera )
    esferaCubo.add( cubo )

    //esferaCubo.position.y = 1.5
    //esfera.position.x = 1
    //cubo.position.x = -1 

    cubo.position.set( 1, 0, 0 );
    esfera.position.set( -1, 0, 0 );
    esferaCubo.position.set( 0, 1, 0 );

    //scene.add( cubo );
    // scene.add( esfera )
    scene.add( esferaCubo );
    scene.add( new THREE.AxisHelper(2) ); //Ejes de coordenadas
    // cubo.add( new THREE.AxesHelper( 1 ) )

    // Modelos importados
    const loader = new THREE.ObjectLoader()
    loader.load( 'models/soldado/soldado.json', function(objeto) {
        cubo.add(objeto)
        //objeto.position.y = 1
        objeto.position.set( 0, 1, 0 )
    })

    const gltfloader = new GLTFLoader()
    gltfloader.load( 'models/robota/scene.gltf', function(objeto) {
        esfera.add( objeto.scene )
        objeto.scene.scale.set( 0.5, 0.5, 0.5 )
        objeto.scene.position.y = 1
        objeto.scene.rotation.y = -Math.PI/2
        esfera.add(gltf.scene)
        // console.log( "ROBOT" )
        // console.log( objeto )
    })
}

function update() {
    angulo += 0.01
    // scene.rotation.y = angulo
    esferaCubo.rotation.y = angulo
}

function render() {
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}

// Acciones
init()
loadScene()
render()

