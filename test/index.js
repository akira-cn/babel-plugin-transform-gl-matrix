// const a = vec3(1.0, 0, 0) * mat3(1.0, 0, 2, 1) * 5;
// vec4(vec3(0, 1, 1), 2);

const glMatrix = require('gl-matrix');
const {vec2, mat2} = glMatrix;

const a = vec2(1.0, 2.0);
const b = vec2(1.0, 3.0);
const c = vec2(a) + vec2(b);

console.log(mat2(2, 0, 0, 2) * 2);