import { initializeApp } from '../../lib/setup'

import setupP2 from '../practica2/setup'
import setupP3 from './setup'

// Initialize the app scene and renderer.
const { scene, renderer, mainCamera, start } = initializeApp()

// Reuse the code from the previous practice.
const updateP2 = setupP2(scene)
const updateP3 = setupP3(scene, renderer, mainCamera)

// Start the application.
start((delta, elapsed) => {

  updateP2(delta, elapsed)
  updateP3(delta, elapsed)
})
