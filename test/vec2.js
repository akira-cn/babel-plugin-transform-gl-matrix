const test = require('ava');
const glMatrix = require('gl-matrix');
const {vec2, mat2} = glMatrix;

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
});

test('+=, -=, *=', (t) => {
  let v1 = vec2(1, 1);
  const v2 = v1;

  v1 += vec2(1, 1);

  t.is(v1, v2);
  t.deepEqual(v1, vec2(2, 2));
});