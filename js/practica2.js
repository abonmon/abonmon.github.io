/**
 * Practica 2 : Brazo de un robot
 * @author: abonmon@upv.edu.es
 */


// Modulos necesarios
import * as THREE from "../lib/three.module.js"

// Variables globales de consenso
let renderer, scene, camera

// Funciones
function init() {
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight ); //Ocupar todo el área de dibujo, recogiendo el objeto window del navegador
    document.getElementById('container').appendChild( renderer.domElement ); //Le añadimos el Canvas, que está como una propiedad del motor

    // Instanciar el nodo raíz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(1,1,1); //El background también se le podría decir al render (color azul)

    // Instanciar cámara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0.5, 2, 7);
    camera.lookAt( 0, 1, 0 ) ;
}

function loadScene() {

    const material = new THREE.MeshBasicMaterial({ color:'black', wireframe:true }); //a true saldría en modo alambre (cubo rellenado)

    // Suelo
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(1000,1000,0,0), material )
    suelo.rotation.x = -Math.PI/2
    scene.add( suelo )

    // Cilindro

    const cilindro = new THREE.Mesh( new THREE.CylinderGeometry(2.5,2.5,.75,20), material)
    scene.add( cilindro )

    // Cilindro intermedio (rueda)
    const cilindroIntermedio = new THREE.Mesh(new THREE.CylinderGeometry(2,2,.5,30), material); // Ajusta las dimensiones
    cilindroIntermedio.position.set(0, 0.25, 0); // Posición elevada en el eje Y
    cilindroIntermedio.rotation.x = Math.PI / 2; // Rota el cilindro para que esté de pie
    scene.add(cilindroIntermedio);

    // Rectángulo encima del cilindro intermedio
    const rectangulo = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 1), material); // Ajusta las dimensiones
    rectangulo.position.set(0, 2, 0); // Posición encima del cilindro intermedio
    scene.add(rectangulo);

    // Esfera en la parte superior del rectángulo
    const esfera = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material); // Ajusta el radio
    esfera.position.set(0, 5, 0); // Posición en la parte superior del rectángulo
    scene.add(esfera);

    }

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}

// Acciones
init()
loadScene()
render()