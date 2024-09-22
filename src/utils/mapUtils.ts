export const convertArrayToMapById = <T extends { id: number }>(
  arr: Array<T>
): Map<number, T> => {
  const map = new Map<number, T>();
  for (let i = 0; i < arr.length; i++) {
    map.set(arr[i].id, arr[i]);
  }

  return map;
};
