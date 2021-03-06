require('./src/style.scss');
require('bootstrap/dist/js/bootstrap.min');
var RangePicker = require('./src/rangepicker/main');
var Uploader = require('./src/form/uploader/main');
var Loading = require('./src/loading/main');
var Modal = require('./src/modal/main');
var Pager = require('./src/pager/main');
var Panel = require('./src/panel/main');
var Summary = require('./src/summary/main');
var Tab = require('./src/tab/main');
var Table = require('./src/table/main');
var TableLocal = require('./src/table/local/main');
var TableRemote = require('./src/table/remote/main');
var Tag = require('./src/tag/main');
var Switch = require('./src/switch/main');

module.exports = {
    RangePicker: RangePicker,
    Uploader: Uploader,
    Loading: Loading,
    Modal: Modal,
    Pager: Pager,
    Panel: Panel,
    Summary: Summary,
    Tab: Tab,
    Table: Table,
    TableLocal: TableLocal,
    TableRemote: TableRemote,
    Tag: Tag,
    Switch: Switch
}