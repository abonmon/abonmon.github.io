import * as Three from 'three'
import { ORIGIN } from './scene'


/**
 * Creates a new perspective camera with the given aspect ratio, radius, field of view, near and far planes.
 * @param {number} aspectRatio - The aspect ratio of the camera.
 * @param {number} radius - The distance of the camera from the origin.
 * @param {number} [fov = 75] - The vertical field of view of the camera in degrees.
 * @param {number} [near = 3] - The distance to the near plane of the camera frustum.
 * @param {number} [far = 10000] - The distance to the far plane of the camera frustum.
 * @returns {THREE.PerspectiveCamera} The newly created camera.
*/

export function createPerspectiveCamera (aspectRatio, radius, fov = 75, near = 3, far = 10000) {

  // Create the camera and position it at the given distance.
  const camera = new Three.PerspectiveCamera(fov, aspectRatio, near, far)
  camera.position.set(radius, radius, radius)
  camera.lookAt(ORIGIN)

  return camera
}


/**
 * Creates an orthographic camera positioned on top of the scene and looking down.
 * @param {number} size - The size of the camera's frustum.
 * @param {number} height - The height of the camera above the origin.
 * @param {number} near - The near plane of the camera's frustum.
 * @param {number} far - The far plane of the camera's frustum.
 * @returns {THREE.OrthographicCamera} The created camera.
*/

export function createTopCamera (size, height, near, far) {

  // Place the camera twice the length above the origin.
  const halfSize = size / 2
  const camera = new Three.OrthographicCamera(-halfSize, halfSize, halfSize, -halfSize, near, far)

  // Place the camera on the top of the scene and make it look down.
  camera.position.set(0, height, 0)
  camera.up = new Three.Vector3(0, 0, -1)
  camera.lookAt(ORIGIN)

  return camera
}
