/*
dibuja puntosVB0.js
Programa que dibuja puntos que el usuario va marcando
*/

//SHADER VERTICES
const VSHADER_SOURCE = `
attribute vec3 posicion;
void main(){
    gl_Position = vec4(posicion,1.0);
    gl_PointSize = 10.0;
}
`;

const FSHADER_SOURCE = `
uniform higph vec3 color;
void main(){
    gl_FragColor = vec4(color,1.0)
}`;

const clicks = [];
let colorFragmento = [1.0,0.0,0.0];

