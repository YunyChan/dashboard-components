require('./style.scss');
var $ = require('jquery');
var MVC = require('plugin-mvc');

function Tab(conf) {
    this.conf = conf;
    this.index = conf.default === undefined ? 0 : conf.default;
    this.singlePanel = true;
    this.render();
}

Tab.prototype = {
    doms: {
        header: '.c-tab-hd',
        body: '.c-tab-bd'
    },
    events: {
        '.c-tab-entry': function (dom, evt) {
            this.onEntryClick(dom.getAttribute('data-index') - 0);
        }
    },
    render: Render,
    onEntryClick: OnEntryClick,
    change: Change
}

module.exports = Tab;

function Render() {
    var that = this;
    MVC.View.render(this);

    $(this.doms.header).find('.c-tab-entry').each(function (index, item) {
        $(item).attr('data-index', index);
    });

    var panelsCount = 0;
    $(this.doms.body).find('.c-tab-panel').each(function (index, item) {
        $(item).attr('data-index', index);
        panelsCount ++;
        if(panelsCount > 1){
            that.singlePanel = false;
        }
    });

    this.change(this.index);
}

function OnEntryClick(index) {
    if (this.index == index) {
        return;
    }
    this.index = index;
    this.change(index);
}

function Change(index) {
    var self = this;
    var currentIndex = index === undefined ? this.index : index;
    var activeEntry = null;
    var activePanel = null;
    $(this.doms.header).find('.c-tab-entry').each(function (index, item) {
        if (index == currentIndex) {
            activeEntry = item;
            $(item).addClass('c-tab-entry-active');
        } else {
            $(item).removeClass('c-tab-entry-active');
        }
    });
    $(this.doms.body).find('.c-tab-panel').each(function (index, item) {
        if(self.singlePanel){
            activePanel = item;
            $(item).addClass('c-tab-panel-active');
        }else{
            if (index == currentIndex) {
                activePanel = item;
                $(item).addClass('c-tab-panel-active');
            } else {
                $(item).removeClass('c-tab-panel-active');
            }
        }
    });
    var handler = this.conf['onChange'];
    handler && handler.call(this, index, activePanel, activeEntry);
}