import * as Three from 'three'

import { clawFinger } from '../../lib/geometry'
import { make } from '../../lib/scene'

/** The geometries for the robot arm. */
export const GEOMETRIES = {

  FLOOR: new Three.PlaneGeometry(1000, 1000, 10, 10), // Suelo
  BASE: new Three.CylinderGeometry(50, 50, 15), // Base
  
  // Brazo
  ARM: {

    SHAFT: new Three.CylinderGeometry(20, 20, 18), // Eje
    STUD: new Three.BoxGeometry(18, 120, 12), // Espárrago
    JOINT: new Three.SphereGeometry(20, 32, 32), // Rótula
  },

  // Antebrazo
  FOREARM: {

    DISK: new Three.CylinderGeometry(22, 22, 6), // Disco
    BONE: new Three.BoxGeometry(4, 80, 4), // Hueso ("Nervio") [x4]
    HAND: new Three.CylinderGeometry(15, 15, 40), // Mano
  },

  // Pinza
  CLAW: {

    WRIST: new Three.BoxGeometry(20, 19, 4), // Muñeca
    FINGER: clawFinger(19, 10, 20, 4), // Dedo [x2]
  }
}

/** Builds the robot arm. */
export function buildRobot () {

  const { FLOOR, BASE, ARM, FOREARM, CLAW } = GEOMETRIES
  return [

    // Instantiate the base of the robot.
    make(FLOOR, { rotation: { x: -90 } }),
    make(BASE),

    // Instantiate the arm.
    make(ARM.SHAFT, { position: { y: 9 }, rotation: { x: 90 } }),
    make(ARM.STUD,  { position: { y: 69 } }),
    make(ARM.JOINT, { position: { y: 129 } }),

    // Instantiate the forearm.
    make(FOREARM.DISK, { position: { y: 129 } }),
    make(FOREARM.BONE, { position: { x: -8, y: 172, z: -8 } }),
    make(FOREARM.BONE, { position: { x:  8, y: 172, z: -8 } }),
    make(FOREARM.BONE, { position: { x:  8, y: 172, z:  8 } }),
    make(FOREARM.BONE, { position: { x: -8, y: 172, z:  8 } }),
    make(FOREARM.HAND, { position: { y: 212 }, rotation: { x: 90 } }),

    // Instantiate the claw.
    make(CLAW.WRIST,  { position: { x: 20, y: 212, z:  12 } }),
    make(CLAW.WRIST,  { position: { x: 20, y: 212, z: -12 } }),
    make(CLAW.FINGER, { position: { x: 40, y: 212, z:  12 }, rotation: { x: 180, z: -90 } }),
    make(CLAW.FINGER, { position: { x: 40, y: 212, z: -12 }, rotation: { x: 180, z: -90 }, scale: { z: -1 } })
  ]
}

export default function setup (scene) {

  const parts = buildRobot()
  parts.forEach(part => scene.add(part))

  return () => { }
}