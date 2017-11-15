require('./style.scss');
var $ = require('jquery');
var MVC = require('plugin-mvc');
var tpl = require('./tpl.html');
require('blueimp-file-upload');
var Loading = require('./../../loading/main');

function Uploader(conf) {
    this.conf = conf;
    this.defaultData = conf.data || {};
    this.render();
}

Uploader.prototype = {
    doms: {
        input: '.c-form-uploader-input',
        file: '.c-form-uploader-file',
        select: '.c-form-uploader-select'
    },
    render: Render,
    verify: Verify,
    submit: Submit,
    renderFile: RenderFile,
    onSuccess: OnSuccess,
    onError: OnError,
    reset: Reset,
    setData: SetData
}

module.exports = Uploader;

function Render() {
    var self = this;
    var target = MVC.View.getDOM(this.conf.target);
    target.innerHTML = tpl;
    MVC.View.render(this);

    var loading = null;
    $(this.doms.input).fileupload({
        autoUpload: false,
        url: this.conf.url,
        dataType: 'json',
        paramName: this.conf['paramName'] || 'file',
        add: function (e, data) {
            var file = data.files[0];
            var result = self.verify(file);
            if (result) {
                alert(result);
            } else {
                self.handler = data;
                self.renderFile(file.name);
            }
        },
        submit: function (e, data) {
            loading = new Loading().show();
        },
        done: function (e, data) {
            self.onSuccess(data.result);
        },
        fail: function (e, data) {
            self.onError();
        },
        always: function (e, data) {
            loading.hide();
        }
    });
}

function Verify(file) {
    var result = '';
    var types = this.conf.fileType;
    if (types) {
        for (var cnt = 0, len = types.length; cnt < len; cnt++) {
            var i = types[cnt];
            var exp = new RegExp(i + '$');
            if (exp.test(file.name)) {
                result = '';
                break;
            } else {
                result = '不支持的文件类型';
            }
        }
    }
    if (result) {
        return result;
    }
    var handler = this.conf['onVerify'];
    return handler && handler.call(this, file);
}

function Submit(params) {
    if (this.handler) {
        var data = {};
        for(var key in this.defaultData){
            data[key] = this.defaultData[key];
        }
        for (var key in params) {
            data[key] = params[key];
        }
        this.handler.formData = data;
        this.handler.submit();
    }
}

function RenderFile(fileName) {
    this.currentFile = fileName;
    this.doms.file.innerText = fileName;
}

function OnSuccess(result) {
    var handler = this.conf['onSuccess'];
    return handler && handler.call(this, result, this.currentFile);
}

function OnError() {
    var handler = this.conf['onError'];
    return handler && handler.call(this);
}

function Reset() {
    this.renderFile('');
    this.handler = null;
}

function SetData(data){
    for(var key in data){
        this.defaultData[key] = data[key]
    }
}