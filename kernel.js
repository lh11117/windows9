/* Windows 9 系统内核 */

const time = {
    data() {
        return {
            hour: null,
            minutes: null,
            seconds: null,
            year: null,
            month: null,
            day: null,
            weekday_text: null
        }
    }
}

taskbar_time = Vue.createApp(time).mount('#taskbar-time-show');
charm_time = Vue.createApp(time).mount('#charm-bar-datetime');
timedate_time = Vue.createApp(time).mount('#win9-timedate');

function UpdateTime() {
    var date = new Date();
    taskbar_time.hour = date.getHours();
    taskbar_time.minutes = (date.getMinutes().toString().length == 1 ? ('0' + date.getMinutes().toString()) : date.getMinutes().toString());
    taskbar_time.seconds = (date.getSeconds().toString().length == 1 ? ('0' + date.getSeconds().toString()) : date.getSeconds().toString());
    taskbar_time.year = date.getFullYear();
    taskbar_time.month = (date.getMonth() + 1);
    taskbar_time.day = date.getDate();
    charm_time.weekday_text = ((week) => { switch (week) { case 0: return "星期日"; case 1: return "星期一"; case 2: return "星期二"; case 3: return "星期三"; case 4: return "星期四"; case 5: return "星期五"; case 6: return "星期六"; } })(date.getDay());
    charm_time.hour = taskbar_time.hour;
    charm_time.minutes = taskbar_time.minutes;
    charm_time.month = taskbar_time.month;
    charm_time.day = taskbar_time.day;
}

/* 日期 */
setTimeout(() => {
    UpdateTime();
    setInterval(UpdateTime, 1000)
}, 1000 - (new Date()).getMilliseconds());
UpdateTime();
document.getElementById('taskbar-time-show').style.visibility = 'visible'; /* 这样做是为了避免让用户看见vue代码 */

/* 任务栏 -- 时间和日期 */
function GetMonthLastDay(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
    }
}

let date_checked_day = (new Date()).getDate();
function SetDateList(year, month) {
    var date = new Date();
    date.setFullYear(year);
    date.setDate(1);
    date.setMonth(month);
    var first_day = date.getDay();
    if (first_day == 0) {
        first_day = 7;
    }
    var element = $('.timedate>.dates');
    element.html(`<div class="line week"><a>周一</a><a>周二</a><a>周三</a><a>周四</a><a>周五</a><a>周六</a><a>周日</a></div><div class="line l1"></div>`);
    for (var i = 0; i < first_day - 1; i++) {
        $('.timedate>.dates>.line.l1').append('<a class="space"></a>')
    }
    for (var i = 0; i < 8 - first_day; i++) {
        $('.timedate>.dates>.line.l1').append(`<a class="date d${i + 1}">${i + 1}</a>`)
    }
    var day = 8 - first_day;
    var i;
    for (i = 0; day < GetMonthLastDay(year, month); i++) {
        var new_line = document.createElement('div');
        new_line.className = 'line l' + (i + 2);
        for (var j = 0; j < 7; j++) {
            day++;
            if (day > GetMonthLastDay(year, month)) {
                break;
            }
            var new_date = document.createElement('a');
            new_date.className = 'date d' + day;
            new_date.innerHTML = day.toString();
            new_line.appendChild(new_date);
        }
        document.querySelectorAll('.timedate>.dates')[0].appendChild(new_line);
    }
    while (i < 5) {
        var new_line = document.createElement('div');
        new_line.className = 'line l' + (i + 2);
        var new_date = document.createElement('a');
        new_date.className = 'space';
        new_line.appendChild(new_date);
        document.querySelectorAll('.timedate>.dates')[0].appendChild(new_line);
        i++;
    }
    $('.timedate>.dates>.line>a.date.d' + (new Date()).getDate()).addClass('today');
    $('.timedate>.dates>.line>a.date.d' + date_checked_day).addClass('checked');
    $('.timedate>.dates>.line>a.date').click((event) => {
        $('.timedate>.dates>.line>a.date').removeClass('checked');
        event.target.classList.add('checked');
        date_checked_day = parseInt(event.target.innerText);
        CheckShowToday(parseInt(event.target.innerText));
    });
    $('.timedate>.year-month-show>div.button-group>.date2today').click(() => {
        date_data = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1 }
        date_checked_day = (new Date()).getDate();
        SetDateList(date_data.year, date_data.month);
        CheckShowToday((new Date()).getDate());
    });
    timedate_time.year = year;
    timedate_time.month = month;
}

