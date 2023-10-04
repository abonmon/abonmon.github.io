import * as Three from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'

import { ORIGIN } from '../../lib/scene'
import { createTopCamera } from '../../lib/camera'

/**
 * Creates and returns an instance of OrbitControls for the given renderer and camera.
 * @param {THREE.WebGLRenderer} renderer - The renderer to use for rendering the scene.
 * @param {THREE.PerspectiveCamera} camera - The camera to use for viewing the scene.
 * @returns {THREE.OrbitControls} The instance of OrbitControls.
*/

export function getOrbitControls (renderer, camera) {

  const controls = new OrbitControls(camera, renderer.domElement)
  
  controls.target = ORIGIN
  controls.enableDamping = true
  controls.zoomToCursor = true

  // Limit the vertical orbiting angle and the zoom.
  controls.maxPolarAngle = Three.MathUtils.degToRad(85)
  controls.maxDistance = camera.far / 2
  controls.minDistance = camera.near * 20

  controls.update()
  return controls
}

/**
 * Returns a resize handler function that updates the camera aspect ratio and renderer size based on the window dimensions.
 * @param {THREE.WebGLRenderer} renderer - The WebGL renderer instance.
 * @param {THREE.PerspectiveCamera} camera - The perspective camera instance.
 * @returns {Function} The resize handler function.
*/

export function getResizeHandler (renderer, camera) {

  return () => {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
   
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

/**
 * Creates a function that renders a top-down view of the scene using the given renderer and camera settings.
 * @param {THREE.WebGLRenderer} renderer - The renderer to use for rendering the scene.
 * @param {number} [cameraSize = 85] - The size of the camera.
 * @param {number} [near = -300] - The near clipping plane of the camera.
 * @param {number} [far = 300] - The far clipping plane of the camera.
 * @returns {Function} A function that renders a top-down view of the scene.
*/

export function createTopDownRenderView (renderer, height = 200, cameraSize = 120, near = -300, far = 300) {

  // Create the top camera.
  const topCamera = createTopCamera(cameraSize, height, near, far)

  // Adjust the view.
  topCamera.position.set(10, 0, 0)
  topCamera.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), Three.MathUtils.degToRad(-90))

  return (scene) => {

    const size = new Three.Vector3()
    renderer.getSize(size)

    // Calculate the size of the camera viewport.
    const viewSize = Math.min(size.x, size.y) / 4;
    renderer.setViewport(0, window.innerHeight - viewSize, viewSize, viewSize);

    // Render the scene with the top camera.
    renderer.render(scene, topCamera);
  }
}

export default function setup (scene, renderer, mainCamera) {

  const resizeHandler = getResizeHandler(renderer, mainCamera)
  window.addEventListener('resize', resizeHandler)

  // P3: Create the orbit controls and the ortographic camera.
  const orbitControls = getOrbitControls(renderer, mainCamera)
  const renderTopView = createTopDownRenderView(renderer)

  return () => {

    renderTopView(scene)
    orbitControls.update()
  }
}