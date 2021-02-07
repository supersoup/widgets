interface OnChange {
    (value: string[]): void;
}

interface CheckboxAllOptions {
    checkbox: HTMLInputElement;
    findClassName: string;
    onChange: OnChange
}

export = class CheckboxAll {
    constructor(options: CheckboxAllOptions);
    reset(): void;
    getValue(): string[];
}