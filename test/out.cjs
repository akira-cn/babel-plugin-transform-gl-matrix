"use strict";

var _glMatrix = require("gl-matrix");
var _ava = _interopRequireDefault(require("ava"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-unresolved

_glMatrix.glMatrix.setMatrixArrayType(Array);
(0, _ava.default)('mat2d expand', t => {
  const arr = [1, 2, 3, 4, 5, 6];
  const m1 = _glMatrix.mat2d.fromValues(...arr);
  const m2 = _glMatrix.mat2d.fromValues(...arr);
  t.deepEqual(m1, m2);
});
(0, _ava.default)('create vec2', t => {
  const v1 = _glMatrix.vec2.fromValues(1.0, 1.0);
  const v2 = _glMatrix.vec2.fromValues(1.0, 1.0);
  t.deepEqual(v1, v2);
});
(0, _ava.default)('create vec3', t => {
  const v1 = _glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
  const v2 = _glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
  t.deepEqual(v1, v2);
  const v3 = _glMatrix.vec2.fromValues(1.0, 1.0);
  const v4 = _glMatrix.vec3.fromValues(...v3, 1.0);
  t.deepEqual(v1, v4);
});
(0, _ava.default)('create mat3', t => {
  const m1 = _glMatrix.mat3.multiplyScalar(_glMatrix.mat3.create(), _glMatrix.mat3.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1), 2);
  const m2 = _glMatrix.mat3.multiplyScalar(_glMatrix.mat3.create(), _glMatrix.mat3.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1), 2);
  t.deepEqual(m1, _glMatrix.mat3.fromValues(2, 0, 0, 0, 2, 0, 0, 0, 2));
  t.deepEqual(m1, m2);
});
(0, _ava.default)('eq', t => {
  const v1 = _glMatrix.vec2.fromValues(1, 0);
  const v2 = _glMatrix.vec2.fromValues(0, 1);
  t.is(v1, v1);
  t.is(v2, v2);
});
(0, _ava.default)('equals', t => {
  const v1 = _glMatrix.vec2.fromValues(1, 0);
  const v2 = _glMatrix.vec2.fromValues(1, 0);
  t.truthy(_glMatrix.vec2.equals(v1, v2)); // eslint-disable-line eqeqeq
  t.truthy(_glMatrix.vec2.equals(v1, _glMatrix.vec2.fromValues(1, 0))); // eslint-disable-line eqeqeq
  t.truthy(_glMatrix.vec2.equals(_glMatrix.vec2.fromValues(1, 0), v2)); // eslint-disable-line eqeqeq
  t.truthy(_glMatrix.vec2.equals([1, 0], v2)); // eslint-disable-line eqeqeq
  t.truthy(_glMatrix.vec2.equals(v1, [1, 0])); // eslint-disable-line eqeqeq
  t.truthy(_glMatrix.vec2.equals(v1, v2));
});
(0, _ava.default)('not equals', t => {
  const v1 = _glMatrix.vec2.fromValues(1, 0);
  const v2 = _glMatrix.vec2.fromValues(1, 0);
  t.falsy(!_glMatrix.vec2.equals(v1, v2)); // eslint-disable-line eqeqeq
  t.truthy(!_glMatrix.vec2.equals(v1, [2, 0])); // eslint-disable-line eqeqeq
  t.truthy(!_glMatrix.vec2.equals([2, 0], v2)); // eslint-disable-line eqeqeq
  t.truthy(!_glMatrix.vec2.equals(v1, _glMatrix.vec2.fromValues(2, 0))); // eslint-disable-line eqeqeq
  t.truthy(!_glMatrix.vec2.equals(_glMatrix.vec2.fromValues(2, 0), v2)); // eslint-disable-line eqeqeq
});

(0, _ava.default)('eq ne 2', t => {
  const v1 = _glMatrix.vec3.fromValues(1, 2, 3);
  const v2 = _glMatrix.vec3.fromValues(1, 2, 3);
  const v3 = _glMatrix.vec3.fromValues(1, 1, 1);
  t.deepEqual([_glMatrix.vec3.equals(v1, v2), !_glMatrix.vec3.equals(v1, v3)], [true, true]); // eslint-disable-line eqeqeq
});

