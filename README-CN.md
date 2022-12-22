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
const v1 = vec3.fromValues(1, 0, 0);
const v2 = vec3.fromValues(0, 1, 0);
const v = vec3.add(vec3.create(), v1, v2);
```

用这个插件可以这么写：

```js
const v1 = vec3(1, 0, 0);
const v2 = vec3(0, 1, 0);
const v = v1 + v2;
```

同样，求两个向量的乘积：

```js
const v = vec3.multiply(vec3.create(), v1, v2); // 原生写法
```

```js
const v = v1 * v2; // 插件写法
```

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
const v1 = vec3(1, 2, 3);
const v2 = vec3(1, 2, 3);
const v3 = vec3(1, 1, 1);

console.log(v1 == v2, v1 != v3); // true, true
```

向量分量 (version > 1.0)，支持xyzw, rgba, stpq, 和glsl一样。

```js
const v1 = vec3.fromValues(1, 2, 3);
const v2 = vec2.fromValues(v1[0], v1[1]);
```

```js
const v1 = vec3(1, 2, 3);
const v2 = v1.xy; // with plugin
```

**注意：所有第一个参数为out的方法，使用插件都不应写out而是直接赋值。**

## 使用方式

配置 .babelrc

```json
{
  "presets": [
    ["@babel/preset-env",
    {
      "targets": {
        "node": "current"
      }
    }]
  ],
  "plugins": [
    "./src/index.js"
  ]
}
```
