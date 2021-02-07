interface ListItem {
    value: string;
    text: string;
}

interface CheckboxesOptions {
    node: HTMLElement;
    hasAll: boolean;
    list: ListItem[];
    onChange(list: string[]): void;
}

export = class Checkboxes {
    constructor(options: CheckboxesOptions);
    setValue(list: string[]): void;
    getValue(): string[];
}