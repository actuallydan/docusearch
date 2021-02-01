export function generateUUID(filename) {
  return (
    new Date().getTime() +
    "-" +
    Math.random().toString(16).replace(".", "") +
    "-" +
    filename
  );
}
