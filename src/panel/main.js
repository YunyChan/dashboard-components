var $ = require('jquery');
var MVC = require('plugin-mvc');
var tabsHTML = require('./tabs.html');

function Panel(conf) {
    this.target = conf.target;
    this.tabs = conf.tabs === undefined ? true : conf.tabs;
    this.conf = conf;
    this.current = -1;
    this.render();
};

Panel.prototype = {
    doms: {
        wrap: '.c-panel-wrap',
        header: null,
        tab: null,
        export: null,
        body: '.c-panel-bd'
    },
    events: {
        '.c-panel-tab-entry': function(dom, evt){
            var idx = dom.getAttribute('data-idx') - 0;
            this.onTabChange(idx);
        },
        '.c-panel-export': function(dom, evt){
            var handler = this.conf['onExport'];
            handler && handler.call(this);
        }
    },
    render: Render,
    renderHeader: RenderHeader,
    renderTab: RenderTab,
    renderExport: RenderExport,
    onTabChange: OnTabChange
}

module.exports = Panel;

function Render(){
    MVC.View.render(this);
    if(this.tabs || this.conf['onExport']){
        this.renderHeader();
    }
}

function RenderHeader(){
    var header = document.createElement('div');
    header.className = 'c-panel-hd f-clear';
    this.doms.header = header;
    this.doms.wrap.insertBefore(header, this.doms.body);
    if(this.tabs){
        this.renderTab();
    }
    if(this.conf['onExport']){
        this.renderExport();
    }
}

function RenderTab(){
    this.doms.header.innerHTML = tabsHTML;
    this.doms.tab = this.doms.header.querySelector('.c-panel-tab');
    var $entries = $(this.doms.tab).find('.c-panel-tab-entry');
    if($entries.length > 0){
        var hasActiveTab = false;
        $entries.each(function(idx, itm){
            $(this).attr('data-idx', idx);
            if($(this).hasClass('active')){
                hasActiveTab = true;
                this.current = idx;
            }
        });
        if(!hasActiveTab){
            this.onTabChange(0);
        }
    }
}

function RenderExport(){
    var btnExport = document.createElement('a');
    btnExport.className = 'c-panel-export';
    btnExport.href = 'javascript:;';
    this.doms.header.appendChild(btnExport);
}

function OnTabChange(targetIdx){
    if(this.current == targetIdx){
        return;
    }
    this.current = targetIdx;
    $(this.doms.tab).find('.c-panel-tab-entry').each(function(){
        if((this.getAttribute('data-idx') - 0) == targetIdx){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });
    $(this.doms.body).find('.c-panel-tab-panel').each(function(idx){
        if(idx == targetIdx){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
    
    this.doms.tab.className = 'c-panel-tab ' + (targetIdx == 1 ? 'c-panel-tab-data' : 'c-panel-tab-chart');
    
    var handler = this.conf['onChange'];
    handler && handler.call(this, targetIdx);
}