export const outDuplicatesById = <T extends { id: string }>(
  value: T,
  index: number,
  array: T[]
) => {
  return array.findIndex((item) => item.id === value.id) >= index;
};
