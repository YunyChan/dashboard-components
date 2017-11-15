var MVC = require('plugin-mvc');
var tpl = require('./tpl.html');

var AutoFullMaxKeyLength = 6;

function Table(conf) {
    this.conf = conf;
    this.target = conf.target;
    this.full = conf.full === undefined ? (conf.keys.length > AutoFullMaxKeyLength) :  conf.full;
    this.titles = conf.titles;
    this.render();
    if(conf.list){
        this.update(conf.list);
    }
}

Table.prototype = {
    doms: {
        table: '.c-table'
    },
    events: {

    },
    render: Render,
    renderHeader: RenderHeader,
    update: Update
}

module.exports = Table;

function Render() {
    var self = this;
    this.target.innerHTML = this.conf.tpl || tpl;
    MVC.View.render(this);

    var data = {
        headers: [],
        list: [],
        full: this.full,
        enableDetail: false,
        enableRemove: false,
        enableEdit: false
    };
    if(this.conf.data){
        for(var key in this.conf.data){
            data[key] = this.conf.data[key] || data[key];
        }
    }

    var methods = {
        headerClick: function(item){
        }
    };
    if(this.conf.methods){
        for(var key in this.conf.methods){
            methods[key] = methods[key] || this.conf.methods[key];
            if(key == 'detailClick'){
                data['enableDetail'] = true;
            }else if(key == 'removeClick'){
                data['enableRemove'] = true;
            }else if(key == 'editClick'){
                data['enableEdit'] = true;
            }
        }
    }

    this.table = new Vue({
        el: this.doms.table,
        data: data,
        methods: methods
    });

    this.renderHeader();
}

function RenderHeader(){
    var keys = this.conf.keys;
    var headers = [];
    for(var cnt = 0, len = keys.length; cnt < len; cnt++){
        var o = keys[cnt];
        if(typeof o == 'string'){
            headers.push({
                key: o,
                title: (this.titles && this.titles[o]) || o
            });
        }else{
            o['title'] = o['title'] || (this.titles && this.titles[o['key']]) || o['key'];
            headers.push(o);
        }
    }
    this.table.headers = headers;
}

function Update(list){
    this.table.list = list;
}