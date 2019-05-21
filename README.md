# babel-plugin-transfrom-gl-matrix

[中文文档](README-CN.md)

A babel plugin for [gl-matrix](https://github.com/toji/gl-matrix).

GlMatrix is a high-performance JavaScript matrix library, but its API is not easy to use.

For example, to define a three-dimensional vector, the native API looks like this:

```js
const v = vec3.fromValues(1, 0, 0);
```

With this plug-in, you can write as follows:

```js
const v = vec3(1, 0, 0);
```

To add the two vectors together, the native API looks like this:

```js
const v = vec3.add(vec3.create(), v1, v2);
```

With this plug-in, you can write as follows:

```js
const v = vec3(v1) + vec3(v2);
```

_Because JavaScript is a dynamically typed language, we need to specify the type of variables while compiling (dynamic detection reduces performance), so we need to use `vec3 (v1) + vec3 (v2) ` instead of `v1 + v2`._

Similarly, calculate the multiplication of two vectors:

```js
const v = vec3.multiply(vec3.create(), v1, v2); // original
```

```js
const v = vec3(v1) * vec3(v2); // with plugin
```

Multiplication of scalars and vectors:

```js
const v = vec3.scale(vec3.create(), v1, n); // original
```

```js
const v = vec3(v1) * n; // with plugin
```

Matrix transformation of vectors:

```js
const v1 = vec3.fromValues(1, 2, 3);
const m1 = mat3.fromValues(2, 0, 0, 0, 2, 0, 0, 0, 2);

const v = vec3.transformMat3(vec3.create(), v1, m1); // original
```

```js
const v1 = vec3(1, 2, 3);
const m1 = mat3(2, 0, 0, 0, 2, 0, 0, 0, 2);

const v = mat3(m1) * vec3(v1); // with plugin
```

Comparative (version > 0.4)

```js
const v1 = vec3.fromValues(1, 2, 3);
const v2 = vec3.fromValues(1, 2, 3);
const v3 = vec3.fromValues(1, 1, 1);

// original
console.log(vec3.equals(v1, v2), vec3.equals(v1, v3)); // true false
```

```js
const v1 = vec3.fromValues(1, 2, 3);
const v2 = vec3.fromValues(1, 2, 3);
const v3 = vec3.fromValues(1, 1, 1);

console.log(vec3(v1) == v2, vec3(v1) != v3); // true, true
```

## Usage

.babelrc

```json
{
  "presets": [
    ["@babel/preset-env",
      {
        "targets": {
          "browsers": [
            "> 1%",
            "last 2 versions",
            "not ie <= 8"
          ]
        }
      }
    ]
  ],
  "plugins": [
    ["transform-gl-matrix", {
      "glMatrixArray": false
    }]
  ]
}
```

If you set `glMatrixArray: false`，the plugin will use Array as glMatrix.ARRAY_TYPE instead of Float32Array.

See issue [359](https://github.com/toji/gl-matrix/issues/359).
