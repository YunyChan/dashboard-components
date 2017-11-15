require('./style.scss');
var Odometer = require('odometer');
var MVC = require('plugin-mvc');
var tpl = require('./tpl.html');
var Vue = require('vue');
var $ = require('jquery');
var defaultIcon = require('./default.png');

var Colors = ['rgb(255, 94, 60)', 'rgb(121, 200, 12)', 'rgb(30, 187, 164)', 'rgb(30, 187, 164)', 'rgb(254, 148, 4)'];

function Summary(conf) {
    this.target = conf.target
    this.data = null;
    this.span = 12 / conf.cols;
    this.render(conf);
    if(conf.data){
        this.update(conf.data);
    }
}

Summary.prototype = {
    doms: {
        list: '.c-summary-list'
    },
    events: {

    },
    render: Render,
    update: Update,
    format: Format
}

module.exports = Summary;

function Render(conf) {
    var that = this;
    this.target.innerHTML = tpl;
    MVC.View.render(this);

    this.vue = new Vue({
        el: this.doms.list,
        data: {
            list: [],
            span: this.span
        }
    });
}

function Update(data){
    var that = this;
    this.data = this.format(data || []);
    this.vue.list = this.data;
    this.vue.$nextTick(function () {
        $(that.dom).find('.c-summary-item-value-num').each(function(idx, dom){
            var itm = that.data[idx];
            od = new Odometer({
                el: dom,
                value: itm.from
            });
            od.update(itm.value);
        });
    });
}

function Format(data){
    for(var cnt = 0, len = data.length; cnt < len; cnt++){
        var o = data[cnt];
        o.color = Colors[cnt % 5];
        o.from = '';
        for(var digit = 0, digitLen = ('' + o.value).length; digit < digitLen; digit++){
            o.from += '0';
        }
    }
    return data;
}