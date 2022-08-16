export function isPressNumber(inputEvent: KeyboardEvent) {
  const keysAllowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const keyPressed: string = inputEvent.key;
  if (!keysAllowed.includes(keyPressed)) {
    inputEvent.preventDefault();
    return false;
  }
  return true;
}
