interface ListOptions<T> {
    node: HTMLElement;
    render<T>(item, index: number): string;
}

export = class List<T> {
    constructor(options: ListOptions<T>);
    setDataSource(list: T[]): void;
    clear(): void;
}