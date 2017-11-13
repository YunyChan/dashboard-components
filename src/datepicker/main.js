require('./style.scss');
require('daterangepicker');
var $ = require('jquery');
var MVC = require('plugin-mvc');
var tpl = require('./tpl.html');
var moment = require('moment');

function DatePicker(conf) {
    this.conf = conf;
    this.target = conf.target;
    this.render();
}

DatePicker.prototype = {
    doms: {
        input: '.c-datepicker-input',
        shortcutList: '.c-datepicker-shortcut-list'
    },
    events: {
        '.c-datepicker-shortcut-item': function (dom) {
            this.onShortcutClick(dom.getAttribute('data-range') - 0);
        }
    },
    beforeRender: BeforeRender,
    render: Render,
    onShortcutClick: OnShortcutClick,
    onChange: OnChange,
    getRange: GetRange
}

function BeforeRender() {
    this.target.innerHTML = tpl;
};

function Render() {
    var self = this;
    MVC.View.render(this);
    var conf = {
        parentEl: '.c-datepicker',
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
        startDate: moment().startOf('isoWeek'),
        endDate: moment().endOf('isoWeek')

    }
    for (var key in this.conf.conf) {
        conf[key] = this.conf.conf[key];
    }
    this.$input = $(this.doms.input).daterangepicker(conf);
    this.$input.on('apply.daterangepicker', function (ev, picker) {
        self.onShortcutClick(null);
        self.onChange();
    });

    this.onChange();
};

function OnShortcutClick(range) {
    if (this.currentRange === range) {
        return;
    }
    this.currentRange = range;
    $(this.doms.shortcutList).find('.c-datepicker-shortcut-item').each(function () {
        if (this.getAttribute('data-range') - 0 === range) {
            this.className = 'c-datepicker-shortcut-item c-datepicker-shortcut-item-active';
        } else {
            this.className = 'c-datepicker-shortcut-item';
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

function OnChange() {
    var startDate = this.$input.data('daterangepicker').startDate.format('YYYY-MM-DD');
    var endDate = this.$input.data('daterangepicker').endDate.format('YYYY-MM-DD');
    if (this.startDate == startDate && this.endDate == endDate) {
        return
    }
    this.startDate = startDate;
    this.endDate = endDate;

    var handler = this.conf['onChange'];
    handler && handler.call(self, this.getRange());
}

function GetRange(){
    return {
        start: moment(this.startDate),
        end: moment(this.endDate),
        startDate: this.startDate,
        endDate: this.endDate
    }
}

module.exports = DatePicker;