function CheckShowToday(day) {
    if (day == (new Date()).getDate() && (date_data.month == ((new Date()).getMonth() + 1))) {
        document.querySelectorAll('.timedate>.year-month-show>div.button-group>.date2today')[0].style.visibility = 'hidden';
    } else {
        document.querySelectorAll('.timedate>.year-month-show>div.button-group>.date2today')[0].style.visibility = 'visible';
    }
}

function ShoworHideTimedate() {
    var date_data = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1
    };
    SetDateList(date_data.year, date_data.month);
    var isShow = $('#win9-timedate').hasClass('show');
    $('#win9-timedate').removeClass('hide');
    $('#win9-timedate').toggleClass('show');
    if (isShow) {
        $('#win9-timedate').addClass('hide');
        setTimeout(() => {
            $('#win9-timedate').removeClass('hide');
        }, 100);
    }
}

function MonthUp() {
    if (--date_data.month < 1) {
        date_data.month = 12;
        date_data.year--;
    }
    SetDateList(date_data.year, date_data.month);
    CheckShowToday((new Date()).getDate());
}

function MouthDown() {
    if (++date_data.month > 12) {
        date_data.month = 1;
        date_data.year++;
    }
    SetDateList(date_data.year, date_data.month);
    CheckShowToday((new Date()).getDate());
}

var date_data = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1 };
$('.timedate>.year-month-show>div.button-group>.date2today').click();


$('img').on('dragstart', () => {
    return false;
});

var isMouseDown = false;

/* 菜单 */
let menus = {
    'win-title-bar-fill': function (args) { return [{ text: '最小化', js: 'MinWin(`' + args[0] + '`);', icon: '<i class="bi bi-dash-lg"></i>' }, { text: ($(`.window.${args[0]}`).hasClass('max') ? '还原' : '最大化'), js: 'MaxWin(`' + args[0] + '`);', icon: ($(`.window.${args[0]}`).hasClass('max') ? '<img src="imgs/normal-menu.svg"></img>' : '<i class="bi bi-square"></i>') }, 'split', { text: '关闭', js: 'CloseWin(`' + args[0] + '`);', icon: '<i class="bi bi-x" style="font-size: 12pt;"></i>' }] },
    'win-title-bar-nomax': function (args) { return [{ text: '最小化', js: 'MinWin(`' + args[0] + '`);', icon: '<i class="bi bi-dash-lg"></i>' }, 'split', { text: '关闭', js: 'CloseWin(`' + args[0] + '`);', icon: '<i class="bi bi-x" style="font-size: 12pt;"></i>' }] },
    'start-logo-menu': [{ text: '程序和功能', js: '' }, { text: '电源选项', js: '' }, { text: '事件查看器', js: '' }, { text: '系统', js: '' }, { text: '设备管理器', js: '' }, { text: '磁盘管理', js: '' }, { text: '计算器管理', js: '' }, { text: '命令提示符', js: '' }, { text: '命令提示符(管理员)', js: '' }, 'split', { text: '任务管理器', js: '' }, { text: '控制面板', js: '' }, { text: '文件资源管理器', js: '' }, { text: '搜索', js: '' }, { text: '运行', js: '' }, 'split', { text: '桌面', js: 'ShowDesktop();' }],
    'titlebar-showdesktop': [{ text: '<b>显示桌面</b>', js: 'ShowDesktop();' }, { text: '查看桌面', js: '' }],
    'start-power-menu': [{ text: '睡眠', js: '', icon: '<i class="bi bi-moon"></i>' }, { text: '重启', js: 'window.location.href=\'reboot.html\';', icon: '<i class="bi bi-arrow-clockwise"></i>' }]
}

