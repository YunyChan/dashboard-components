require('./style.scss');
require('bootstrap-daterangepicker');
require('bootstrap-datepicker');
require('bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min');
var $ = require('jquery');
var MVC = require('plugin-mvc');
var tpl = require('./tpl.html');
var moment = require('moment');

function RangePicker(conf) {
    this.conf = conf;
    this.target = conf.target;
    this.type = conf.type || 'date';
    if(this.type == 'date'){
        this.start = moment().subtract(7, 'd');
        this.end = moment().subtract(1, 'd');
    }else{
        this.start = moment();
        this.end = moment();
    }
    this.render();
}

RangePicker.prototype = {
    doms: {
        wrap: '.c-rangepicker-wrap',
        input: '.c-rangepicker-input',
        month: '.c-rangepicker-month',
        monthWrap: '.c-rangepicker-month-wrap',
        monthStartCalendar: '.c-rangepicker-month-start-calendar',
        monthEndCalendar: '.c-rangepicker-month-end-calendar',

        shortcutList: '.c-rangepicker-shortcut-list'
    },
    events: {
        '.c-rangepicker-shortcut-item': function (dom) {
            this.onShortcutClick(dom.getAttribute('data-range') - 0);
        },
        '.c-rangepicker-month-ok': function(){
            this.hideMonth();
            this.onChange();
            this.renderMonthRange();
        },
        '.c-rangepicker-month-cancel': function(){
            this.hideMonth();
            $(this.doms.monthStartCalendar).datepicker('update', this.start.format('YYYY-MM'));
            $(this.doms.monthEndCalendar).datepicker('update', this.end.format('YYYY-MM'));
        }
    },
    beforeRender: BeforeRender,
    render: Render,
    onShortcutClick: OnShortcutClick,
    onChange: OnChange,
    getRange: GetRange,

    renderDate: RenderDate,

    renderMonth: RenderMonth,
    renderMonthRange: RenderMonthRange,
    hideMonth: HideMonth
}

module.exports = RangePicker;

function BeforeRender() {
    this.target.innerHTML = tpl;
};

function Render() {
    var that = this;
    MVC.View.render(this);
    if(this.type == 'date'){
        this.renderDate();
    }else{
        this.renderMonth();
    }
    this.onChange(true);
};

function OnShortcutClick(range) {
    if (this.currentRange === range) {
        return;
    }
    this.currentRange = range;
    $(this.doms.shortcutList).find('.c-rangepicker-shortcut-item').each(function () {
        if (this.getAttribute('data-range') - 0 === range) {
            this.className = 'c-rangepicker-shortcut-item c-rangepicker-shortcut-item-active';
        } else {
            this.className = 'c-rangepicker-shortcut-item';
        }
    });

    if (range === 0) {
        this.$input.data('daterangepicker').setStartDate(moment());
        this.$input.data('daterangepicker').setEndDate(moment());
    } else if (range == 1) {
        this.$input.data('daterangepicker').setStartDate(moment().subtract(1, 'd'));
        this.$input.data('daterangepicker').setEndDate(moment().subtract(1, 'd'));
    } else if (range == 7) {
        this.$input.data('daterangepicker').setStartDate(moment().subtract(7, 'd'));
        this.$input.data('daterangepicker').setEndDate(moment().subtract(1, 'd'));
    } else if (range == 30) {
        this.$input.data('daterangepicker').setStartDate(moment().subtract(30, 'd'));
        this.$input.data('daterangepicker').setEndDate(moment().subtract(1, 'd'));
    } else if (range == 90) {
        this.$input.data('daterangepicker').setStartDate(moment().subtract(90, 'd'));
        this.$input.data('daterangepicker').setEndDate(moment().subtract(1, 'd'));
    }
    this.onChange();
}

function OnChange(force) {
    var start = null;
    var end = null;
    if(this.type == 'date'){
        start = this.$input.data('daterangepicker').startDate;
        end = this.$input.data('daterangepicker').endDate;
        if (!force && this.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.end.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
            return
        }
    }else{
        start = moment($(this.doms.monthStartCalendar).datepicker('getDate'));
        end = moment($(this.doms.monthEndCalendar).datepicker('getDate'));
        if (!force && this.start.format('YYYY-MM') == start.format('YYYY-MM') && this.end.format('YYYY-MM') == end.format('YYYY-MM')) {
            return
        }
    }

    this.start = start;
    this.end = end;

    var handler = this.conf['onChange'];
    handler && handler.call(self, this.getRange());
}

