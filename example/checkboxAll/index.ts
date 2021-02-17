import $ from 'jquery';
import _ from 'underscore';

import CheckboxAll from '../../lib/checkboxAll/checkboxAll';

const all1 = new CheckboxAll({
    checkbox: $('#checkbox-group-1-all').get(0),
    findClassName: 'checkbox-group-1'
});


const $button1 = $('#button1');
const $button2 = $('#button2');
const $button3 = $('#button3');
const $wrap = $('#checkbox-group-1-wrap');
let i = 3;
const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

$button1.click(function () {
    console.log(all1.getValue());
});

$button2.click(() => {
    i ++;
    const value: string = list[i];
    const str = `<label><span>${value}</span><input type="checkbox" class="checkbox-group-1" value="${value}"></label>`;

    $wrap.append(str);
    //每当管理的 checkbox 有变化，需要调用 reset 方法，更新管理的内容，以及 all 的状态
    all1.reset();
});
