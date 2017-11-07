var $ = require('jquery');
var MVC = require('mvc');

function Panel(conf) {
    this.target = conf.target;
    this.conf = conf;
    this.current = -1;
    this.render();
};

Panel.prototype = {
    doms: {
        tab: '.c-panel-tab',
        body: '.c-panel-bd'
    },
    events: {
        '.c-panel-tab-entry': function(dom, evt){
            var idx = dom.getAttribute('data-idx') - 0;
            this.onTabChange(idx);
        }
    },
    render: Render,
    renderTab: RenderTab,
    onTabChange: OnTabChange
}

function Render(){
    MVC.View.render(this);
    this.renderTab();
}

function RenderTab(){
    if(this.doms.tab){
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
    $(this.doms.body).find('.c-panel-wrap').each(function(idx){
        if(idx == targetIdx){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
}

module.exports = Panel;