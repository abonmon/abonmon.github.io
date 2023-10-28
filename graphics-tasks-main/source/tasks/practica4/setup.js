import * as Three from 'three'
import * as Tween from '@tweenjs/tween.js'

import { keys } from '../../lib/keyboard'
import { robot, parts } from '../practica2/setup'
import { normalMaterial } from '../../lib/materials'
import { booleanOption, buttonElement, numberOption } from '../../lib/gui'

/** The movement speed. */
const speed = 100
const easeFunc = Tween.Easing.Quadratic.InOut

/** Moves the robot when the arrow keys are pressed. */
function moveRobot (delta) {

  const movementDelta = speed * delta

  if (keys.ArrowUp) { robot.position.z += movementDelta }
  if (keys.ArrowDown) { robot.position.z -= movementDelta }
  if (keys.ArrowLeft) { robot.position.x -= movementDelta }
  if (keys.ArrowRight) { robot.position.x += movementDelta }
}

/** Binds a parameter to its option. */
function bindParameter (tween, parameter) {

  const tweens = [tween, ...tween._chainedTweens]
  tweens.forEach(tween => tween.onUpdate(({ value }) => {

    parameter.setValue(value)
  }))
}

const baseRotation = numberOption('Giro Base', 0, [-180, 180, 1], (value) => {
  
  robot.rotation.y = Three.MathUtils.degToRad(value)
})

const armRotation = numberOption('Giro Brazo', 0, [-45, 45, 1], (value) => {

  parts.shaft.rotation.y = Three.MathUtils.degToRad(value)
})

const forearmRotationY = numberOption('Giro Antebrazo Y', 0, [-180, 180, 1], (value) => {

  parts.disk.rotation.y = Three.MathUtils.degToRad(value)
})

const forearmRotationZ = numberOption('Giro Antebrazo Z', 0, [-90, 90, 1], (value) => {

  parts.disk.rotation.z = Three.MathUtils.degToRad(value)
})

const handRotation = numberOption('Giro Pinza', 0, [-40, 220, 1], (value) => {

  parts.hand.rotation.y = Three.MathUtils.degToRad(value)
})

const clawDistance = numberOption('Separación Pinza', 12, [0, 15, 1], (value) => {

  parts.leftWrist.position.y = -value
  parts.rightWrist.position.y = value
})

export default function setup () {

  const animation = [

    // Phase: Pick.
    [new Tween.Tween({ value: 0 }).to({ value: -40 }, 1500).easing(easeFunc), armRotation],
    [new Tween.Tween({ value: 0 }).to({ value: -60 }, 1000).easing(easeFunc), forearmRotationZ],
    [new Tween.Tween({ value: 0 }).to({ value: -40 }, 2000).easing(easeFunc), baseRotation],
    [new Tween.Tween({ value: 12 }).to({ value: 6 }, 500).easing(easeFunc), clawDistance],
    [new Tween.Tween({ value: 0 }).to({ value: 90 }, 1000).easing(easeFunc), handRotation],
  
    // Phase: Drop.
    [new Tween.Tween({ value: -40 }).to({ value: 0 }, 2000).easing(easeFunc), baseRotation],
    [new Tween.Tween({ value: 90 }).to({ value: 0 }, 1000).easing(easeFunc), handRotation],
    [new Tween.Tween({ value: 6 }).to({ value: 12 }, 500).easing(easeFunc), clawDistance],
    [new Tween.Tween({ value: -60 }).to({ value: 0 }, 1000).easing(easeFunc), forearmRotationZ],
    [new Tween.Tween({ value: -40 }).to({ value: 0 }, 1500).easing(easeFunc), armRotation],
  ]
  
  /** Are we currently animating? */
  let animating = false
  let maxDuration = 0

  for (let i = 0; i < animation.length; i++) {

    const [tween, parameter] = animation[i]
    const next = animation[i + 1]

    // If there is a next tween, chain it.
    if (next) { tween.chain(next[0]) }

    bindParameter(tween, parameter)
    maxDuration += tween._duration
  }


  // Whether to enable or disable wireframe mode.
  booleanOption('Alambres', false, (value) => {

    normalMaterial.wireframe = value
  })

  // Play the animation.
  const animateButton = buttonElement('Animar', () => { 
    
    // If we aren't already animating.
    if (!(animating)) {

      animating = true

      const firstTween = animation[0][0]
      firstTween.start()

      animateButton.$button.innerText = 'Animación en Curso'
      animateButton.$button.style.backgroundColor = 'rgba(255, 0, 0, 0.4)'
      
      // Timeout the total duration.
      setTimeout(() => { 
        
        animating = false 
        animateButton.$button.innerText = 'Animar'
        animateButton.$button.style.backgroundColor = ''

      }, maxDuration)
    }
  })

  return (delta, elapsed) => {

    moveRobot(delta)
  }
}