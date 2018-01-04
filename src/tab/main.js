require('./style.scss');
var $ = require('jquery');
var MVC = require('plugin-mvc');

function Tab(conf) {
    this.conf = conf;
    this.index = conf.default === undefined ? 0 : conf.default;
    this.singlePanel = true;
    this.titles = conf.titles;
    this.entries = conf.entries ? this.formatEntries(conf.entries) : null;
    this.render();
}

Tab.prototype = {
    doms: {
        header: '.c-tab-hd',
        entries: '.c-tab-entries',
        body: '.c-tab-bd'
    },
    events: {
        '.c-tab-entry': function (dom, evt) {
            this.onEntryClick(dom.getAttribute('data-index') - 0);
        }
    },
    render: Render,
    formatEntries: FormatEntries,
    renderEntries: RenderEntries,
    onEntryClick: OnEntryClick,
    change: Change
}

module.exports = Tab;

function Render() {
    var that = this;
    MVC.View.render(this);
    if(this.entries){
        this.renderEntries(this.entries);
    }

    $(this.doms.header).find('.c-tab-entry').each(function (index, item) {
        $(item).attr('data-index', index);
        if(that.entries && that.entries[index].key){
            $(item).attr('data-key', that.entries[index].key);
        }
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

function FormatEntries(data){
    var entries = [];
    var activeIdx = -1;
    for(var cnt = 0, len = data.length; cnt < len; cnt++){
        var o = data[cnt];
        if(typeof o == 'string'){
            o = {
                key: o
            };
        }
        o.title = o.title || (this.titles && this.titles[o.key]) || '';
        if(o.active){
            activeIdx = cnt;
            o.active = true;
        }else{
            o.active = false;
        }
        entries.push(o);
    }
    if(entries.length > 0 && activeIdx == -1){
        entries[0].active = true;
        this.index = 0;
    }
    return entries;
}

function RenderEntries(entries){
    var header = document.createElement('div');
    header.className = 'c-tab-hd';

    var entryList = document.createElement('ul');
    entryList.className = 'c-tab-entries f-clear';
    var html = '';
    for(var cnt = 0, len = entries.length; cnt < len; cnt++){
        var entry = entries[cnt];
        var entryClass = 'c-tab-entry' + (entry.tip ? ' c-tip-anchor': '');
        var entryTip = entry.tip ? [
            '<div class="c-tip">',
                '<div class="c-tip-wrap">' + entry.tip + '</div>',
            '</div>'
        ].join('') : '';
        html += [
            '<li class="' + entryClass + '">',
                '<span class="c-tab-entry-txt">' + entry.title + '</span>',
                entryTip,
            '</li>'
        ].join('');
    }
    entryList.innerHTML = html;

    this.doms.header = header;
    this.doms.entries = entryList;
    header.appendChild(entryList);
    this.dom.insertBefore(header, this.doms.body);
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
    var currentKey = null;
    var activeEntry = null;
    var activePanel = null;
    $(this.doms.header).find('.c-tab-entry').each(function (index, item) {
        if (index == currentIndex) {
            activeEntry = item;
            currentKey = item.getAttribute('data-key');
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
    handler && handler.call(this, index, currentKey, {
        entry: activeEntry,
        panel: activePanel
    });
}