function adjustElementPosition(el) {
    var rect = el.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom > viewportHeight ||
        rect.right > viewportWidth
    ) {
        // Element is out of viewport, adjust its position
        if (rect.bottom > viewportHeight) {
            el.style.bottom = `${viewportHeight - rect.top}px`;
            el.style.top = 'auto'; // Cancel the top property
        }
        if (rect.right > viewportWidth) {
            el.style.right = `${viewportWidth - rect.left}px`;
            el.style.left = 'auto'; // Cancel the left property
        }
        if (el.getBoundingClientRect().top < 0) {
            el.style.top = '0px';
        }
    }
}

function showMenu(name, event, args) {
    let menu_ = document.createElement('div');
    menu_.className = 'win9-menu';
    menu_.tabIndex = '-1';
    menu_.style.left = event.clientX + 'px';
    menu_.style.top = event.clientY + 'px';
    menu_.innerHTML = '';
    var menu = menus[name];
    if (!menu) {
        return true;
    }
    if (typeof (menu) == 'function') {
        menu = menu(args);
    }
    menu.forEach((item) => {
        if (item == 'split') {
            menu_.innerHTML += `<hr>`;
        } else if (!item || item == 'null') { } else {
            menu_.innerHTML += `<div class="win9-menu-item" onclick="${item.js.replace('"', '\\"')};$('.win9-menu').blur();"><icon>${item.icon ? item.icon : '<i class="bi bi-x" style="visibility: hidden;"></i>'}</icon>${item.text}</div>`;
        }
    });
    menu_.addEventListener("blur", function (event) {
        event.target.classList.add('hiding');
        setTimeout(() => {
            event.target.remove();
        }, 100);
    }, true);
    document.body.appendChild(menu_);
    adjustElementPosition(menu_);
    menu_.focus();
    return false;
}

document.oncontextmenu = function () {
    return false;
}

function StartMenuExec(func) {
    // This function can do every command in Start Menu!
    // Eg: `StartMenuExec('alert("Hello");');` or `StartMenuExec(()=>{alert("Hello");});`
    if ($('#start-menu').hasClass('show')) {
        ShoworHideStartMenu();
    }
    if (typeof (func) == 'function') {
        func();
    } else {
        eval(func);
    }
}

/* 通知 */
let notices = {
    'app-no-using': {
        /* 测试用 */
        title: '应用不可用',
        info: '敬请期待。',
        buttons: [['确定', 'CloseNotice();'], ['发表看法', 'CloseNotice();window.open(`https://github.com/lh11117/windows9/issues`);', '在 GitHub 上发表 Issue']]
    },
    'infos': {
        title: 'Windows 9 网页版',
        info: `此项目与微软没有任何关系！<br>
        Windows 9 网页版是一个开放源项目，<br>
        希望让用户在网络上体验传说中的 Windows 9，<br>
        并不是微软的产品，作者是 <a onclick="window.open('https://lh11117.github.io')" title="at github.com is lh11117, at 52pojie.cn is lccccccc" class="link">lh11117</a>。<br>
        使用标准网络技术，例如 HTML、CSS和JavaScript。<br>
        此项目绝不附属于微软，且不应与微软操作系统或产品混淆，<br>
        这也不是 Windows365 cloud PC<br>
        本项目中微软、Windows和其他示范产品是微软公司的商标。<br>`,
        buttons: [['确定', 'CloseNotice();'], ['GitHub', 'CloseNotice();window.open(`https://github.com/lh11117/windows9`);', 'https://github.com/lh11117/windows9']]
    },
    'calc.no-getanswer': {
        title: '运算有误',
        info: `提供的运算有误，无法进行计算！`,
        buttons: [['确定', 'CloseNotice();']]
    }
}

function CloseNotice() {
    $('#win9-notice').removeClass('show');
    $('#win9-notice').addClass('hide');
    setTimeout(() => {
        $('#win9-notice').removeClass('hide');
    }, 100);
}

