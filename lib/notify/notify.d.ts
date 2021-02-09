interface HandleButton {
    text: string;
    isPrimary?: boolean;
    callback?(): void;
}

interface NotifyOptions {
    handleList?: HandleButton[];
    content: string;
}

export = class Notify {
    constructor(options: NotifyOptions);
}