var $ = require('jquery');
var MVC = require('plugin-mvc');
var Switch = require('./../switch/main');

function Panel(conf) {
    this.target = conf.target;
    this.switch = conf.switch === undefined ? true : conf.switch; // switch启用与否
    this.conf = conf;
    this.default = conf.default == 'data' ? false : true;
    this.render();
};

Panel.prototype = {
    doms: {
        wrap: '.c-panel-wrap',
        header: null,
        switch: null,
        export: null,
        body: '.c-panel-bd'
    },
    events: {
        '.c-panel-export': function(dom, evt){
            var handler = this.conf['onExport'];
            handler && handler.call(this);
        }
    },
    render: Render,
    renderHeader: RenderHeader,
    renderSwitch: RenderSwitch,
    renderExport: RenderExport,
    onSwitchChange: OnSwitchChange,
}

module.exports = Panel;

function Render(){
    MVC.View.render(this);
    if(this.switch || this.conf['onExport']){
        this.renderHeader();
    }
}

function RenderHeader(){
    var header = document.createElement('div');
    header.className = 'c-panel-hd f-clear';
    this.doms.header = header;
    this.doms.wrap.insertBefore(header, this.doms.body);
    if(this.switch){
        this.renderSwitch();
    }
    if(this.conf['onExport']){
        this.renderExport();
    }
}

function RenderSwitch(){
    var that = this;
    var panelSwitch = this.doms.switch = document.createElement('span');
    panelSwitch.className = 'c-panel-switch';
    var switchCOMP = new Switch({
        target: panelSwitch,
        state: this.default,
        onText: '图表',
        offText: '数据',
        onChange: function(state){
            that.onSwitchChange(state);
        }
    });
    this.doms.header.appendChild(panelSwitch);
}

function RenderExport(){
    var btnExport = document.createElement('a');
    btnExport.className = 'c-panel-export';
    btnExport.href = 'javascript:;';
    this.doms.header.appendChild(btnExport);
}

function OnSwitchChange(state){
    var targetIDX = state === false ? 1 : 0;
    $(this.doms.body).find('.c-panel-tab-panel').each(function(idx){
        if(idx == targetIDX){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
    
    var handler = this.conf['onChange'];
    handler && handler.call(this, targetIDX);
}