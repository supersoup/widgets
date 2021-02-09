interface InputOptions {
    node: HTMLElement;
    className: string;
    onChange(value: string): void;
}

export = class Input {
    constructor(options: InputOptions);
    setValue(value: string): void;
    getValue(): string;
}