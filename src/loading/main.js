require('./style.scss');
var tpl = require('./tpl.html');

var LoadingCounter = 0;
var Rendered = false;
var Mask = null;
var Wrap = null;

function Loading(conf) {
    this.conf = conf;
    this.render();
}

Loading.prototype = {
    render: Render,
    show: Show,
    hide: Hide
}

function Render() {
    if (Rendered) {
        return;
    }
    Mask = document.createElement('div');
    Wrap = document.createElement('div');
    Mask.className = 'c-mask';
    Wrap.className = 'c-global-loading';
    Wrap.innerHTML = tpl;
    document.body.appendChild(Mask);
    document.body.appendChild(Wrap);
    Rendered = true;
}

function Show() {
    LoadingCounter++;
    if (LoadingCounter == 1) {
        Mask.style.display = 'block';
        Wrap.style.display = 'block';
    }
    return this;
}

function Hide() {
    LoadingCounter--;
    if (LoadingCounter == 0) {
        Wrap.style.display = 'none';
        Mask.style.display = 'none';
    }
    return this;
}

module.exports = Loading;