function ShowNotice(name) {
    var notice = notices[name];
    $('#win9-notice').addClass('show');
    $('#win9-notice>.win9-notice-main>.texts>.title').html(notice.title);
    $('#win9-notice>.win9-notice-main>.texts>.info').html(notice.info);
    $('#win9-notice>.win9-notice-main>.texts>.buttons').html('');
    var i = 0;
    notice.buttons.forEach((item) => {
        $('#win9-notice>.win9-notice-main>.texts>.buttons').append(`<a class="win9-notice-button"${item[2] ? (` title="${item[2]}"`) : ""} tabindex="${notice.buttons.length - i}" onclick="${item[1].replace('"', '\\"')}">${item[0]}</a>`);
        i++;
    });
}

function getElementAbsolutePosition(element) {
    var x = 0;
    var y = 0;
    var node = element;
    while (node) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent;
    }
    return { x: x, y: y };
}


/* 窗口操作 */

let NoMax = ['calc', 'winver'];
let NoResize = ['calc', 'winver'];

function ShowWin(name) {
    if (!$('.window.' + name).hasClass('show')) {
        $('.window.' + name).toggleClass('show');
        if (!$('.window.' + name).hasClass('min')) {
            if (apps[name] && apps[name].init) {
                apps[name].init();
            }
        }
    }
    if (!$('.window.' + name).hasClass('min')) {
        if (wins.indexOf(name) == -1) {
            wins.push(name);
            windows_z_index.unshift(name);
            SetWindow_zIndex();
        }
    } else {
        $('.window.' + name).removeClass('min');
    }
}

function CloseWin(name) {
    var close = true;
    if (apps[name] && apps[name].onclose) {   // 支持窗口关闭事件
        close = apps[name].onclose();
    }
    if (close == false) {   // 如果返回 false，就阻止关闭事件
        return;
    }
    $('.window.' + name).removeClass('show');
    wins.splice(wins.indexOf(name), 1);
    windows_z_index.splice(windows_z_index.indexOf(name), 1);
    DrawTaskbar();
}

function MaxWin(name) {
    var cssid = 'animation-for-' + name;
    var css = document.getElementById(cssid);
    if (css == null) {
        var css = document.createElement('style');
        css.id = 'animation-for-' + name;
        document.body.appendChild(css);
    }
    var isMax = $('.window.' + name).hasClass('max');
    if (!isMax) {
        save_pos();
    }
    $('.window.' + name).toggleClass('max');
    if (!isMax) {
        $(`.window.${name}>.title-bar>.win9-windows-control-btn-group>.win9-windows-control-btn.max`).html('<img src="imgs/normal.svg"></img>');
        css.innerHTML = `@keyframes animation-${name} {
            0%{
                left: ${getElementAbsolutePosition(document.querySelectorAll('.window.' + name)[0]).x}px;
                top: ${getElementAbsolutePosition(document.querySelectorAll('.window.' + name)[0]).y}px;
                right: ${window.innerWidth - document.querySelectorAll('.window.' + name)[0].getBoundingClientRect().right}px;
                bottom: ${window.innerHeight - document.querySelectorAll('.window.' + name)[0].getBoundingClientRect().bottom}px;
            }
            100%{
                left: 0px;
                top: 0px;
                right: 0px;
                bottom: 44px;
            }
        }`;
        document.querySelectorAll('.window.' + name)[0].style.width = '';
        document.querySelectorAll('.window.' + name)[0].style.height = '';
        document.querySelectorAll('.window.' + name)[0].style.animation = `animation-${name} 0.1s linear`;
        setTimeout(() => {
            document.querySelectorAll('.window.' + name)[0].style.left = '0px';
            document.querySelectorAll('.window.' + name)[0].style.top = '0px';
            document.querySelectorAll('.window.' + name)[0].style.animation = '';
        }, 100);
    } else {
        $(`.window.${name}>.title-bar>.win9-windows-control-btn-group>.win9-windows-control-btn.max`).html('<i class="bi bi-square"></i>');
        css.innerHTML = `@keyframes animation-${name} {
            100%{
                left: ${getElementAbsolutePosition(document.querySelectorAll('.window.' + name)[0]).x}px;
                top: ${getElementAbsolutePosition(document.querySelectorAll('.window.' + name)[0]).y}px;
                width: ${window_pos[name].width};
                height: ${window_pos[name].height};
            }
            0%{
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
            }
        }`;
        document.querySelectorAll('.window.' + name)[0].style.animation = `animation-${name} 0.1s linear`;
        setTimeout(() => {
            document.querySelectorAll('.window.' + name)[0].style.left = window_pos[name].left;
            document.querySelectorAll('.window.' + name)[0].style.top = window_pos[name].top;
            document.querySelectorAll('.window.' + name)[0].style.width = window_pos[name].width;
            document.querySelectorAll('.window.' + name)[0].style.height = window_pos[name].height;
            document.querySelectorAll('.window.' + name)[0].style.animation = '';
        }, 100);
    }
}

