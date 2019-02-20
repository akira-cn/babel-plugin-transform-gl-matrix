const glMatrix = require('gl-matrix');

// const {vec2, vec3, vec4, mat2, mat2d, mat3, mat4} = glMatrix;

const MVMap = {
  vec2: 2,
  vec3: 3,
  vec4: 4,
  mat2: 4,
  mat2d: 6,
  mat3: 9,
  mat4: 16,
};

function isMV(name) {
  return !!MVMap[name];
}

function isMat(name) {
  return name.startsWith('mat');
}

function isVec(name) {
  return name.startsWith('vec');
}

function getOperandMV(t, node) {
  if(!t.isCallExpression(node)) return false;
  const name = node.callee.name || node.callee.object && node.callee.object.name;
  return MVMap[name] ? name : null;
}

function createMV(t, name, initValue) {
  if(initValue == null) {
    return t.callExpression(
      t.memberExpression(
        t.identifier(name),
        t.identifier('create'),
        false,
      ),
      [],
    );
  }

  const args = Array.from({length: MVMap[name]}).fill(t.numericLiteral(initValue));

  return t.callExpression(
    t.memberExpression(
      t.identifier(name),
      t.identifier('fromValues'),
      false,
    ),
    args,
  );
}

function clean(t, operand) {
  if(t.isIdentifier(operand.callee)) {
    return operand.arguments[0];
  }
  return operand;
}

module.exports = function ({types: t}) {
  return {
    visitor: {
      BinaryExpression: {
        exit(path) {
          const operator = path.node.operator;

          let left = getOperandMV(t, path.node.left);
          let right = getOperandMV(t, path.node.right);

          if(left) {
            if(right) {
              let op;
              if(operator === '*') {
                if(isVec(left) && isVec(right)) {
                  op = 'cross';
                } else if(isMat(left) && isMat(right)) {
                  op = 'multiply';
                } else if(isMat(left)) {
                  [left, right] = [right, left];
                  op = `transform${right.slice(0, 1).toUpperCase() + right.slice(1)}`;
                } else {
                  op = `transform${right.slice(0, 1).toUpperCase() + right.slice(1)}`;
                }
              } else if(operator === '+') {
                op = 'add';
              } else if(operator === '-') {
                op = 'subtract';
              }
              const node = t.callExpression(
                t.memberExpression(
                  t.identifier(left),
                  t.identifier(op),
                  false,
                ),
                [createMV(t, left), clean(t, path.node.left), clean(t, path.node.right)],
              );
              path.replaceWith(node);
            } else {
              let op,
                right = path.node.right;
              if(operator === '*') {
                op = 'scale';
                if(left === 'mat2' || left === 'mat2d' || left === 'mat3') {
                  right = createMV(t, 'vec2', right.value);
                } else if(left === 'mat4') {
                  right = createMV(t, 'vec3', right.value);
                }
              } else if(operator === '+') {
                op = 'add';
                right = createMV(t, left, right.value);
              } else if(operator === '-') {
                op = 'subtract';
                right = createMV(t, left, right.value);
              }
              const node = t.callExpression(
                t.memberExpression(
                  t.identifier(left),
                  t.identifier(op),
                  false,
                ),
                [createMV(t, left), clean(t, path.node.left), clean(t, right)],
              );
              path.replaceWith(node);
            }
          }
        },
      },
      CallExpression: {
        exit(path) {
          const funcName = path.node.callee.name;

          if(isMV(funcName)) {
            const args = path.node.arguments.map((arg) => {
              if(getOperandMV(t, arg)) {
                return t.spreadElement(arg);
              }
              return arg;
            });

            // if(args.length === 1) {
            //   args[0] = t.spreadElement(args[0]);
            // }

            if(args.length > 1) {
              const node = t.callExpression(
                t.memberExpression(
                  t.identifier(funcName),
                  t.identifier('fromValues'),
                  false,
                ),
                args
              );
              path.replaceWith(node);
            }
          } else if(getOperandMV(t, path.node)) {
            const name = path.node.callee.object.name;
            const property = path.node.callee.property.name;
            if(property !== 'fromValues' && property !== 'create') {
              const func = glMatrix[name][property];
              if(func && func.length > path.node.arguments.length) {
                path.node.arguments.unshift(createMV(t, name));
              }
            }
            // console.log(name, property, glMatrix[name][property]);
          }
        },
      },
    },
  };
};
