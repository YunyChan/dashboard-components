require('./style.scss');
var MVC = require('plugin-mvc');
var tpl = require('./tpl.html');

function Tag(conf) {
    this.target = conf.target;
    this.conf = conf;
    this.state = null;
    this.render();
    this.change(conf.state === undefined ? false : conf.state);
};

Tag.prototype = {
    doms: {
        main: '.c-switch',
        btnOn: '.c-switch-btn-on',
        btnOff: '.c-switch-btn-off'
    },
    events: {
        '.c-switch': function(){
            this.change(!this.state);
        }
    },
    beforeRender: BeforeRender,
    render: Render,
    renderBtn: RenderBtn,
    change: Change
}

module.exports = Tag;

function BeforeRender() {
    this.target.innerHTML = tpl;
}

function Render(){
    var self = this;
    MVC.View.render(this);
    this.renderBtn();
}

function RenderBtn(){
    this.doms.btnOn.innerText = this.conf.onText || '开';
    this.doms.btnOff.innerText = this.conf.offText || '关';
}

function Change(state){
    if(this.state === state){
        return;
    }
    this.state = state;
    if(state){
        this.doms.main.className = 'c-switch c-switch-on';
        this.doms.btnOn.className = 'c-switch-btn c-switch-btn-active c-switch-btn-on';
        this.doms.btnOff.className = 'c-switch-btn c-switch-btn-off';
    }else{
        this.doms.main.className = 'c-switch c-switch-off';
        this.doms.btnOn.className = 'c-switch-btn c-switch-btn-on';
        this.doms.btnOff.className = 'c-switch-btn c-switch-btn-active c-switch-btn-off';
    }
    var handler = this.conf['onChange'];
    handler && handler.call(this, this.state);
}
