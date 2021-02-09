interface MessageOptions {
    content: string;
    type?: 'success' | 'fail';
    time: number;
}

export = class Message {
    constructor(options: MessageOptions);
}