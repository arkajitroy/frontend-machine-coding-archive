export interface Item {
    id: number;
    content: string;
}

export function generateItems(count: number = 50_000): Array<Item> {
    const items: Item[] = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        content: `Item number ${i + 1} – Lorem ipsum dolor sit amet`,
    }));
    return items;
}
