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

同样，求两个向量的外积：

```js
const v = vec3.cross(vec3.create(), v1, v2); // 原生写法
```

```js
const v = vec3(v1) * vec3(v2); // 插件写法
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

const v = mat3(v1) * vec3(m1); // 插件写法
```
