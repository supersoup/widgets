interface PageOptions {
    node: HTMLElement;
    className: string;
    eachNumber: number;
    eachNumberChangeable: boolean;
    goToPageable: boolean;
    countShow: boolean;
    callback(page: number, eachNumber: number): void;
}

interface PageState {
    current: number;
    eachNumber: number;
    count: number;
    totalPage: number;
}

export = class Page {
    constructor(options: PageOptions);
    setPage(page: number): void;
    setCount(count: number): void;
    setTotal(total: number): void;
    getState(): PageState;
}