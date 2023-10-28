import { GUI, NumberController, BooleanController, FunctionController } from 'lil-gui'

/** The graphical user interface options. */
export const globalGUI = new GUI()

/**
 * Creates a boolean option in the GUI.
 *
 * @param {string} name - The name of the option.
 * @param {number} value - The initial value of the option.
 * @param {Array<number>} range - The range of the option represented as an array of three numbers: [min, max, step].
 * @param {Function} onChange - The function to be called when the option value changes.
 * @returns {NumberController} - The GUI element created using lil-gui library.
*/

export function numberOption (name, value, range, onChange) {

  const [min, max, step] = range
  return globalGUI.add({ value }, 'value')
    .name(name)
    .min(min)
    .max(max)
    .step(step)
    .onChange(onChange)
}

/**
 * Creates a boolean option in the GUI.
 *
 * @param {string} name - The name of the option.
 * @param {boolean} value - The initial value of the option.
 * @param {Function} onChange - The function to be called when the option value changes.
 * @returns {BooleanController} - The created boolean option object.
*/

export function booleanOption (name, value, onChange) {

  return globalGUI.add({ value }, 'value')
    .name(name)
    .onChange(onChange)
}

/**
 * Creates a button element with the given name and onClick function.
 * @param {string} name - The name of the button.
 * @param {Function} onClick - The function to be called when the button is clicked.
 * @returns {FunctionController} - The button element.
*/

export function buttonElement (name, onClick) {

  return globalGUI.add({ onClick }, 'onClick')
    .name(name)
}