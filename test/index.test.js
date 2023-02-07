import {
  vec2,
  vec3,
  mat2,
  mat2d,
  mat3,
  mat4,
  quat,
  quat2,
  glMatrix,
} from 'gl-matrix';

glMatrix.setMatrixArrayType(Array);

test('mat2d expand', () => {
  const arr = [1, 2, 3, 4, 5, 6];
  const m1 = mat2d(...arr);
  const m2 = mat2d.fromValues(...arr);
  expect(m1).toEqual(m2);
});

test('create vec2', () => {
  const v1 = vec2(1.0, 1.0);
  const v2 = vec2.fromValues(1.0, 1.0);

  expect(v1).toEqual(v2);
});

test('create vec3', () => {
  const v1 = vec3(1.0, 1.0, 1.0);
  const v2 = vec3.fromValues(1.0, 1.0, 1.0);

  expect(v1).toEqual(v2);

  const v3 = vec2(1.0, 1.0);
  const v4 = vec3(vec2(v3), 1.0);

  expect(v1).toEqual(v4);
});

test('create mat3', () => {
  const m1 = 2 * mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  const m2 = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1) * 2;

  expect(m1).toEqual(mat3(2, 0, 0, 0, 2, 0, 0, 0, 2));
  expect(m1).toEqual(m2);
});

test('eq', () => {
  const v1 = vec2(1, 0);
  const v2 = vec2(0, 1);

  expect(v1).toBe(vec2(v1));
  expect(v2).toBe(vec2(v2));
});

test('equals', () => {
  const v1 = vec2(1, 0);
  const v2 = vec2(1, 0);

  expect(vec2(v1) == vec2(v2)).toBe(true); // eslint-disable-line eqeqeq
  expect(vec2(v1) == vec2(1, 0)).toBe(true); // eslint-disable-line eqeqeq
  expect(vec2(1, 0) == vec2(v2)).toBe(true); // eslint-disable-line eqeqeq
  expect([1, 0] == vec2(v2)).toBe(true); // eslint-disable-line eqeqeq
  expect(vec2(v1) == [1, 0]).toBe(true); // eslint-disable-line eqeqeq
  expect(vec2.equals(v1, v2)).toBe(true);
});

test('not equals', () => {
  const v1 = vec2(1, 0);
  const v2 = vec2(1, 0);

  expect(vec2(v1) != vec2(v2)).toBe(false); // eslint-disable-line eqeqeq
  expect(vec2(v1) != [2, 0]).toBe(true); // eslint-disable-line eqeqeq
  expect([2, 0] != vec2(v2)).toBe(true); // eslint-disable-line eqeqeq
  expect(vec2(v1) != vec2(2, 0)).toBe(true); // eslint-disable-line eqeqeq
  expect(vec2(2, 0) != vec2(v2)).toBe(true); // eslint-disable-line eqeqeq
});

test('eq ne 2', () => {
  const v1 = vec3.fromValues(1, 2, 3);
  const v2 = vec3.fromValues(1, 2, 3);
  const v3 = vec3.fromValues(1, 1, 1);

  expect([vec3(v1) == v2, vec3(v1) != v3]).toEqual([true, true]); // eslint-disable-line eqeqeq
});

test('add1', () => {
  const v1 = vec2(1.0, 1.0);

  expect(vec2(v1) + 1).toEqual(vec2(2.0, 2.0));
  expect(vec2(v1) + [1, 1]).toEqual(vec2(2.0, 2.0));
});

test('add2', () => {
  const v = vec2(1, 0) + vec2(0, 1) + 1;

  expect(v).toEqual(vec2(2, 2));
});

test('sub1', () => {
  const v = vec2(1, 0) - vec2(0, 1) + vec2(1, 1);

  expect(v).toEqual(vec2(2, 0));
});

test('sub2', () => {
  const v = vec2(1, 0) - (vec2(0, 1) + vec2(1, 1));

  expect(v).toEqual(vec2(0, -2));
});

