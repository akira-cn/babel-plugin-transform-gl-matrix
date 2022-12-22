import {
  getOperandType, makeCreate, fromScalarValues, spreadArgs,
  makeBinaryExpression,
} from './utils.js';
import retmap from './retmap.js';

// eslint-disable-next-line func-names
export default function ({ types: t }) {
  return {
    visitor: {
      VariableDeclarator: {
        exit(path) {
          const { id, init } = path.node;
          if (t.isIdentifier(id)) {
            const binding = path.scope.getBinding(id.name);
            if (binding) {
              binding._operandType = getOperandType(t, path, init);
            }
          }
        },
      },
      AssignmentExpression: {
        // TODO: += -= *= /= etc.
        exit(path) {
          const { left, right, operator } = path.node;
          if (t.isIdentifier(left)) {
            const binding = path.scope.getBinding(left.name);
            if (binding) {
              const type = getOperandType(t, path, right);
              if (type) {
                binding._operandType = type;
                if (binding.kind !== 'const') {
                  if (operator === '+=' || operator === '-=' || operator === '*=' || operator === '/=') {
                    const node = makeBinaryExpression(
                      t,
                      path,
                      type,
                      left,
                      right,
                      operator.slice(0, 1),
                    );
                    node._makeCreated = true;
                    node.arguments.unshift(left);
                    path.replaceWith(node);
                  }
                  if (operator === '=') {
                    if (t.isCallExpression(right) && t.isMemberExpression(right.callee)) {
                      const { object, property } = right.callee;
                      if (t.isIdentifier(object) && t.isIdentifier(property)) {
                        if (property.name !== 'create' && property.name !== 'fromValues') {
                          right.arguments[0] = left;
                          path.replaceWith(right);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
      CallExpression: {
        exit(path) {
          const type = getOperandType(t, path);
          if (type) {
            if (t.isIdentifier(path.node.callee)) {
              const args = path.node.arguments;
              const _type = getOperandType(t, path, args[0]);
              if (args.length === 1 && type === _type) {
                path.replaceWith(args[0]);
              } else if (args.length === 1 && !_type && !t.isSpreadElement(args[0])) {
                // 用一个参数来构造向量和矩阵
                const node = fromScalarValues(t, type, args[0]);
                path.replaceWith(node);
              } else {
                const hasType = args.some((arg) => getOperandType(t, path, arg));
                let node;
                if (hasType) {
                  // 用多个参数来构造向量和矩阵
                  node = t.callExpression(
                    t.memberExpression(
                      t.identifier(type),
                      t.identifier('fromValues'),
                      false,
                    ),
                    spreadArgs(t, path, args),
                  );
                  path.replaceWith(node);
                } else {
                  node = t.callExpression(
                    t.memberExpression(
                      t.identifier(type),
                      t.identifier('fromValues'),
                      false,
                    ),
                    args,
                  );
                }
                path.replaceWith(node);
              }
            }
            if (t.isMemberExpression(path.node.callee) && !path.node._makeCreated) {
              const { object, property } = path.node.callee;
              if (t.isIdentifier(object) && t.isIdentifier(property)) {
                // const funcName = `${object.name}.${property.name}`;
                if (property.name !== 'create' && property.name !== 'fromValues') {
                  path.node.arguments.unshift(
                    makeCreate(t, type),
                  );
                  path.node._makeCreated = true;
                }
              }
            }
          }
        },
      },
      UnaryExpression: {
        exit(path) {
          const type = getOperandType(t, path);
          if (type) {
            const { operator, argument } = path.node;
            if (operator === '-') {
              if (retmap[`${type}.negate`]) {
                const node = t.callExpression(
                  t.memberExpression(
                    t.identifier(type),
                    t.identifier('negate'),
                    false,
                  ),
                  [
                    argument],
                );
                path.replaceWith(node);
              } else {
                const node = t.callExpression(
                  t.memberExpression(
                    t.identifier(type),
                    t.identifier('multiplyScalar'),
                    false,
                  ),
                  [
                    argument,
                    t.numericLiteral(-1),
                  ],
                );
                path.replaceWith(node);
              }
            }
            if (operator === '~' && retmap[`${type}.transpose`]) {
              const node = t.callExpression(
                t.memberExpression(
                  t.identifier(type),
                  t.identifier('transpose'),
                  false,
                ),
                [
                  argument],
              );
              path.replaceWith(node);
            }
          }
        },
      },
      BinaryExpression: {
        exit(path) {
          const type = getOperandType(t, path);
          if (type) {
            const { left, right, operator } = path.node;
            const node = makeBinaryExpression(t, path, type, left, right, operator);
            if (node) path.replaceWith(node);
          }
        },
      },
      MemberExpression: {
        exit(path) {
          const { object, property } = path.node;
          const type = getOperandType(t, path, object);
          if (type) {
            if (t.isIdentifier(property)) {
              if (type.startsWith('vec') && (property.name === 'x' || (type !== 'vec2' && property.name === 'r') || property.name === 's')) {
                path.replaceWith(t.memberExpression(path.node.object, t.identifier('0'), true));
              } else if (type.startsWith('vec') && (property.name === 'y' || (type !== 'vec2' && property.name === 'g') || property.name === 't')) {
                path.replaceWith(t.memberExpression(path.node.object, t.identifier('1'), true));
              } else if ((type === 'vec3' || type === 'vec4') && (property.name === 'z' || property.name === 'b' || property.name === 'p')) {
                path.replaceWith(t.memberExpression(path.node.object, t.identifier('2'), true));
              } else if (type === 'vec4' && (property.name === 'w' || property.name === 'a' || property.name === 'q')) {
                path.replaceWith(t.memberExpression(path.node.object, t.identifier('3'), true));
              } else if (type === 'vec2') {
                if (/[xy]{2}/.test(property.name)) {
                  if (property.name === 'xy') {
                    path.replaceWith(object);
                  } else {
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(type),
                          t.identifier('fromValues'),
                          false,
                        ),
                        [
                          t.memberExpression(path.node.object, t.identifier('xy'.indexOf(property.name[0]).toString()), true),
                          t.memberExpression(path.node.object, t.identifier('xy'.indexOf(property.name[1]).toString()), true),
                        ],
                      ),
                    );
                  }
                } else if (/[st]{2}/.test(property.name)) {
                  if (property.name === 'st') {
                    path.replaceWith(object);
                  } else {
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(type),
                          t.identifier('fromValues'),
                          false,
                        ),
                        [
                          t.memberExpression(path.node.object, t.identifier('st'.indexOf(property.name[0]).toString()), true),
                          t.memberExpression(path.node.object, t.identifier('st'.indexOf(property.name[1]).toString()), true),
                        ],
                      ),
                    );
                  }
                }
              } else if (type === 'vec3') {
                if (/[xyz]{2,3}/.test(property.name)) {
                  if (property.name === 'xyz') {
                    path.replaceWith(object);
                  } else {
                    const args = [...property.name].map((c) => t.memberExpression(path.node.object, t.identifier('xyz'.indexOf(c).toString()), true));
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(`vec${property.name.length}`),
                          t.identifier('fromValues'),
                          false,
                        ),
                        args,
                      ),
                    );
                  }
                } else if (/[rgb]{2,3}/.test(property.name)) {
                  if (property.name === 'rgb') {
                    path.replaceWith(object);
                  } else {
                    const args = [...property.name].map((c) => t.memberExpression(path.node.object, t.identifier('rgb'.indexOf(c).toString()), true));
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(`vec${property.name.length}`),
                          t.identifier('fromValues'),
                          false,
                        ),
                        args,
                      ),
                    );
                  }
                } else if (/[stq]{2,3}/.test(property.name)) {
                  if (property.name === 'stq') {
                    path.replaceWith(object);
                  } else {
                    const args = [...property.name].map((c) => t.memberExpression(path.node.object, t.identifier('stq'.indexOf(c).toString()), true));
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(`vec${property.name.length}`),
                          t.identifier('fromValues'),
                          false,
                        ),
                        args,
                      ),
                    );
                  }
                }
              } else if (type === 'vec4') {
                if (/[xyzw]{2,4}/.test(property.name)) {
                  if (property.name === 'xyzw') {
                    path.replaceWith(object);
                  } else {
                    const args = [...property.name].map((c) => t.memberExpression(path.node.object, t.identifier('xyzw'.indexOf(c).toString()), true));
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(`vec${property.name.length}`),
                          t.identifier('fromValues'),
                          false,
                        ),
                        args,
                      ),
                    );
                  }
                } else if (/[rgba]{2,4}/.test(property.name)) {
                  if (property.name === 'rgba') {
                    path.replaceWith(object);
                  } else {
                    const args = [...property.name].map((c) => t.memberExpression(path.node.object, t.identifier('rgba'.indexOf(c).toString()), true));
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(`vec${property.name.length}`),
                          t.identifier('fromValues'),
                          false,
                        ),
                        args,
                      ),
                    );
                  }
                } else if (/[stpq]{2,4}/.test(property.name)) {
                  if (property.name === 'stpq') {
                    path.replaceWith(object);
                  } else {
                    const args = [...property.name].map((c) => t.memberExpression(path.node.object, t.identifier('stpq'.indexOf(c).toString()), true));
                    path.replaceWith(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(`vec${property.name.length}`),
                          t.identifier('fromValues'),
                          false,
                        ),
                        args,
                      ),
                    );
                  }
                }
              }
            }
          }
        },
      },
    },
  };
}
