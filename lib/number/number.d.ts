interface NumberOptions {
    step?: number;
    selector: string;
    max?: number;
    min?: number;
}

interface ExportObject {
    init(options: NumberOptions): void;
}

export = ExportObject;