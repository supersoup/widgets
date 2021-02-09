interface LoadingOptions {
    node: HTMLElement;
    animate: number;
}

export = class Loading {
    constructor(options: LoadingOptions);
    show(): void;
    hide(): void;
}