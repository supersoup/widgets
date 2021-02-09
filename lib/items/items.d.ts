interface Item {
    text: string;
    value: string;
}

interface ItemsOptions {
    node: HTMLElement;
    shouldUnique: boolean;
    onRemove(value: string, text: string, index: boolean): void;
}

export = class Items {
    constructor(options: ItemsOptions);
    removeAll(): void;
    addItem(item: Item): boolean;
    setValue(list: Item[]): boolean;
    getValue(): Item[];
}