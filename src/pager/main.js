require('./style.scss');
var tpl = require('./tpl.html');
var Vue = require('vue');

function Pager(params) {
    this.params = params;
    this.isInited = false;
    this.itemTotal = params.total || 0;
    this.pageLength = params.size || 10;
    this.pageTotal = Math.ceil(this.itemTotal / this.pageLength) || 1;

    this.firstpageNo = params.start === undefined ? 1 : params.start;
    this.lastpageNo = this.pageTotal + (this.firstpageNo - 1);

    this.pageNo = params.page || this.firstpageNo || 0;

    this.visibleLength = params.visible || 5;
    this.url = (params.url && params.url.replace(/\s/g, '')) || 'javascript:;';

    this.pages = this.gerneratePages();

    this.render();
}

Pager.prototype = {
    render: Render,
    onFirst: OnFirst,
    onLast: OnLast,
    onPrev: OnPrev,
    onNext: OnNext,
    onChange: OnChange,
    change: Change,
    update: Update,
    gerneratePages: GerneratePages,
    getVisiblePages: GetVisiblePages,
    isShowLeftEllipsis: IsShowLeftEllipsis,
    isShowRightEllipsis: IsShowRightEllipsis
}


function Render() {
    var that = this;
    var dom = document.createElement('div');
    this.params.target.appendChild(dom);

    this.main = new Vue({
        el: dom,
        template: tpl,
        data: {
            itemTotal: this.itemTotal,
            pageTotal: 0,
            pageLength: this.pageLength,
            pageNo: 0,
            jumpPage: 1,

            visiblePages: [],
            firstPage: this.pages[this.firstpageNo - this.firstpageNo],
            lastPage: this.pages[this.lastpageNo - this.firstpageNo],
            prevPage: {
                num: 0,
                url: 'javascript:;'
            },
            nextPage: {
                num: 0,
                url: 'javascript:;'
            },

            prevDisable: false,
            nextDisable: false,
            leftEllipsis: false,
            rightEllipsis: false,
        },
        methods: {
            pageClick: function (pageNo) {
                that.change(pageNo);
                that.onChange(this.pageNo);
            },
            firstClick: function () {
                that.onFirst();
            },
            prevClick: function () {
                that.onPrev();
            },
            nextClick: function () {
                that.onNext();
            },
            lastClick: function () {
                that.onLast();
            },
            jumpClick: function(){
                if(this.jumpPage < this.firstPageNo){
                    this.jumpPage = this.firstPageNo;
                }
                if(this.jumpPage > this.lastpageNo){
                    this.jumpPage = this.lastpageNo;
                }
                that.change(this.jumpPage);
                that.onChange(this.pageNo);
            }
        }
    });
    this.change(this.pageNo);
    this.onChange(this.pageNo);
    this.isInited = true;
}

function OnFirst() {
    if (this.pageNo > this.firstpageNo) {
        this.change(this.firstpageNo);
        this.onChange(this.pageNo);
    }
}

function OnLast() {
    if (this.pageNo < this.lastpageNo) {
        this.change(this.lastpageNo);
        this.onChange(this.pageNo);
    }
}

function OnPrev() {
    if (this.pageNo > this.firstpageNo) {
        this.change(this.pageNo - 1);
        this.onChange(this.pageNo);
    }
}

function OnNext() {
    if (this.pageNo < this.lastpageNo) {
        this.change(this.pageNo + 1);
        this.onChange(this.pageNo);
    }
}

function OnChange() {
    if (this.isInited) {
        var handler = this.params.onChange;
        handler && handler.call(this, this.pageNo);
    }
}

function Change(pageNo) {
    this.pageNo = pageNo;
    // 改变视图
    this.main.pageNo = this.pageNo;
    this.main.visiblePages = this.getVisiblePages();
    this.main.prevDisable = this.pageNo == this.firstpageNo;
    this.main.nextDisable = this.pageNo == this.lastpageNo;

    this.main.prevPage = this.pages[(this.pageNo == this.firstpageNo ? this.firstpageNo : this.pageNo - 1) - this.firstpageNo];
    this.main.nextPage = this.pages[(this.pageNo == this.lastpageNo ? this.lastpageNo : this.pageNo + 1) - this.firstpageNo];

    this.main.leftEllipsis = this.isShowLeftEllipsis();
    this.main.rightEllipsis = this.isShowRightEllipsis();
}

/**
 * 
 * 更新页码
 * @param {any} params 
 * total和page是必传参数
 */
function Update(params) {
    this.itemTotal = params.total || 0;
    this.pageLength = params.size || this.pageLength;
    this.pageTotal = Math.ceil(this.itemTotal / this.pageLength) || 1;

    this.lastpageNo = this.pageTotal + (this.firstpageNo - 1);
    this.pages = this.gerneratePages();

    this.main.itemTotal = this.itemTotal;
    this.main.pageTotal = this.pageTotal;
    this.main.pageLength = this.pageLength;

    this.change(params.page);
}

function GerneratePages() {
    var pages = [];
    for (var cnt = this.firstpageNo; cnt <= this.lastpageNo; cnt++) {
        pages.push({
            num: cnt,
            url: this.url.replace('{{num}}', cnt)
        });
    }
    return pages;
}

function GetVisiblePages() {
    var halfVisibleLength = Math.floor(this.visibleLength / 2);
    var visibleStart = this.pageNo - halfVisibleLength >= this.firstpageNo ? (this.pageNo - halfVisibleLength) : this.firstpageNo;
    var visibleEnd = this.pageNo + halfVisibleLength <= this.lastpageNo ? (this.pageNo + halfVisibleLength) : this.lastpageNo;
    return this.pages.slice((visibleStart - this.firstpageNo), (visibleEnd - this.firstpageNo) + 1);
}

function IsShowLeftEllipsis() {
    var halfVisibleLength = Math.floor(this.visibleLength / 2);
    return this.pageNo - this.firstpageNo > halfVisibleLength;
}

function IsShowRightEllipsis() {
    var halfVisibleLength = Math.floor(this.visibleLength / 2);
    return this.lastpageNo - this.pageNo > halfVisibleLength;
}

module.exports = Pager;