const v2 = vec2(1, 0);
const v3 = vec3(2);

v2 + v3.xy;
v2 + [1, 0];

[1, 2] + [3, 4];

const m2 = mat2(1, 2, 3, 4);

m2 * v2;
v2 * m2;
