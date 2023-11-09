// Temporal implementation of Array.prototype.findLastIndex.
// Use the official implementation when es2023 is available.
function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number {
  let index = array.length;
  while (index--) {
    const value = array[index];
    if (value === undefined) break;
    if (predicate(value, index, array)) return index;
  }
  return -1;
}

export function getLastIndexBeforeTime(
  timeArray: number[],
  timestampFrom: number,
  margin?: number,
): number | undefined {
  const lastIndex = findLastIndex(timeArray, (time) => time < timestampFrom);
  const lastIndexFixed = lastIndex === -1 ? undefined : lastIndex;
  if (margin !== undefined && lastIndexFixed !== undefined) {
    const lastPointTime = timeArray[lastIndexFixed];
    if (lastPointTime !== undefined && lastPointTime + margin < timestampFrom) {
      return undefined;
    }
  }
  return lastIndexFixed;
}
