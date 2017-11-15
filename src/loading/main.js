require('./style.scss');
var tpl = require('./tpl.html');

var LoadingCounter = 0;
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

module.exports = Loading;

function Render() {
    var mask = document.body.querySelector('.c-mask');
    var wrap = document.body.querySelector('.c-global-loading');
    if (mask && wrap) {
        if(mask.style.display == 'block' && wrap.style.display == 'block'){
            LoadingCounter ++;
        }
    }else{
        mask = document.createElement('div');
        mask.className = 'c-mask';
        document.body.appendChild(mask);

        wrap = document.createElement('div');
        wrap.className = 'c-global-loading';
        wrap.innerHTML = tpl;
        document.body.appendChild(wrap);
    }
    Mask = mask;
    Wrap = wrap;
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
    if(Mask.style.display == '' && Wrap.style.display == ''){

    }else{
        LoadingCounter--;
        if (LoadingCounter == 0) {
            Mask.style.display = '';
            Wrap.style.display = '';
        }
    }
    return this;
}