var MVC = require('mvc');
var tpl = require('./tpl.html');
var Pager = require('./../../pager/main');
var Table = require('./../main');

function TableLocal(conf) {
    this.conf = conf;
    this.target = conf.target;
    this.pageSize = conf.pageSize || 15;
    this.render();
    if(conf.list){
        this.update(conf.list);
    }
}

TableLocal.prototype = {
    doms: {
        table: '.c-table-local-table',
        pager: '.c-table-local-pager'
    },
    events: {

    },
    render: Render,
    update: Update,
    onPageChange: OnPageChange
}

function Render() {
    var self = this;
    this.target.innerHTML = tpl;
    MVC.View.render(this);

    this.table = new Table({
        target: this.doms.table,
        tpl: this.conf.tpl,
        keys: this.conf.keys,
        full: this.conf.full,
        list: this.conf.list,
        data: this.conf.data,
        chinese: this.conf.chinese,
        methods: this.conf.methods
    });

    this.pager = new Pager({
        target: this.doms.pager,
        page: 1, // 从1开始
        size: this.pageSize,
        total: 1,
        onChange: function (pageNo) {
            self.onPageChange(pageNo);
        }
    });
}

function Update(list){
    this.list = list || [];
    this.pager.update({
        total: this.list.length,
        page: 1
    });
    this.onPageChange(1);
}

function OnPageChange(pageNo){
    var sublist = [];
    var start = (pageNo - 1) * this.pageSize;
    var end = pageNo * this.pageSize;
    if(this.list.length < end){
        end = this.list.length;
    }
    this.table.update(this.list.slice(start, end)); // 左闭右开
}

module.exports = TableLocal;