const glMatrix = require('gl-matrix');

const RetMap = require('./retmap');

const MVMap = {
  vec2: 2,
  vec3: 3,
  vec4: 4,
  mat2: 4,
  mat2d: 6,
  mat3: 9,
  mat4: 16,
  quat: 4,
  quat2: 8,
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
  if(node.callee.object) {
    const key = `${node.callee.object.name}.${node.callee.property.name}`;
    const name = RetMap[key];
    if(name && MVMap[name]) {
      return name;
    }
    if(name) {
      return null;
    }
  }
  return MVMap[name] ? name : null;
}

function createMV(t, name, initObj = {value: 0}) {
  let args;
  if(initObj.value == null && t.isArrayExpression(initObj)) {
    args = initObj.elements;
  } else {
    args = Array.from({length: MVMap[name]}).fill(t.numericLiteral(initObj.value));
  }
  return t.callExpression(
    t.memberExpression(
      t.identifier('GL_MATRIX_ARRAY_TYPE'),
      t.identifier('of'),
      false,
    ),
    args
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
      UnaryExpression: {
        exit(path) {
          const operator = path.node.operator;
          const operand = getOperandMV(t, path.node.argument);

          if(operator === '-' && operand) {
            const node = t.callExpression(
              t.memberExpression(
                t.identifier(operand),
                t.identifier('scale'),
                false,
              ),
              [createMV(t, operand), clean(t, path.node.argument), t.numericLiteral(-1)],
            );

            path.replaceWith(node);
          }
        },
      },
      BinaryExpression: {
        exit(path) {
          const operator = path.node.operator;

          let left = getOperandMV(t, path.node.left);
          let right = getOperandMV(t, path.node.right);

          if(!left && right) {
            if(t.isArrayExpression(path.node.left)) {
              const elements = path.node.left.elements;
              if(elements.length === 2) {
                left = 'vec2';
              } else if(elements.length === 3) {
                left = 'vec3';
              } else if(elements.length >= 4) {
                left = 'vec4';
              }
              path.node.left = createMV(t, left, path.node.left);
            } else if(operator === '*' || operator === '==' || operator === '!=') {
              [left, right] = [right, left];
              [path.node.left, path.node.right] = [path.node.right, path.node.left];
            } else if(operator === '+' || operator === '-') {
              left = right;
              path.node.left = createMV(t, left, path.node.left);
            }
          } else if(left && !right) {
            if(t.isArrayExpression(path.node.right)) {
              const elements = path.node.right.elements;
              if(elements.length === 2) {
                right = 'vec2';
              } else if(elements.length === 3) {
                right = 'vec3';
              } else if(elements.length >= 4) {
                right = 'vec4';
              }
              path.node.right = createMV(t, right, path.node.right);
            } else if(operator === '+' || operator === '-') {
              right = left;
              path.node.right = createMV(t, right, path.node.right);
            }
          }

          if(left) {
            let op;
            let rightOperand = path.node.right,
              leftOperand = path.node.left;

            if(operator === '*') {
              if(!right) {
                op = 'scale';
                if(left === 'mat2' || left === 'mat2d' || left === 'mat3') {
                  rightOperand = createMV(t, 'vec2', rightOperand);
                } else if(left === 'mat4') {
                  rightOperand = createMV(t, 'vec3', rightOperand);
                }
              } else if(isVec(left) && isVec(right)) {
                op = 'cross';
              } else if(isMat(left) && isVec(right)) {
                [left, right] = [right, left];
                [leftOperand, rightOperand] = [rightOperand, leftOperand];
                op = `transform${right.slice(0, 1).toUpperCase() + right.slice(1)}`;
              } else if(isVec(left) && isMat(right)) {
                // vec * mat = transpose(mat) * vec
                op = `transform${right.slice(0, 1).toUpperCase() + right.slice(1)}`;
                rightOperand = t.callExpression(
                  t.memberExpression(
                    t.identifier(right),
                    t.identifier('transpose'),
                    false,
                  ),
                  [createMV(t, right), rightOperand]
                );
              } else {
                op = 'multiply';
              }
            } else if(operator === '+') {
              op = 'add';
            } else if(operator === '-') {
              op = 'subtract';
            } else if(operator === '==' || operator === '!=') {
              op = 'equals';
            }
            if(op) {
              let creator = op === 'equals' ? [] : [createMV(t, left)];
              if(op === 'cross' && left === 'vec2') {
                creator = [createMV(t, 'vec3')];
              }
              let node = t.callExpression(
                t.memberExpression(
                  t.identifier(left),
                  t.identifier(op),
                  false,
                ),
                [...creator, clean(t, leftOperand), clean(t, rightOperand)],
              );
              if(operator === '!=') {
                node = t.unaryExpression('!', node);
              }
              path.replaceWith(node);
            }
          }
        },
      },
      AssignmentExpression: {
        exit(path) {
          const right = getOperandMV(t, path.node.right);
          const operator = path.node.operator;

          if(right) {
            let op;
            if(operator === '*=') {
              if(isVec(right)) {
                op = 'cross';
              } else {
                op = 'multiply';
              }
            } else if(operator === '+=') {
              op = 'add';
            } else if(operator === '-=') {
              op = 'subtract';
            }
            if(op) {
              const node = t.assignmentExpression(
                '=',
                path.node.left,
                t.callExpression(
                  t.memberExpression(
                    t.identifier(right),
                    t.identifier(op),
                    false,
                  ),
                  [path.node.left, path.node.left, clean(t, path.node.right)],
                ),
              );
              path.replaceWith(node);
            }
          }
        },
      },
      CallExpression: {
        exit(path) {
          let funcName = path.node.callee.name;
          let applyTag = false;
          if(t.isMemberExpression(path.node.callee)) {
            if(path.node.callee.property.name === 'apply') {
              funcName = path.node.callee.object.name;
              applyTag = true;
            }
          }

          if(isMV(funcName)) {
            const args = path.node.arguments.map((arg) => {
              if(getOperandMV(t, arg)) {
                return t.spreadElement(clean(t, arg));
              }
              return arg;
            });

            if(args.length > 1 || t.isSpreadElement(args[0])) {
              let node = t.memberExpression(
                t.identifier(funcName),
                t.identifier('fromValues'),
                false,
              );
              if(applyTag) {
                node = t.memberExpression(
                  node,
                  t.identifier('apply'),
                  false,
                );
                args[0] = t.identifier(funcName);
              }
              node = t.callExpression(
                node,
                args
              );
              path.replaceWith(node);
            }
          } else if(getOperandMV(t, path.node)) {
            let name = path.node.callee.object.name;
            const property = path.node.callee.property.name;
            if(property !== 'fromValues' && property !== 'create') {
              const func = glMatrix[name][property];
              if(func && func.length > path.node.arguments.length) {
                if(name === 'vec2' && property === 'cross') {
                  name = 'vec3';
                }
                path.node.arguments.unshift(createMV(t, name));
              }
            }
            // console.log(name, property, glMatrix[name][property]);
          }
        },
      },
      Program: {
        exit(path) {
          path.traverse({
            CallExpression(p) {
              const funcName = p.node.callee.name;

              if(isMV(funcName) && p.node.arguments.length === 1) {
                p.replaceWith(clean(t, p.node));
              }
            },
          });

          const body = path.get('body')[0];
          if(body) {
            body.insertBefore(t.variableDeclaration(
              'var',
              [t.variableDeclarator(
                t.identifier('GL_MATRIX_ARRAY_TYPE'),
                t.conditionalExpression(
                  t.binaryExpression(
                    '!==',
                    t.unaryExpression(
                      'typeof',
                      t.identifier('Float32Array'),
                    ),
                    t.stringLiteral('undefined'),
                  ),
                  t.identifier('Float32Array'),
                  t.identifier('Array'),
                ),
              )],
            ));
          }
        },
      },
    },
  };
};
