import * as Three from 'three'
import * as Tween from '@tweenjs/tween.js'

import WebGL from 'three/addons/capabilities/WebGL.js'

import { createPerspectiveCamera } from './camera'
import { setupKeys } from './keyboard'

/**
 * Checks if WebGL is available in the current browser and throws an error if not.
 * @throws {Error} If WebGL is not available in the current browser.
*/

function assertWebGLAvailable() {

  // If the current browser is not supported.
  if (!(WebGL.isWebGLAvailable())) {

    // Show an error if not compatible.
    const error = WebGL.getWebGLErrorMessage()
    document.body.appendChild(error)

    throw new Error(error)
  }
}

/**
 * Creates a Three.js scene with an axes helper, a perspective camera, a WebGL renderer, and keyboard listeners.
 * @returns {{renderer: Three.WebGLRenderer, scene: Three.Scene, mainCamera: Three.PerspectiveCamera}} An object containing the renderer, scene, and mainCamera.
*/

function prepare () {

  const scene = new Three.Scene()
  scene.add(new Three.AxesHelper(500))

  // Create a camera and position it.
  const mainCamera = createPerspectiveCamera(window.innerWidth / window.innerHeight, 300)
  const renderer = new Three.WebGLRenderer({ antialias: true })
  document.body.appendChild(renderer.domElement)

  // Set it full-screen.
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.autoClear = false

  // Setup the keyboard listeners.
  setupKeys()

  return { renderer, scene, mainCamera }
}


/**
 * Initializes the app by creating a Three.js scene, adding an axes helper, and setting up a WebGL renderer.
 * @returns {{scene: Three.Scene, renderer: Three.WebGLRenderer start: Function}} An object containing the scene and a start function to begin rendering the scene.
*/

export function initializeApp () {

  // If WebGL is not available the code stops here.
  assertWebGLAvailable()

  const { renderer, scene, mainCamera } = prepare()

  // The timestamp of the previous frame.
  let previous = Date.now()
  const animate = (time, onUpdate) => {

    // Calculate the new timestep.
    let now = Date.now()
    let delta = (now - previous) / 1000
    previous = now

    renderer.clear()

    Tween.update(time)
    onUpdate?.(delta, time)

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
    renderer.render(scene, mainCamera)

    requestAnimationFrame((time) => animate(time, onUpdate))
  }

  return { 
    
    scene, 
    renderer,
    mainCamera,

    start: (onUpdate) => animate(0, onUpdate)
  }
}