(0, _ava.default)('add1', t => {
  const v1 = _glMatrix.vec2.fromValues(1.0, 1.0);
  t.deepEqual(_glMatrix.vec2.add(_glMatrix.vec2.create(), v1, _glMatrix.vec2.fromValues(1, 1)), _glMatrix.vec2.fromValues(2.0, 2.0));
  t.deepEqual(_glMatrix.vec2.add(_glMatrix.vec2.create(), v1, [1, 1]), _glMatrix.vec2.fromValues(2.0, 2.0));
});
(0, _ava.default)('add2', t => {
  const v = _glMatrix.vec2.add(_glMatrix.vec2.create(), _glMatrix.vec2.add(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(1, 0), _glMatrix.vec2.fromValues(0, 1)), _glMatrix.vec2.fromValues(1, 1));
  t.deepEqual(v, _glMatrix.vec2.fromValues(2, 2));
});
(0, _ava.default)('sub1', t => {
  const v = _glMatrix.vec2.add(_glMatrix.vec2.create(), _glMatrix.vec2.sub(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(1, 0), _glMatrix.vec2.fromValues(0, 1)), _glMatrix.vec2.fromValues(1, 1));
  t.deepEqual(v, _glMatrix.vec2.fromValues(2, 0));
});
(0, _ava.default)('sub2', t => {
  const v = _glMatrix.vec2.sub(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(1, 0), _glMatrix.vec2.add(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(0, 1), _glMatrix.vec2.fromValues(1, 1)));
  t.deepEqual(v, _glMatrix.vec2.fromValues(0, -2));
});
(0, _ava.default)('sub3', t => {
  const v = _glMatrix.vec2.fromValues(1, 0);
  t.deepEqual(_glMatrix.vec2.sub(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(1, 1), v), _glMatrix.vec2.fromValues(0, 1));
});
(0, _ava.default)('vec multiply', t => {
  const v1 = _glMatrix.vec2.fromValues(1, 2);
  const v2 = _glMatrix.vec2.fromValues(3, 4);
  const v = _glMatrix.vec2.multiply(_glMatrix.vec2.create(), v1, v2);
  t.deepEqual(v, _glMatrix.vec2.multiply(_glMatrix.vec2.create(), v1, v2));
  t.deepEqual(v, _glMatrix.vec2.fromValues(3, 8));
  t.deepEqual(_glMatrix.vec2.add(_glMatrix.vec2.create(), _glMatrix.vec2.multiply(_glMatrix.vec2.create(), v1, v2), _glMatrix.vec2.fromValues(1, 1)), _glMatrix.vec2.fromValues(4, 9));
});
(0, _ava.default)('vec cross', t => {
  const v1 = _glMatrix.vec2.fromValues(1, 2);
  const v2 = _glMatrix.vec2.fromValues(3, 4);
  const v = _glMatrix.vec2.cross(_glMatrix.vec3.create(), v1, v2);
  t.deepEqual(v, _glMatrix.vec3.fromValues(0, 0, -2));
});
(0, _ava.default)('dot', t => {
  const v1 = _glMatrix.vec2.fromValues(1, 2);
  const v2 = _glMatrix.vec2.fromValues(3, 4);
  t.is(_glMatrix.vec2.dot(v1, v2), 11);
  t.is(_glMatrix.vec2.dot(v1, v2) + 1, 12);
});
(0, _ava.default)('multiply', t => {
  const m1 = _glMatrix.mat2d.fromValues(1, 0, 0, 1, 0, 0);
  const m2 = _glMatrix.mat2d.fromValues(1, 2, 3, 4, 5, 6);
  t.deepEqual(_glMatrix.mat2d.multiply(_glMatrix.mat2d.create(), m1, m2), _glMatrix.mat2d.multiply(_glMatrix.mat2d.create(), m1, m2));
  const q1 = _glMatrix.quat.fromValues(1, 2, 3, 4);
  const q2 = _glMatrix.quat.fromValues(5, 6, 7, 8);
  t.deepEqual(_glMatrix.quat.multiply(_glMatrix.quat.create(), q1, q2), _glMatrix.quat.multiply(_glMatrix.quat.create(), q1, q2));
  const q3 = _glMatrix.quat2.fromValues(1, 2, 3, 4, 5, 6, 7, 8);
  const q4 = _glMatrix.quat2.fromValues(1, 0, 3, 5, 9, 8, 6, 4);
  t.deepEqual(_glMatrix.quat2.multiply(_glMatrix.quat2.create(), q3, q4), _glMatrix.quat2.multiply(_glMatrix.quat2.create(), q3, q4));
});
(0, _ava.default)('scale', t => {
  const v1 = _glMatrix.vec2.scale(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(1, 1), 2);
  t.deepEqual(v1, _glMatrix.vec2.fromValues(2, 2));
  const v2 = _glMatrix.vec2.negate(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(1, 1));
  t.deepEqual(v2, _glMatrix.vec2.fromValues(-1, -1));
  const v3 = _glMatrix.vec2.scale(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(1, 2), 0.5);
  t.deepEqual(v3, _glMatrix.vec2.fromValues(0.5, 1));
});
(0, _ava.default)('transform', t => {
  const v1 = _glMatrix.vec2.fromValues(1, 1);
  const m1 = _glMatrix.mat2.fromValues(1, 0, 0, 1);
  t.deepEqual(v1, _glMatrix.vec2.transformMat2(_glMatrix.vec2.create(), v1, m1));
  const m2 = _glMatrix.mat2.fromValues(2, 0, 0, 2);
  t.deepEqual(_glMatrix.vec2.scale(_glMatrix.vec2.create(), v1, 2), _glMatrix.vec2.transformMat2(_glMatrix.vec2.create(), v1, m2));
  const m3 = _glMatrix.mat2d.fromValues(1, 0, 0, 1, 0, 0);
  t.deepEqual(v1, _glMatrix.vec2.transformMat2d(_glMatrix.vec2.create(), v1, m3));
  const m4 = _glMatrix.mat2d.fromValues(2, 0, 0, 2, 0, 0);
  t.deepEqual(_glMatrix.vec2.scale(_glMatrix.vec2.create(), v1, 2), _glMatrix.vec2.transformMat2d(_glMatrix.vec2.create(), v1, m4));
  const m5 = _glMatrix.mat3.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1);
  t.deepEqual(v1, _glMatrix.vec2.transformMat3(_glMatrix.vec2.create(), v1, m5));
  const m6 = _glMatrix.mat3.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9);
  t.deepEqual(_glMatrix.vec2.transformMat3(_glMatrix.vec2.create(), v1, m6), _glMatrix.vec2.transformMat3(_glMatrix.vec2.create(), v1, m6));
  const m7 = _glMatrix.mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  t.deepEqual(_glMatrix.vec2.transformMat4(_glMatrix.vec2.create(), v1, m7), _glMatrix.vec2.transformMat4(_glMatrix.vec2.create(), v1, m7));
  t.deepEqual(_glMatrix.vec3.transformMat4(_glMatrix.vec3.create(), [1, 1, 1], m7), _glMatrix.vec3.transformMat4(_glMatrix.vec3.create(), _glMatrix.vec3.fromValues(...v1, 1), m7));
  t.deepEqual(_glMatrix.vec2.transformMat4(_glMatrix.vec2.create(), v1, _glMatrix.mat4.transpose(_glMatrix.mat4.create(), m7)), _glMatrix.vec2.transformMat4(_glMatrix.vec2.create(), v1, _glMatrix.mat4.transpose(_glMatrix.mat4.create(), m7)));
});
(0, _ava.default)('+=, -=, *=', t => {
  let v1 = _glMatrix.vec2.fromValues(1, 1);
  const v2 = v1;
  _glMatrix.vec2.add(v1, v1, _glMatrix.vec2.fromValues(1, 1));
  t.is(v1, v2);
  t.deepEqual(v1, _glMatrix.vec2.fromValues(2, 2));
  let v3 = _glMatrix.vec2.fromValues(3, 4);
  const v4 = v3;
  _glMatrix.vec2.multiply(v3, v3, _glMatrix.vec2.fromValues(2, 2));
  t.is(v3, v4);
  t.deepEqual(v3, _glMatrix.vec2.multiply(_glMatrix.vec2.create(), _glMatrix.vec2.fromValues(3, 4), _glMatrix.vec2.fromValues(2, 2)));
});
(0, _ava.default)('scope', t => {
  const mat2d = {
    add(a, b) {
      return a + b;
    }
  };
  t.is(mat2d.add(1, 2), 3);
});