function ShoworHideStartMenu() {
    var isShow = $('#start-menu').hasClass('show');
    $('#start-menu').removeClass('hide');
    $('#start-menu').toggleClass('show');
    if (isShow) {
        $('#start-menu').addClass('hide');
        setTimeout(() => {
            $('#start-menu').removeClass('hide');
        }, 100);
    }
}

var mouseX, mouseY;
const page = document.getElementsByTagName('html')[0];
const title_bars = document.querySelectorAll('.window>.title-bar>.win9-title-text');
const windows = document.querySelectorAll('.window');

for (var i = 0; i < windows.length; i++) {
    const window_ = windows[i];
    const title_bar = title_bars[i];
    const name = window_.className.split(' ')[1];
    const icon = document.querySelectorAll('.window>.title-bar>icon')[i];
    if (!NoMax.includes(window_.className.split(' ')[1])) {
        title_bar.addEventListener('dblclick', function () {
            MaxWin(name);
        });
    }
    icon.addEventListener('dblclick', function () {
        CloseWin(name);
        $('.win9-menu').blur();
    });
    window_.addEventListener('mousedown', function (event) {
        TopWin(name);
    });
    title_bar.addEventListener('mousedown', function (event) {
        if (event.button != 0) { return; }
        mouseX = event.clientX - window_.offsetLeft;
        mouseY = event.clientY - window_.offsetTop;
        function MoveWin(event) {
            if ((event.clientX > 0))
                window_.style.left = (event.clientX - mouseX) + 'px';
            if ((event.clientY > 0))
                window_.style.top = (event.clientY - mouseY) + 'px';
            //向下拖动窗口还原 
            if ($('.window.' + name).hasClass('max') && !NoMax.includes(name)) {
                MaxWin(name);
                mouseX = window_.clientWidth / 2;
            }
        };
        page.addEventListener('mousemove', MoveWin);
        page.addEventListener('mouseup', function (event) {
            page.removeEventListener('mousemove', MoveWin);
            if (window_.style.top.substring(0, 1) == '-') {
                if (NoMax.includes(name)) {
                    window_.style.top = '0px';
                } else {
                    MaxWin(name);
                }
            }
        });
    });
    function RightClickMenu(e) {
        if (NoMax.includes(name)) {
            showMenu('win-title-bar-nomax', e, [name]);
        } else {
            showMenu('win-title-bar-fill', e, [name]);
        }
    }
    title_bar.addEventListener('contextmenu', RightClickMenu);
    icon.addEventListener('contextmenu', RightClickMenu);
    icon.addEventListener('click', function (event) {
        var win_frame = document.querySelectorAll(`.window.${name}>.window-frame`)[0];
        pos = getElementAbsolutePosition(win_frame);
        var x = pos.x, y = pos.y;
        e = { clientX: x, clientY: y };
        RightClickMenu(e);
    });
    if (NoResize.indexOf(name) == -1) {
        addResize('.window.' + name);
    }
}

function is_in_element(event, element) {
    var div = element;
    var x = event.clientX
    var y = event.clientY
    var divx1 = div.offsetLeft
    var divy1 = div.offsetTop
    var divx2 = div.offsetLeft + div.offsetWidth
    var divy2 = div.offsetTop + div.offsetHeight
    return (x < divx1 || x > divx2 || y < divy1 || y > divy2)
}


