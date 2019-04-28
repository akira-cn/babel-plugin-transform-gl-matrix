import {vec2, vec3, mat2, mat2d, mat3, mat4, quat, quat2} from 'gl-matrix';
const test = require('ava');

test('mat2d expand', (t) => {
  const arr = [1, 2, 3, 4, 5, 6];
  const m1 = mat2d(...arr);
  const m2 = mat2d.fromValues(...arr);

  t.deepEqual(m1, m2);
});

test('create vec2', (t) => {
  const v1 = vec2(1.0, 1.0),
    v2 = vec2.fromValues(1.0, 1.0);

  t.deepEqual(v1, v2);
});

test('create vec3', (t) => {
  const v1 = vec3(1.0, 1.0, 1.0),
    v2 = vec3.fromValues(1.0, 1.0, 1.0);

  t.deepEqual(v1, v2);

  const v3 = vec2(1.0, 1.0),
    v4 = vec3(vec2(v3), 1.0);

  t.deepEqual(v1, v4);
});

test('create mat3', (t) => {
  const m1 = 2 * mat3(1, 0, 0, 0, 1, 0, 0, 0, 1),
    m2 = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1) * 2;

  t.deepEqual(m1, mat3(2, 0, 0, 0, 2, 0, 0, 0, 1));
  t.deepEqual(m1, m2);
});

test('eq', (t) => {
  const v1 = vec2(1, 0);
  const v2 = vec2(0, 1);

  t.is(v1, vec2(v1));
  t.is(v2, vec2(v2));
});

test('equals', (t) => {
  const v1 = vec2(1, 0);
  const v2 = vec2(1, 0);

  t.truthy(vec2(v1) == vec2(v2)); // eslint-disable-line eqeqeq
  t.truthy(vec2(v1) == vec2(1, 0)); // eslint-disable-line eqeqeq
  t.truthy(vec2(1, 0) == vec2(v2)); // eslint-disable-line eqeqeq
  t.truthy([1, 0] == vec2(v2)); // eslint-disable-line eqeqeq
  t.truthy(vec2(v1) == [1, 0]); // eslint-disable-line eqeqeq
  t.truthy(vec2.equals(v1, v2));
});

test('not equals', (t) => {
  const v1 = vec2(1, 0);
  const v2 = vec2(1, 0);

  t.falsy(vec2(v1) != vec2(v2)); // eslint-disable-line eqeqeq
  t.truthy(vec2(v1) != [2, 0]); // eslint-disable-line eqeqeq
  t.truthy([2, 0] != vec2(v2)); // eslint-disable-line eqeqeq
  t.truthy(vec2(v1) != vec2(2, 0)); // eslint-disable-line eqeqeq
  t.truthy(vec2(2, 0) != vec2(v2)); // eslint-disable-line eqeqeq
});

test('eq ne 2', (t) => {
  const v1 = vec3.fromValues(1, 2, 3);
  const v2 = vec3.fromValues(1, 2, 3);
  const v3 = vec3.fromValues(1, 1, 1);

  t.deepEqual([vec3(v1) == v2, vec3(v1) != v3], [true, true]); // eslint-disable-line eqeqeq
});

test('add1', (t) => {
  const v1 = vec2(1.0, 1.0);

  t.deepEqual(vec2(v1) + 1, vec2(2.0, 2.0));
  t.deepEqual(vec2(v1) + [1, 1], vec2(2.0, 2.0));
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

test('sub3', (t) => {
  const v = vec2(1, 0);

  t.deepEqual(1 - vec2(v), vec2(0, 1));
});

test('cross', (t) => {
  const v1 = vec2(1, 2);
  const v2 = vec2(3, 4);

  const v = vec2(v1) * vec2(v2);

  t.deepEqual(v, vec2.cross(v1, v2));

  t.deepEqual(v, vec3(0, 0, -2));

  t.deepEqual(vec2(v1) * vec2(v2) + 1, vec3(1, 1, -1));
});

test('dot', (t) => {
  const v1 = vec2(1, 2);
  const v2 = vec2(3, 4);

  t.is(vec2.dot(v1, v2), 11);

  t.is(vec2.dot(v1, v2) + 1, 12);
});

test('multiply', (t) => {
  const m1 = mat2d(1, 0, 0, 1, 0, 0);
  const m2 = mat2d(1, 2, 3, 4, 5, 6);

  t.deepEqual(mat2d(m1) * mat2d(m2), mat2d.multiply(mat2d.create(), m1, m2));

  const q1 = quat(1, 2, 3, 4);
  const q2 = quat(5, 6, 7, 8);

  t.deepEqual(quat(q1) * quat(q2), quat.multiply(quat.create(), q1, q2));

  const q3 = quat2(1, 2, 3, 4, 5, 6, 7, 8);
  const q4 = quat2(1, 0, 3, 5, 9, 8, 6, 4);

  t.deepEqual(quat2(q3) * quat2(q4), quat2.multiply(quat2.create(), q3, q4));
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
  t.deepEqual(v1, mat2(m1) * vec2(v1));

  const m2 = mat2(2, 0, 0, 2);
  t.deepEqual(vec2(v1) * 2, mat2(m2) * vec2(v1));

  const m3 = mat2d(1, 0, 0, 1, 0, 0);
  t.deepEqual(v1, mat2d(m3) * vec2(v1));

  const m4 = mat2d(2, 0, 0, 2, 0, 0);
  t.deepEqual(vec2(v1) * 2, mat2d(m4) * vec2(v1));

  const m5 = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  t.deepEqual(v1, mat3(m5) * vec2(v1));

  const m6 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  t.deepEqual(mat3(m6) * vec2(v1), vec2.transformMat3(vec2.create(), v1, m6));

  const m7 = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  t.deepEqual(mat4(m7) * vec2(v1), vec2.transformMat4(vec2.create(), v1, m7));

  t.deepEqual(mat4(m7) * [1, 1, 1], vec3.transformMat4(vec3.create(), vec3(...v1, 1), m7));

  t.deepEqual(vec2(v1) * mat4(m7), vec2.transformMat4(vec2.create(), v1, mat4.transpose(mat4.create(), m7)));
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