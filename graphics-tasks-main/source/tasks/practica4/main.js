import { initializeApp } from '../../lib/setup'

import setupP2 from '../practica2/setup'
import setupP3 from '../practica3/setup'
import setupP4 from './setup'

// Initialize the app scene and renderer.
const { scene, renderer, mainCamera, start } = initializeApp()

const updateP2 = setupP2(scene)
const updateP3 = setupP3(scene, renderer, mainCamera)
const updateP4 = setupP4()

start((delta, elapsed) => {

  updateP2(delta, elapsed)
  updateP3(delta, elapsed)
  updateP4(delta, elapsed)
})