var wins = [];
var windows_z_index = [];
var window_title = { edge: 'Microsoft Edge' };

function DrawTaskbar() {
    $('.taskbar>.taskbar-icons>div').html(``);
    $('.window').removeClass('foc');
    wins.forEach((item) => {
        if (windows_z_index.indexOf(item) == 0) {
            $(`.window.${item}`).addClass('foc');
        }
        $('.taskbar>.taskbar-icons>div').append(`<icon draggable="false" class="taskbar-icon ${item} ${(windows_z_index.indexOf(item) == 0 ? 'highlight' : '')}" onclick="TaskbarIconClick('${item}')" title='${window_title[item] ? window_title[item] : $('.window.' + item + '>.title-bar>p.win9-title-text')[0].innerText}'>${$('.window.' + item + '>.title-bar>icon')[0].innerHTML}</icon>`);
    });
}

function TopWin(name) {
    windows_z_index.splice(windows_z_index.indexOf(name), 1);
    windows_z_index.unshift(name);
    SetWindow_zIndex();
}

function TaskbarIconClick(name) {
    if (windows_z_index.indexOf(name) == 0) {
        MinWin(name);
        try {
            TopWin(windows_z_index[1]);
        } catch (e) { }
    } else {
        if (!$(`.window.${name}`).hasClass('min')) {
            TopWin(name);
        } else {
            ShowWin(name);
            TopWin(name);
        }
    }
}

function MinOrShowWin(name) {
    if (!$('.window.' + name).hasClass('min')) {
        MinWin(name);
    } else {
        ShowWin(name);
    }
}

function MinWin(name) {
    $('.window.' + name).removeClass('show');
    $('.window.' + name).addClass('min');
}

function SetWindow_zIndex() {
    windows_z_index.forEach((item, index) => {
        document.querySelectorAll('.window.' + item)[0].style.zIndex = windows_z_index.length - index + 10;
    });
    DrawTaskbar();
}


let window_pos = {};

function save_pos() {
    for (var i = 0; i < windows.length; i++) {
        let win = windows[i];
        let name = win.className.split(' ')[1];
        try {
            window_pos[name] = {
                left: win.style.left,
                top: win.style.top,
                height: win.style.height,
                width: win.style.width,
            }
        } catch (e) { }
    }
}

save_pos();

function ShowDesktop() {
    for (var i = 0; i < windows.length; i++) {
        let win = windows[i];
        let name = win.className.split(' ')[1];
        MinWin(name);
    }
}



