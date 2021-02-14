import $ from 'jquery';
import _ from 'underscore';

import Checkboxes from '../../lib/checkboxes/checkboxes';

const data1 = [
    {text: 'aaa', value: 'a'},
    {text: 'bbb', value: 'b'},
    {text: 'ccc', value: 'c'},
    {text: 'ddd', value: 'd'},
];

const data2 = [
    {text: 'eee', value: 'e'},
    {text: 'fff', value: 'f'},
    {text: 'ggg', value: 'g'},
    {text: 'hhh', value: 'h'},
];

const c1 = new Checkboxes({
    node: $('#checkbox-group-1').get(0),
    list: data1,
    onChange: value => {
        console.log('c1: ', value);
    }
});

const c2 = new Checkboxes({
    node: $('#checkbox-group-2').get(0),
    hasAll: false,
    list: data2,
    onChange: value => {
        console.log('c2: ', value);
    }
});
