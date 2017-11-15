require('./style.scss');
var $ = require('jquery');
var MVC = require('plugin-mvc');

function Tab(conf) {
    this.conf = conf;
    this.index = conf.default === undefined ? 0 : conf.default;
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
    var self = this;

    MVC.View.render(this);

    $(this.doms.header).find('.c-tab-entry').each(function (index, item) {
        $(item).attr('data-index', index);
    });
    $(this.doms.body).find('.c-tab-panel').each(function (index, item) {
        $(item).attr('data-index', index);
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
    var entry = null;
    var panel = null;
    $(this.doms.header).find('.c-tab-entry').each(function (index, item) {
        if (index == currentIndex) {
            entry = item;
            $(item).addClass('c-tab-entry-active');
        } else {
            $(item).removeClass('c-tab-entry-active');
        }
    });
    if(this.conf.single){

    }
    $(this.doms.body).find('.c-tab-panel').each(function (index, item) {
        if(self.conf.single){
            $(item).addClass('c-tab-panel-active');
        }else{
            if (index == currentIndex) {
                panel = item;
                $(item).addClass('c-tab-panel-active');
            } else {
                $(item).removeClass('c-tab-panel-active');
            }
        }
    });
    var handler = this.conf['onChange'];
    handler && handler.call(this, index, panel, entry);
}