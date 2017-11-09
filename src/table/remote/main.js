var MVC = require('plugin-mvc');
var tpl = require('./tpl.html');
var Pager = require('./../../pager/main');
var Table = require('./../main');

function TableRemote(conf) {
    this.conf = conf;
    this.target = conf.target;
    this.pageSize = conf.pageSize || 15;
    this.render();
    this.onPageChange(1);
}

TableRemote.prototype = {
    doms: {
        table: '.c-table-remote-table',
        pager: '.c-table-remote-pager'
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
        data: this.conf.data,
        titles: this.conf.titles,
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

function Update(data){
    this.pager.update({
        total: data.total,
        page: data.page
    });
    this.table.update(data.list);
}

function OnPageChange(pageNo){
    var handler = this.conf.onChange;
    handler && handler.call(this, pageNo);
}

module.exports = TableRemote;