/* app 数据 */
let apps = {
    setting: {
        init: () => {
            let items = document.querySelectorAll('.win9-setting>.left>.item>a.items');
            for (let i = 0; i < items.length; i++) {
                items[i].addEventListener('click', () => {
                    apps.setting.gotoPage(items[i].classList[1]);
                });
            }
            apps.setting.gotoPage('activation');
        },
        gotoPage: (name) => {
            let pages = document.querySelectorAll('.win9-setting>.right>.setting-page');
            let items = document.querySelectorAll('.win9-setting>.left>.item>a.items');
            for (var j = 0; j < pages.length; j++) {
                pages[j].classList.remove('show');
            }
            for (var j = 0; j < items.length; j++) {
                items[j].classList.remove('checked');
            }
            document.querySelectorAll(`.win9-setting>.left>.item>a.items.${name}`)[0].classList.add('checked');
            try {
                document.querySelectorAll(`.win9-setting>.right>.setting-page.${name}`)[0].classList.add('show');
            } catch (e) { return 1; }
            return 0;
        }
    },
    calc: {
        element: document.getElementById('calc-number-input'),
        key: null,
        num1: null,
        num2: null,
        init: () => {
            apps.calc.Clear();
        },
        ClickNumber: (n) => {
            /* 按下数字键 */
            if (apps.calc.element.value == "0") {
                apps.calc.element.value = "";
            }
            apps.calc.element.value += n.toString();
        },
        ClickPointer: () => {
            /* 按下小数点键 */
            if (apps.calc.element.value.includes('.')) {
                return;
            }
            apps.calc.element.value += '.';
        },
        ClickToolButton: (id) => {
            /* 当按下工具键（加、减、乘、除） 
             * 加: id=1 
             * 减: id=2
             * 乘: id=3
             * 除: id=4
             */
            switch (id) {
                case 1:
                case 2:
                case 3:
                case 4:
                    if (apps.calc.element.value.substring(apps.calc.element.value.length - 1, apps.calc.element.value.length) == '.') {
                        apps.calc.element.value = apps.calc.element.value.substring(0, apps.calc.element.value.length - 1)
                    }
                    if (apps.calc.num1 == null) {
                        apps.calc.num1 = Number(apps.calc.element.value);
                    } else {
                        apps.calc.num1 = apps.calc.DoCalc(apps.calc.num1, Number(apps.calc.element.value), apps.calc.key);
                        if (apps.calc.num1 == null) {
                            ShowNotice('calc.no-getanswer');
                            apps.calc.Clear();
                        }
                    }
                    apps.calc.key = id;
                    apps.calc.element.value = "0";
                    break;
                default:
                    break;
            }
        },
        DoCalc: (n1, n2, k) => {
            switch (k) {
                case 1:
                    return n1 + n2;
                case 2:
                    return n1 - n2;
                case 3:
                    return n1 * n2;
                case 4:
                    return (n2 == 0) ? null : (n1 / n2);
            }
        },
        GetAnswer: () => {
            if (apps.calc.num1 == null) {
                return;
            }
            apps.calc.num2 = Number(apps.calc.element.value);
            var answer = apps.calc.DoCalc(apps.calc.num1, apps.calc.num2, apps.calc.key);
            if (answer != null) {
                apps.calc.element.value = answer.toString();
            } else {
                ShowNotice('calc.no-getanswer');
            }
            apps.calc.num1 = null;
            apps.calc.num2 = null;
            apps.calc.key = null;
        },
        Clear: () => {
            apps.calc.element.value = "0";
            apps.calc.num1 = null;
            apps.calc.num2 = null;
            apps.calc.key = null;
        },
        Backspace: () => {
            apps.calc.element.value = apps.calc.element.value.substring(0, apps.calc.element.value.length - 1);
            if (apps.calc.element.value == "") {
                apps.calc.element.value = 0;
            }
        },
        Square: () => {
            apps.calc.element.value = Math.pow(Number(apps.calc.element.value), 2).toString();
        },
        SquareRoot: () => {
            if (apps.calc.element.value < 0) {
                ShowNotice('calc.no-getanswer');
                apps.calc.Clear();
            }
            apps.calc.element.value = Math.sqrt(Number(apps.calc.element.value)).toString();
        }
    },
    edge: {
        iframe: document.getElementById('edge-iframe'),
        input: document.getElementById('edge-path-input'),
        history: [],
        pre: [],
        init: () => {
            apps.edge.goto('https://www.bing.com')
        },
        goto: (link = apps.edge.input.value, remember_link = true) => {
            if (/^(https?:\/\/)?([\da-z.-]+|(?:\d{1,3}\.){3}\d{1,3})(:[\d]+)?([/\w .-]*)*(\?[\w%&=-]*)?(#[\w-]*)?$/.test(link)) {
                apps.edge.input.value = link;
                apps.edge.iframe.src = link;
                if (remember_link) {
                    if (link != apps.edge.history[apps.edge.history.length - 1])
                        apps.edge.history.push(link);
                    if ((apps.edge.history.length == 0) || (link != apps.edge.pre[apps.edge.history.length - 1]))
                        apps.edge.pre.push(link);
                    if (apps.edge.history.length > 1)
                        $('.win9-edge>.edge-path>i.bi.bi-arrow-left').addClass('enabled');
                    if (apps.edge.pre.length > 1)
                        $('.win9-edge>.edge-path>i.bi.bi-arrow-right').addClass('enabled');
                }
            } else {
                _link = 'https://www.bing.com/search?q=' + encodeURIComponent(link);
                apps.edge.input.value = _link;
                apps.edge.iframe.src = _link;
                if (remember_link) {
                    if (_link != apps.edge.history[apps.edge.history.length - 1])
                        apps.edge.history.push(_link);
                    if ((apps.edge.history.length == 0) || (_link != apps.edge.pre[apps.edge.history.length - 1]))
                        apps.edge.pre.push(_link);
                    if (apps.edge.history.length > 1)
                        $('.win9-edge>.edge-path>i.bi.bi-arrow-left').addClass('enabled');
                    if (apps.edge.pre.length > 1)
                        $('.win9-edge>.edge-path>i.bi.bi-arrow-right').addClass('enabled');
                }
            }
            apps.edge.setBackNextEnabled();
            console.log('history: ',apps.edge.history,'\npre:',apps.edge.pre);
        },
        setBackNextEnabled: () => {
            var retur = true;
            if (apps.edge.history.length <= 1) {
                $('.win9-edge>.edge-path>i.bi.bi-arrow-left').removeClass('enabled');
                retur = false;
            }
            if (apps.edge.pre.length <= 1) {
                $('.win9-edge>.edge-path>i.bi.bi-arrow-right').removeClass('enabled');
                retur = false;
            }
            return retur;
        },
        back: () => {
            if (!$('.win9-edge>.edge-path>i.bi.bi-arrow-left').hasClass('enabled')) {
                return;
            }
            apps.edge.pre.push(apps.edge.history.pop());
            link = apps.edge.history[apps.edge.history.length - 1];
            if (apps.edge.history.length <= 1) {
                $('.win9-edge>.edge-path>i.bi.bi-arrow-left').removeClass('enabled');
            }
            apps.edge.input.value = link;
            apps.edge.goto(link = link, remember_link = false);
        },
        next:()=>{
            if (!$('.win9-edge>.edge-path>i.bi.bi-arrow-right').hasClass('enabled')) {
                return;
            }
            apps.edge.history.push(apps.edge.pre.pop());
            link = apps.edge.pre[apps.edge.pre.length - 1];
            if (apps.edge.pre.length <= 1) {
                $('.win9-edge>.edge-path>i.bi.bi-arrow-right').removeClass('enabled');
            }
            apps.edge.input.value = link;
            apps.edge.goto(link = link, remember_link = false);
        }
    }
};

apps.edge.input.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        apps.edge.goto();
    }
});



