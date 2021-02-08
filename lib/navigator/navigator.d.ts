interface Item {
    text: string;
    value: string;
}

interface NavigatorOptions {
    allList?: Item[];
    storeListKey?: string;
}

export = class Navigator {
    constructor(options: NavigatorOptions);
    setCurrentStatus(value: string): void;
}