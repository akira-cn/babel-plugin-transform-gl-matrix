const test = require('ava');
const glMatrix = require('gl-matrix');
const {vec2, mat2, mat2d, mat3, mat4} = glMatrix;

test('create', (t) => {
  const v1 = vec2(1.0, 1.0),
    v2 = vec2.fromValues(1.0, 1.0);

  t.deepEqual(v1, v2);
});

test('eq', (t) => {
  const v1 = vec2(1, 0);
  const v2 = vec2(0, 1);

  t.is(v1, vec2(v1));
  t.is(v2, vec2(v2));
});

test('add1', (t) => {
  const v1 = vec2(1.0, 1.0);

  t.deepEqual(vec2(v1) + 1, vec2(2.0, 2.0));
});

test('add2', (t) => {
  const v = vec2(1, 0) + vec2(0, 1) + 1;

  t.deepEqual(v, vec2(2, 2));
});

test('sub1', (t) => {
  const v = vec2(1, 0) - vec2(0, 1) + vec2(1, 1);

  t.deepEqual(v, vec2(2, 0));
});

test('sub2', (t) => {
  const v = vec2(1, 0) - (vec2(0, 1) + vec2(1, 1));

  t.deepEqual(v, vec2(0, -2));
});

test('cross', (t) => {
  const v1 = vec2(1, 2);
  const v2 = vec2(3, 4);

  const v = vec2(v1) * vec2(v2);

  t.deepEqual(v, vec2.cross(v1, v2));
});

test('scale', (t) => {
  const v1 = 2 * vec2(1, 1);

  t.deepEqual(v1, vec2(2, 2));

  const v2 = -vec2(1, 1);

  t.deepEqual(v2, vec2(-1, -1));

  const v3 = vec2(1, 2) * 0.5;

  t.deepEqual(v3, vec2(0.5, 1));
});

test('transform', (t) => {
  const v1 = vec2(1, 1);
  const m1 = mat2(1, 0, 0, 1);
  t.deepEqual(v1, vec2(v1) * mat2(m1));

  const m2 = mat2(2, 0, 0, 2);
  t.deepEqual(vec2(v1) * 2, vec2(v1) * mat2(m2));

  const m3 = mat2d(1, 0, 0, 1, 0, 0);
  t.deepEqual(v1, vec2(v1) * mat2d(m3));

  const m4 = mat2d(2, 0, 0, 2, 0, 0);
  t.deepEqual(vec2(v1) * 2, vec2(v1) * mat2d(m4));

  const m5 = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  t.deepEqual(v1, vec2(v1) * mat3(m5));

  const m6 = mat3(1, 2, 3, 4, 5, 6);
  t.deepEqual(vec2(v1) * mat3(m6), vec2.transformMat3(vec2.create(), v1, m6));

  const m7 = mat4(1, 2, 3, 4, 5, 6, 7, 8);
  t.deepEqual(vec2(v1) * mat4(m7), vec2.transformMat4(vec2.create(), v1, m7));
});

test('+=, -=, *=', (t) => {
  let v1 = vec2(1, 1);
  const v2 = v1;

  v1 += vec2(1, 1);

  t.is(v1, v2);
  t.deepEqual(v1, vec2(2, 2));

  let v3 = vec2(3, 4);
  const v4 = v3;

  v3 *= vec2(2, 2);

  t.is(v3, v4);
  t.deepEqual(v3, vec2.cross(vec2.create(), vec2.fromValues(3, 4), vec2.fromValues(2, 2)));
});