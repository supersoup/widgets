/// <reference path="jquery" />

interface HandleButton {
    text: string;
    isPrimary?: boolean;
    callback?(): void;
}

interface ModalOptions {
    animateTime?: number;
    headerClosable?: boolean;
    maskClosable?: boolean;
    size?: 'small' | 'normal' | 'large' | 'full';
    title?: string;
    content?: string;
    handleList?: HandleButton[];
    openBefore?(): void | JQueryPromise;
    openAfter?(): void;
}

export = class Modal {
    constructor(options: ModalOptions);
    close(time?: number): void;
    open(time?: number): void;
}