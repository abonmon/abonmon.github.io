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
  return {

    floor: make(FLOOR, { rotation: { x: -90 } }),
    base:  make(BASE),

    shaft: make(ARM.SHAFT, { position: { y: 9 }, rotation: { x: 90 } }),
    stud:  make(ARM.STUD,  { position: { y: 69 } }),
    joint: make(ARM.JOINT, { position: { y: 129 } }),

    disk: make(FOREARM.DISK, { position: { y: 129 } }),
    bones: [
    
      make(FOREARM.BONE, { position: { x: -8, y: 172, z: -8 } }),
      make(FOREARM.BONE, { position: { x:  8, y: 172, z: -8 } }),
      make(FOREARM.BONE, { position: { x:  8, y: 172, z:  8 } }),
      make(FOREARM.BONE, { position: { x: -8, y: 172, z:  8 } })    
    ],

    hand: make(FOREARM.HAND, { position: { y: 212 }, rotation: { x: 90 } }),

    rightWrist:  make(CLAW.WRIST,  { position: { x: 20, y: 212, z:  12 } }),
    leftWrist:   make(CLAW.WRIST,  { position: { x: 20, y: 212, z: -12 } }),
    rightFinger: make(CLAW.FINGER, { position: { x: 40, y: 212, z:  12 }, rotation: { x: 180, z: -90 } }),
    leftFinger:  make(CLAW.FINGER, { position: { x: 40, y: 212, z: -12 }, rotation: { x: 180, z: -90 }, scale: { z: -1 } })
  }
}

/** The robot parts. */
export const robot = new Three.Group()
export const parts = buildRobot()

export default function setup (scene) {

  robot.add(parts.base)

  // Attach each part to their corresponding parent.
  parts.base.attach(parts.shaft)
  parts.shaft.attach(parts.stud)
  parts.stud.attach(parts.joint)
  parts.joint.attach(parts.disk)

  // Each bone is attached to the disk (also the hand).
  parts.bones.forEach(bone => parts.disk.attach(bone))
  parts.disk.attach(parts.hand)

  // Attach the claws to the hand.
  parts.hand.attach(parts.rightWrist)
  parts.hand.attach(parts.leftWrist)
  parts.rightWrist.attach(parts.rightFinger)
  parts.leftWrist.attach(parts.leftFinger)

  // Finally, add the entire group to the scene.
  scene.add(robot)
  scene.add(parts.floor)
  
  return (delta) => { }
}