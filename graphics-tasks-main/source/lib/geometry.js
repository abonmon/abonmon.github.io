import * as Three from 'three'

/**
 * Creates a Three.js BufferGeometry object representing the finger of the robot claw.
 *
 * @param {number} width - The width of the claw finger.
 * @param {number} height - The height of the claw finger.
 * @param {number} depth - The depth of the claw finger.
 * @returns {Three.BufferGeometry} The geometry representing the claw finger.
*/

export function clawFinger (widthBottom, widthTop, height, depth) {

  // Precalculate half values.
  const halfWidthB = widthBottom / 2
  const halfWidthT = widthTop / 2
  const halfHeight = height / 2
  const halfDepth = depth / 2

  // Create a vertex array which is like a cube, but it allows to have none square faces and a given height.
  const vertices = new Float32Array([

    // Bottom Face
    -halfWidthB, -halfHeight, -halfDepth,
     halfWidthB, -halfHeight, -halfDepth,
     halfWidthB, -halfHeight,  halfDepth,
    -halfWidthB, -halfHeight,  halfDepth,

    // Top Face 
    -halfWidthT, halfHeight, 0,
     halfWidthT, halfHeight, 0,
     halfWidthT, halfHeight, halfDepth,
    -halfWidthT, halfHeight, halfDepth,

    // Back Face
    -halfWidthB, -halfHeight, -halfDepth,
     halfWidthB, -halfHeight, -halfDepth,
     halfWidthT,  halfHeight, 0,
    -halfWidthT,  halfHeight, 0,

    // Front Face
    -halfWidthB, -halfHeight, halfDepth,
     halfWidthB, -halfHeight, halfDepth,
     halfWidthT,  halfHeight, halfDepth,
    -halfWidthT,  halfHeight, halfDepth,

    // Left Face
    -halfWidthB, -halfHeight, -halfDepth,
    -halfWidthB, -halfHeight,  halfDepth,
    -halfWidthT,  halfHeight,  halfDepth,
    -halfWidthT,  halfHeight,  0,

    // Right Face
    halfWidthB, -halfHeight, -halfDepth,
    halfWidthB, -halfHeight,  halfDepth,
    halfWidthT,  halfHeight,  halfDepth,
    halfWidthT,  halfHeight,  0
  ])

  // Index array defining faces via triangles
  const indices = new Uint16Array([

    // Bottom Face
    0, 1, 2,
    0, 2, 3,

    // Top Face
    4, 6, 5,
    4, 7, 6,

    // Back Face
    8, 10, 9,
    8, 11, 10,

    // Front Face
    12, 13, 14,
    12, 14, 15,

    // Left Face
    16, 17, 18,
    16, 18, 19,

    // Right Face
    20, 22, 21,
    20, 23, 22
  ])

  const geometry = new Three.BufferGeometry()

  // Assign the vertices and the indices and calculate the normals.
  geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3))
  geometry.setIndex(new Three.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()

  return geometry
}