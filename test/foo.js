export default function foo(a, b) {
  if(a > 0 && b > 0) {
    return 10;
  } else if(b > 0) {
    return 0;
  } else {
    return -10;
  }
}