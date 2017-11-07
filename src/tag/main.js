require('./style.scss');
var Vue = require('vue');
var MVC = require('mvc');
var tpl = require('./tpl.html');

function Tag(conf) {
    this.target = conf.target;
    this.conf = conf;
    this.chinese = conf.chinese;
    this.render();
    this.setData(conf.data);
    this.inited = true;
};

Tag.prototype = {
    beforeRender: BeforeRender,
    render: Render,
    formatData: FormatData,
    change: Change,
    setData: SetData
}

function BeforeRender() {
    this.target.innerHTML = tpl;
}

function Render(){
    var self = this;
    MVC.View.render(this);
    this.main = new Vue({
        el: this.dom,
        data: {
            tags: []
        },
        methods: {
            itemClick: function(tag){
                self.change(tag);
            }
        }
    });
}

function FormatData(data){
    var tags = [];
    var hasActive = false;
    for(var cnt = 0, len = data.length; cnt < len; cnt++){
        var o = data[cnt];
        if(typeof o == 'string'){
            o = {
                key: o
            };
        }
        o.title = o.title || (this.chinese && this.chinese[o.key]) || '';
        if(o.active){
            hasActive = true;
            o.active = true;
            this.current = o;
        }else{
            o.active = false;
        }
        tags.push(o);
    }
    if(tags.length > 0 && !hasActive){
        tags[0].active = true;
        this.current = tags[0];
    }
    return tags;
}

function Change(targetTag){
    var tags = this.main.tags;
    for(var cnt = 0, len = tags.length; cnt < len; cnt++){
        var tag = tags[cnt];
        tag.active = tag.key == targetTag.key;
    }
    this.current = targetTag;
    if(this.inited){
        var handler = this.conf['onChange'];
        handler && handler.call(this, targetTag);
    }
}

function SetData(data){
    this.current = null;
    this.data = this.formatData(data);
    this.main.tags = this.data;
    if(data.length > 0){
        this.change(this.current);
    }
}

module.exports = Tag;