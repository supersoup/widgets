interface CheckboxAllOptions {
    checkbox: HTMLInputElement;
    findClassName: string;
    onChange?(value: string[]): void
}

export = class CheckboxAll {
    constructor(options: CheckboxAllOptions);
    reset(): void;
    getValue(): string[];
}