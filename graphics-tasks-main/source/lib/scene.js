import * as Three from 'three'

/** The coordinate origin of any scene. */
export const ORIGIN = new Three.Vector3(0, 0, 0)

/**
 * Creates a transform object with position, rotation, and scale properties.
 *
 * @param {Object} options - The options object.
 * @param {Object} [options.position = {}] - The position object with x, y, and z properties.
 * @param {Object} [options.rotation = {}] - The rotation object with x, y, and z properties in degrees.
 * @param {Object} [options.scale = {}] - The scale object with x, y, and z properties.
 * @returns {Object} The transform object with position, rotation, and scale properties.
*/

function createTransform ({ position = { }, rotation = { }, scale = { } }) {

  const { x = 0, y = 0, z = 0 } = rotation
  const degToRad = Three.MathUtils.degToRad

  return {

    position: new Three.Euler(position.x ?? 0, position.y ?? 0, position.z ?? 0),
    scale: new Three.Euler(scale.x ?? 1, scale.y ?? 1, scale.z ?? 1),

    rotation: new Three.Euler(degToRad(x), degToRad(y), degToRad(z)),
  }
}

/**
 * Creates a new Three.js mesh with the given geometry and transform.
 *
 * @param {THREE.Geometry} geometry - The geometry to use for the mesh.
 * @param {object} transform - The transform to apply to the mesh.
 * @param {THREE.Vector3} transform.position - The position of the mesh.
 * @param {THREE.Euler} transform.rotation - The rotation of the mesh.
 * @param {THREE.Vector3} transform.scale - The scale of the mesh.
 * @returns {THREE.Mesh} The new mesh.
*/

export function createMesh (geometry, transform) { 

  const material = new Three.MeshNormalMaterial()
  const mesh = new Three.Mesh(geometry, material)

  // Set the initial transform.
  mesh.position.setFromEuler(transform.position)
  mesh.setRotationFromEuler(transform.rotation)
  mesh.scale.setFromEuler(transform.scale)

  return mesh
}

/**
 * Creates a mesh object with the given geometry and initial transform.
 * @param {Object} geometry - The geometry object to use for the mesh.
 * @param {Object} [initialTransform={}] - The initial transform object to apply to the mesh.
 * @param {Object} [initialTransform.position={}] - The initial position of the mesh.
 * @param {Object} [initialTransform.rotation={}] - The initial rotation of the mesh.
 * @param {Object} [initialTransform.scale={}] - The initial scale of the mesh.
 * @returns {Object} The created mesh object.
*/

export function make (geometry, initialTransform = { }) {

  const { position = { }, rotation = { }, scale = { } } = initialTransform
  const transform = createTransform({ position, rotation, scale })

  return createMesh(geometry, transform)
}