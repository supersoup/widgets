interface Item {
    text: string;
    value: string;
}

interface onChooseInfo {
    text: string;
    value: string;
    index: number;
}

interface ChooserOptions {
    node: HTMLElement;
    list: Item[];
    className: string;
    onChoose?(isFirst: boolean, info: onChooseInfo): void;
}

export = class Chooser {
    constructor(options: ChooserOptions);

    setCurrentIndex(index: number, shouldExecOnChoose: boolean): void;
    getValue(): void;
    getIndex(): number;
}