# babel-plugin-transfrom-gl-matrix

这是 [gl-matrix](https://github.com/toji/gl-matrix) 的 babel 插件。

gl-matrix是个高性能的JavaScript矩阵运算库，但是它的API不方便使用。

例如，要定义一个3维向量，原生的API长这样：

```js
const v = vec3.fromValues(1, 0, 0);
```

有了这个插件以后，可以这么写：

```js
const v = vec3(1, 0, 0);
```

要将两个向量相加，原生的API长这样：

```js
const v = vec3.add(vec3.create(), v1, v2);
```

用这个插件可以这么写：

```js
const v = vec3(v1) + vec3(v2);
```

_由于JavaScript是动态类型语言，我们需要在计算前指定变量的类型（动态探测会影响性能），所以要使用`vec3(v1) + vec3(v2)`而不能直接用`v1 + v2`。_

同样，求两个向量的乘积：

```js
const v = vec3.multiply(vec3.create(), v1, v2); // 原生写法
```

```js
const v = vec3(v1) * vec3(v2); // 插件写法
```

**注意: `vec3(v1) * vec3(v2)` 结果是 `vec3.multiply(v1, v2)`, 但是在v0.6之前的版本中， `vec3(v1) * vec3(v2)` 结果是 `vec3.cross(v1, v2)`. v0.6之后的版本做了调整以保持和[glsl](https://en.wikibooks.org/wiki/GLSL_Programming/Vector_and_Matrix_Operations)的一致性.**

标量与向量相乘：

```js
const v = vec3.scale(vec3.create(), v1, n); // 原生写法
```

```js
const v = vec3(v1) * n; // 插件写法
```

向量的矩阵变换：

```js
const v1 = vec3.fromValues(1, 2, 3);
const m1 = mat3.fromValues(2, 0, 0, 0, 2, 0, 0, 0, 2);

const v = vec3.transformMat3(vec3.create(), v1, m1); // 原生写法
```

```js
const v1 = vec3(1, 2, 3);
const m1 = mat3(2, 0, 0, 0, 2, 0, 0, 0, 2);

const v = mat3(m1) * vec3(v1); // 插件写法
```

比较 (0.4之后的版本)

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

## 使用方式

配置 .babelrc

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

如果你设置 `glMatrixArray: false`，那么插件将使用 Array 类型取代使用 Float32Array 类型作为基本的数据类型。

这么做是因为在新的浏览器中，使用 Array 可以避免性能问题。

详见 [359](https://github.com/toji/gl-matrix/issues/359)。