test('sub3', () => {
  const v = vec2(1, 0);

  expect(1 - vec2(v)).toEqual(vec2(0, 1));
});

test('vec multiply', () => {
  const v1 = vec2(1, 2);
  const v2 = vec2(3, 4);

  const v = vec2(v1) * vec2(v2);

  expect(v).toEqual(vec2.multiply(v1, v2));

  expect(v).toEqual(vec2(3, 8));

  expect(vec2(v1) * vec2(v2) + 1).toEqual(vec2(4, 9));
});

test('vec cross', () => {
  const v1 = vec2(1, 2);
  const v2 = vec2(3, 4);

  const v = vec2.cross(v1, v2);

  expect(v).toEqual(vec3(0, 0, -2));
});

test('dot', () => {
  const v1 = vec2(1, 2);
  const v2 = vec2(3, 4);

  expect(vec2.dot(v1, v2)).toBe(11);

  expect(vec2.dot(v1, v2) + 1).toBe(12);
});

test('multiply', () => {
  const m1 = mat2d(1, 0, 0, 1, 0, 0);
  const m2 = mat2d(1, 2, 3, 4, 5, 6);

  expect(mat2d(m1) * mat2d(m2)).toEqual(mat2d.multiply(m1, m2));

  const q1 = quat(1, 2, 3, 4);
  const q2 = quat(5, 6, 7, 8);

  expect(quat(q1) * quat(q2)).toEqual(quat.multiply(q1, q2));

  const q3 = quat2(1, 2, 3, 4, 5, 6, 7, 8);
  const q4 = quat2(1, 0, 3, 5, 9, 8, 6, 4);

  expect(quat2(q3) * quat2(q4)).toEqual(quat2.multiply(q3, q4));
});

test('scale', () => {
  const v1 = 2 * vec2(1, 1);

  expect(v1).toEqual(vec2(2, 2));

  const v2 = -vec2(1, 1);

  expect(v2).toEqual(vec2(-1, -1));

  const v3 = vec2(1, 2) * 0.5;

  expect(v3).toEqual(vec2(0.5, 1));
});

test('transform', () => {
  const v1 = vec2(1, 1);
  const m1 = mat2(1, 0, 0, 1);
  expect(v1).toEqual(mat2(m1) * vec2(v1));

  const m2 = mat2(2, 0, 0, 2);
  expect(vec2(v1) * 2).toEqual(mat2(m2) * vec2(v1));

  const m3 = mat2d(1, 0, 0, 1, 0, 0);
  expect(v1).toEqual(mat2d(m3) * vec2(v1));

  const m4 = mat2d(2, 0, 0, 2, 0, 0);
  expect(vec2(v1) * 2).toEqual(mat2d(m4) * vec2(v1));

  const m5 = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  expect(v1).toEqual(mat3(m5) * vec2(v1));

  const m6 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  expect(mat3(m6) * vec2(v1)).toEqual(vec2.transformMat3(v1, m6));

  const m7 = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  expect(mat4(m7) * vec2(v1)).toEqual(vec2.transformMat4(v1, m7));

  expect(mat4(m7) * [1, 1, 1]).toEqual(vec3.transformMat4(vec3(...v1, 1), m7));

  expect(vec2(v1) * mat4(m7)).toEqual(
    vec2.transformMat4(v1, mat4.transpose(m7)),
  );
});

test('+=, -=, *=', () => {
  let v1 = vec2(1, 1);
  const v2 = v1;

  v1 += vec2(1, 1);

  expect(v1).toBe(v2);
  expect(v1).toEqual(vec2(2, 2));

  let v3 = vec2(3, 4);
  const v4 = v3;

  v3 *= vec2(2, 2);

  expect(v3).toBe(v4);
  expect(v3).toEqual(vec2.multiply(vec2.fromValues(3, 4), vec2.fromValues(2, 2)));
});

test('scope', () => {
  const mat2d = {
    add(a, b) {
      return a + b;
    },
  };
  expect(mat2d.add(1, 2)).toBe(3);
});
