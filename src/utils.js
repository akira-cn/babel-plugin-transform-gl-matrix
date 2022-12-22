import retmap from './retmap.js';

export function getOperandType(t, path, node = path.node) {
  if (t.isIdentifier(node)) {
    // 变量标识符，在赋值语句中记录类型
    const binding = path.scope.getBinding(node.name);
    if (binding) {
      return binding._operandType;
    }
  } else if (t.isCallExpression(node)) {
    // 函数调用，记录返回值类型
    const { callee } = node;
    if (t.isIdentifier(callee)) {
      const funcName = callee.name;
      const retType = retmap[funcName] || null;
      const _binding = path.scope.getBinding(retType);
      if (!_binding || _binding.kind === 'module') {
        return retType;
      }
    }
    if (t.isMemberExpression(callee)) {
      const { object, property } = callee;
      if (t.isIdentifier(object) && t.isIdentifier(property)) {
        const funcName = `${object.name}.${property.name}`;
        const retType = retmap[funcName] || null;
        const _binding = path.scope.getBinding(retType);
        if (!_binding || _binding.kind === 'module') {
          return retType;
        }
      }
    }
  } else if (t.isUnaryExpression(node)) {
    // 一元运算符，记录操作数类型
    const { operator, argument } = node;
    if (operator === '-' || operator === '~') {
      return getOperandType(t, path, argument);
    }
  } else if (t.isBinaryExpression(node)) {
    // 二元运算符，记录操作数类型
    const { left, right } = node;
    const leftType = getOperandType(t, path, left);
    const rightType = getOperandType(t, path, right);
    if (leftType) {
      return leftType;
    }
    return rightType;
  } else if (t.isMemberExpression(node)) {
    const { object, property } = node;
    const type = getOperandType(t, path, object);
    if (type === 'vec2' && /^[xy]{2}|[st]{2}$/.test(property.name)) {
      return 'vec2';
    }
    if (type === 'vec3' && /^[xyz]{2,3}|[rgb]{2,3}|[stp]{2,3}$/.test(property.name)) {
      return `vec${property.name.length}`;
    }
    if (type === 'vec4' && /^[xyzw]{2,4}|[rgba]{2,4}|[stpq]{2,4}$/.test(property.name)) {
      return `vec${property.name.length}`;
    }
  } else if (t.isArrayExpression(node)) {
    const { elements } = node;
    if (elements.length >= 2 && elements.length <= 4) {
      return `vec${elements.length}`;
    }
  }
  return null;
}

export function makeCreate(t, type) {
  return t.callExpression(
    t.memberExpression(
      t.identifier(type),
      t.identifier('create'),
      false,
    ),
    [],
  );
}

export function spreadArgs(t, path, args) {
  const ret = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (getOperandType(t, path, arg)) {
      ret.push(t.spreadElement(arg));
    } else {
      ret.push(arg);
    }
  }
  return ret;
}

export function fromScalarValues(t, type, node) {
  if (type === 'vec2' || type === 'vec3' || type === 'vec4') {
    return t.callExpression(
      t.memberExpression(
        t.identifier(type),
        t.identifier('fromValues'),
        false,
      ),
      [node, node, node, node].slice(0, Number(type.slice(-1))),
    );
  }
  const o = t.numericLiteral(0);
  if (type === 'mat2') {
    return t.callExpression(
      t.memberExpression(
        t.identifier(type),
        t.identifier('fromValues'),
        false,
      ),
      [node, o, o, node],
    );
  }
  if (type === 'mat2d') {
    return t.callExpression(
      t.memberExpression(
        t.identifier(type),
        t.identifier('fromValues'),
        false,
      ),
      [node, o, o, node, o, o],
    );
  }
  if (type === 'mat3') {
    return t.callExpression(
      t.memberExpression(
        t.identifier(type),
        t.identifier('fromValues'),
        false,
      ),
      [node, o, o,
        o, node, o,
        o, o, node],
    );
  }
  if (type === 'mat4') {
    return t.callExpression(
      t.memberExpression(
        t.identifier(type),
        t.identifier('fromValues'),
        false,
      ),
      [node, o, o, o,
        o, node, o, o,
        o, o, node, o,
        o, o, o, node],
    );
  }
  throw new TypeError(`Cannot transform scalar to ${type}`);
}

