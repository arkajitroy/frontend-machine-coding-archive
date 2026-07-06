import type { Item } from "../types";

export function generateItems(count: number): Array<Item> {
  const items = Array.from({ length: count }, (_, index) => ({
    id: index,
    content: `Item ${index + 1}`,
  }));

  return items;
}
