const test = require('ava');
const glMatrix = require('gl-matrix');
const {vec2, vec3} = glMatrix;

test('create', (t) => {
  const v1 = vec3(1.0, 1.0, 1.0),
    v2 = vec3.fromValues(1.0, 1.0, 1.0);

  t.deepEqual(v1, v2);

  const v3 = vec2(1.0, 1.0),
    v4 = vec3(vec2(v3), 1.0);

  t.deepEqual(v1, v4);
});
