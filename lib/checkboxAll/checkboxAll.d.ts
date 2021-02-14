interface CheckboxAllOptions {
    checkbox: HTMLElement;
    findClassName: string;
    onChange?(value: string[]): void
}

declare class CheckboxAll {
    constructor(options: CheckboxAllOptions);
    reset(): void;
    getValue(): string[];
}

export = CheckboxAll;