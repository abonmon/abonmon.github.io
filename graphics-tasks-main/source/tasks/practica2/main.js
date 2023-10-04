import { initializeApp } from '../../lib/setup'
import setup from './setup'

// Initialize the app scene and renderer.
const { scene, mainCamera, start } = initializeApp()

// Set the camera position.
mainCamera.position.set(150, 250, 150)
const updateP2 = setup(scene)

// Start the application.
start(updateP2)