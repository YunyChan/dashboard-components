require('./style.scss');
var $ = require('jquery');
var tpl = require('./tpl.html');
var MVC = require('plugin-mvc');

function Modal(conf) {
    this.conf = conf;
    this.title = conf.title || '提示';
    this.ok = conf.ok || '确认';
    this.animation = conf.animation || 'fade';
    this.className = conf.className;

    if (conf.doms) {
        var doms = this.doms;
        for (var key in conf.doms) {
            doms[key] = conf.doms[key];
        }
    }
    if (conf.events) {
        var events = this.events;
        for (var key in conf.events) {
            events[key] = conf.events[key];
        }
    }
    this.render();
}

Modal.prototype = {
    doms: {
        title: '.modal-title',
        body: '.modal-body',
        ok: '.c-modal-ok',
        close: '.c-modal-close',
        cancel: '.c-modal-cancel'
    },
    events: {
        '.c-modal-ok': function () {
            this.onOKClick();
        },
        '.c-modal-close': function () {
            this.onCancelClick();
        },
        '.c-modal-cancel': function () {
            this.onCancelClick();
        }
    },
    beforeRender: BeforeRender,
    render: Render,
    onOKClick: OnOKClick,
    onCancelClick: OnCancelClick,
    onClose: OnClose,
    onShow: OnShow,
    show: Show,
    hide: Hide,
    setTitle: SetTitle
}

function BeforeRender() {
    var dom = document.createElement('div');
    dom.className = 'c-modal modal';
    dom.innerHTML = tpl;
    dom.querySelector('.modal-body').innerHTML = this.conf.text;
    $(dom).addClass(this.className).addClass(this.animation)
    this.target = dom;
}

function Render() {
    MVC.View.render(this);

    this.doms.title.innerText = this.title;
    this.doms.ok.innerText = this.ok;
    document.body.appendChild(this.dom);

    var handler = this.conf['init'];
    handler && handler.call(this, this.conf);
}

function OnOKClick() {
    var handler = this.conf['onOK'];
    var result = handler && handler.call(this);
    if (result !== false) {
        this.onClose();
    }
}

function OnCancelClick() {
    var handler = this.conf['onCancel'];
    handler && handler.call(this);
    this.onClose();
}

function OnClose() {
    var handler = this.conf['onClose'];
    handler && handler.call(this);
    this.hide();
}

function OnShow() {
    var handler = this.conf['onShow'];
    handler && handler.apply(this, arguments);
}

function Show() {
    $(this.dom).modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
    this.onShow.apply(this, arguments);
}

function Hide() {
    var that = this;
    $(this.dom).modal('hide');
}

function SetTitle(title) {
    this.doms.title.innerText = title;
}

module.exports = Modal;