require('./style.scss');
var tpl = require('./tpl.html');

var LoadingCounter = 0;
var Wrap = null;
var Inited = false;

function Loading(conf) {
    this.conf = conf;
    this.render();
    Inited = true;
}

Loading.prototype = {
    render: Render,
    show: Show,
    hide: Hide
}

module.exports = Loading;

function Render() {
    var wrap = document.body.querySelector('.c-global-loading');
    if (wrap) {

    }else{
        wrap = document.createElement('div');
        wrap.className = 'c-global-loading';
        wrap.innerHTML = tpl;
        document.body.appendChild(wrap);
    }
    if(!Inited){
        if(wrap.style.display == 'block'){
            LoadingCounter ++;
        }
        Wrap = wrap;
    }
}

function Show() {
    LoadingCounter++;
    if (LoadingCounter == 1) {
        Wrap.style.display = 'block';
    }
    return this;
}

function Hide() {
    if(Wrap.style.display == ''){

    }else{
        LoadingCounter--;
        if (LoadingCounter == 0) {
            Wrap.style.display = '';
        }
    }
    return this;
}