/* 开机加载 */
function wininit() {
    page.addEventListener('mousemove', function (event) {
        if (window.innerWidth - event.clientX < 10 && ((window.innerHeight - event.clientY < 10) || (event.clientY < 10))) {
            if (!isMouseDown) {
                $('#charm-bar').addClass('show');
            }
        }
    });
    page.addEventListener('mousedown', function (event) {
        isMouseDown = true;
        if (window.innerWidth - event.clientX > document.getElementById('charm-bar').clientWidth) {
            if (is_in_element(event, document.querySelectorAll('#charm-bar>.charm-bar-datetime')[0])) {
                $('#charm-bar').removeClass('show');
                $('#charm-bar').addClass('hide');
                setTimeout(() => {
                    $('#charm-bar').removeClass('hide');
                }, 200);
            }
        }
    });
    page.addEventListener('mouseup', function (event) {
        isMouseDown = false;
    });

    if (!window.location.href.includes('127.0.0.1')) {
        ShowNotice('infos'); /* 显示信息 */
    }
}

var timer;
var canJump = false;
setTimeout(() => {
    canJump = true;
}, 5000);
window.onload = function () {
    if (canJump) {
        document.getElementById('winload').style.display = 'none';
        setTimeout(() => {
            document.getElementById('logonui').style.display = 'none';
            wininit();
        }, 5000);
    } else {
        setTimeout(window.onload, 5000);
    }
}

/* 检查到本地文件或 Live Server，跳过开机过程，避免开发浪费时间 */
if (window.location.href.includes('127.0.0.1')) {
    window.onload = function () { }
    document.getElementById('winload').style.display = 'none';
    document.getElementById('logonui').style.display = 'none';
    wininit();
}