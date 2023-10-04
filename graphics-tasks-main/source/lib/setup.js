import * as Three from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'

import { createPerspectiveCamera } from './camera'

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
 * Initializes the app by creating a Three.js scene, adding an axes helper, and setting up a WebGL renderer.
 * @returns {{scene: Three.Scene, renderer: Three.WebGLRenderer start: Function}} An object containing the scene and a start function to begin rendering the scene.
*/

export function initializeApp () {

  // If WebGL is not available the code stops here.
  assertWebGLAvailable()

  const scene = new Three.Scene()
  scene.add(new Three.AxesHelper(500))

  // Create a camera and position it.
  const mainCamera = createPerspectiveCamera(window.innerWidth / window.innerHeight, 300)
  const renderer = new Three.WebGLRenderer({ antialias: true })

  // Set it full-screen.
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.autoClear = false
  
  document.body.appendChild(renderer.domElement)
  return { 
    
    scene, 
    renderer,
    mainCamera,

    start: (onUpdate) => renderer.setAnimationLoop(() => {

      renderer.clear()
      onUpdate?.()

      renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.render(scene, mainCamera)
    }),
  }
}

