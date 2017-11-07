require('./style.scss');
var $ = require('jquery');
var tpl = require('./tpl.html');
var MVC = require('mvc');

function Modal(params) {
    this.params = params;
    this.title = params.title || '提示';
    this.ok = params.ok || '确认';
    this.animation = params.animation || 'fade';
    this.className = params.className;

    if (params.doms) {
        var doms = this.doms;
        for (var key in params.doms) {
            doms[key] = params.doms[key];
        }
    }
    if (params.events) {
        var events = this.events;
        for (var key in params.events) {
            events[key] = params.events[key];
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
    dom.querySelector('.modal-body').innerHTML = this.params.text;
    $(dom).addClass(this.className).addClass(this.animation)
    this.target = dom;
}

function Render() {
    MVC.View.render(this);

    this.doms.title.innerText = this.title;
    this.doms.ok.innerText = this.ok;
    document.body.appendChild(this.dom);

    var handler = this.params['init'];
    handler && handler.call(this, this.params);
}

function OnOKClick() {
    var handler = this.params['onOK'];
    var result = handler && handler.call(this);
    if (result !== false) {
        this.onClose();
    }
}

function OnCancelClick() {
    var handler = this.params['onCancel'];
    handler && handler.call(this);
    this.onClose();
}

function OnClose() {
    var handler = this.params['onClose'];
    handler && handler.call(this);
    this.hide();
}

function OnShow() {
    var handler = this.params['onShow'];
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