/** The keys pressed by the user. */
export const keys = {

  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
}

/** Sets up the key listeners. */
export function setupKeys () {

  // Register the keydown events.
  document.addEventListener('keydown', (event) => {

    const { key } = event

    if (key in keys) {

      keys[key] = true
    }
  })

  // Register the keyup events.
  document.addEventListener('keyup', (event) => {

    const { key } = event

    if (key in keys) {

      keys[key] = false
    }
  })
}