function GetRange(){
    var range = {
        start: this.start,
        end: this.end
    }
    if(this.type == 'date'){
        range.startDate = this.start.format('YYYY-MM-DD');
        range.endDate = this.end.format('YYYY-MM-DD');
    }else{
        range.startMonth = this.start.format('YYYY-MM');
        range.endMonth = this.end.format('YYYY-MM');
    }
    return range;
}

function RenderDate(){
    var that = this;
    var conf = {
        parentEl: '.c-rangepicker',
        showDropdowns: false,
        showCustomRangeLabel: false,
        alwaysShowCalendars: true,
        ranges: {
            '昨天': [
                moment().subtract(1, 'd'),
                moment().subtract(1, 'd')
            ],
            '上周': [
                moment().subtract(1, 'weeks').startOf('isoWeek'),
                moment().subtract(1, 'weeks').endOf('isoWeek')
            ],
            '本周': [
                moment().startOf('isoWeek'),
                moment().endOf('isoWeek')
            ],
            '上月': [
                moment().subtract(1, 'months').startOf('month'),
                moment().subtract(1, 'months').endOf('month')
            ],
            '本月': [
                moment().startOf('month'),
                moment().endOf('month')
            ],
            '上季': [
                moment().subtract(1, 'quarters').startOf('quarter'),
                moment().subtract(1, 'quarters').endOf('quarter')
            ],
            '本季': [
                moment().startOf('quarter'),
                moment().endOf('quarter')
            ],
            '过去7天': [
                moment().subtract(7, 'd'),
                moment().subtract(1, 'd')
            ],
            '过去30天': [
                moment().subtract(30, 'd'),
                moment().subtract(1, 'd')
            ]
        },
        locale: {
            'format': 'YYYY-MM-DD',
            'separator': '至',
            'applyLabel': '确定',
            'cancelLabel': '取消',
            'fromLabel': 'From',
            'toLabel': 'To',
            'customRangeLabel': '自定义',
            'weekLabel': 'W',
            'daysOfWeek': [
                '日',
                '一',
                '二',
                '三',
                '四',
                '五',
                '六'
            ],
            'monthNames': [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
            ],
            'firstDay': 1
        },
        startDate: moment().subtract(7, 'd'),
        endDate: moment().subtract(1, 'd')
    }

    // 原生组件参数
    for (var key in this.conf.conf) {
        conf[key] = this.conf.conf[key];
    }

    // 确认处理
    var $input = this.$input = $(this.doms.input).daterangepicker(conf);
    $input.on('apply.daterangepicker', function (ev, picker) {
        that.onShortcutClick(null);
        that.onChange();
    });

    // 动画处理
    $input.on('show.daterangepicker', function(ev, picker) {
        var $dom = $(that.dom).find('.daterangepicker');
        $dom.addClass('animated fadeInDown');
        $dom.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $dom.removeClass('animated fadeInDown');
        });
    });
    $input.on('beforeHide.daterangepicker', function(ev, picker) {
        var $dom = $(that.dom).find('.daterangepicker');
        $dom.addClass('animated fadeOutUp');
        $dom.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $dom.removeClass('animated fadeOutUp');
            picker.__HideCallback();
        });
        picker.__HideCallback = true;
    });
}

function RenderMonth(){
    var that = this;
    $(this.doms.wrap).addClass('c-rangepicker-month');
    var $month = this.$month = $(this.doms.monthWrap);
    $month.datepicker({
        format: 'yyyy-mm',
        language: 'zh-CN',
        autoclose: true,
        minViewMode: 'months',
        inputs: [this.doms.monthStartCalendar, this.doms.monthEndCalendar]
    });

    $(this.doms.monthStartCalendar).datepicker('update', moment().format('YYYY-MM'));
    $(this.doms.monthEndCalendar).datepicker('update', moment().format('YYYY-MM'));

    $(this.doms.input).on('click', function(){
        $month.addClass('animated fadeInDown');
        $month.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $month.removeClass('animated fadeInDown');
        });
        $month.show();
    });
    this.renderMonthRange();
}

function RenderMonthRange(){
    var range = this.getRange();
    this.doms.input.value = range.startMonth + '至' + range.endMonth;
}

function HideMonth(){
    var that = this;
    this.$month.addClass('animated fadeOutUp');
    this.$month.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        that.$month.removeClass('animated fadeOutUp');
        that.$month.hide();
    });
}