export function makeBinaryExpression(t, path, type, left, right, operator) {
  let node = null;
  if (type) {
    const leftType = getOperandType(t, path, left);
    const rightType = getOperandType(t, path, right);
    if (!leftType && !rightType) return;
    if (operator === '+' || operator === '-') {
      const op = operator === '+' ? 'add' : 'sub';
      if (leftType === rightType) {
        if (t.isCallExpression(left) && left.callee.property.name === 'scale') {
          // scale and add
          left.callee.property.name = 'scaleAndAdd';
          if (operator === '-') {
            left.arguments.splice(1, 0, t.unaryExpression('-', right));
          } else {
            left.arguments.splice(1, 0, right);
          }
          node = left;
        } else if (t.isCallExpression(right) && right.callee.property.name === 'scale') {
          // scale and add
          right.callee.property.name = 'scaleAndAdd';
          if (operator === '-') {
            right.arguments.splice(1, 0, t.unaryExpression('-', left));
          } else {
            right.arguments.splice(1, 0, left);
          }
          node = right;
        } else {
          node = t.callExpression(
            t.memberExpression(
              t.identifier(type),
              t.identifier(op),
              false,
            ),
            [
              left,
              right,
            ],
          );
        }
      } else if (!rightType) {
        node = t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier(op),
            false,
          ),
          [
            left,
            fromScalarValues(t, type, right),
          ],
        );
      } else if (!leftType) {
        node = t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier(op),
            false,
          ),
          [
            fromScalarValues(t, type, left),
            right,
          ],
        );
      } else {
        throw new TypeError(`type mismatch: ${leftType} ${operator} ${rightType}`);
      }
    } else if (operator === '*') {
      if (leftType === rightType) {
        node = t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier('multiply'),
            false,
          ),
          [
            left,
            right,
          ],
        );
      } else if (!rightType) {
        const fun = retmap[`${type}.multiplyScalar`] ? 'multiplyScalar' : 'scale';
        node = t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier(fun),
            false,
          ),
          [
            left,
            right,
          ],
        );
      } else if (!leftType) {
        const fun = retmap[`${type}.multiplyScalar`] ? 'multiplyScalar' : 'scale';
        node = t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier(fun),
            false,
          ),
          [
            right,
            left,
          ],
        );
      } else if (rightType.startsWith('vec') && leftType.startsWith('mat')) {
        // M x V
        node = t.callExpression(
          t.memberExpression(
            t.identifier(rightType),
            t.identifier(`transform${leftType.slice(0, 1).toUpperCase()}${leftType.slice(1)}`),
            false,
          ),
          [
            right,
            left,
          ],
        );
      } else if (rightType.startsWith('mat') && leftType.startsWith('vec')) {
        // V x M
        node = t.callExpression(
          t.memberExpression(
            t.identifier(leftType),
            t.identifier(`transform${rightType.slice(0, 1).toUpperCase()}${rightType.slice(1)}`),
            false,
          ),
          [
            left,
            t.callExpression(
              t.memberExpression(
                t.identifier(rightType),
                t.identifier('transpose'),
                false,
              ),
              [
                right,
              ],
            ),
          ],
        );
      } else {
        throw new TypeError(`type mismatch: ${leftType} ${operator} ${rightType}`);
      }
    } else if (operator === '/') {
      if (!rightType) {
        const fun = retmap[`${type}.multiplyScalar`] ? 'multiplyScalar' : 'scale';
        node = t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier(fun),
            false,
          ),
          [
            left,
            t.binaryExpression(
              '/',
              t.numericLiteral(1),
              right,
            ),
          ],
        );
      } else if (leftType === rightType && retmap[`${type}.divide`]) {
        node = t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier('divide'),
            false,
          ),
          [
            left,
            right,
          ],
        );
      }
    } else if (operator === '==') {
      node = t.callExpression(
        t.memberExpression(
          t.identifier(type),
          t.identifier('equals'),
          false,
        ),
        [
          left,
          right,
        ],
      );
    } else if (operator === '!=') {
      node = t.unaryExpression(
        '!',
        t.callExpression(
          t.memberExpression(
            t.identifier(type),
            t.identifier('equals'),
            false,
          ),
          [
            left,
            right,
          ],
        ),
      );
    } else {
      throw new TypeError(`type mismatch: ${leftType} ${operator} ${rightType}`);
    }
  }
  // eslint-disable-next-line consistent-return
  return node;
}
