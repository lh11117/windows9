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
    console.log(first_day)
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
    $('.timedate>.dates>.line>a.date.d' + (new Date()).getDate()).addClass('checked');
    $('.timedate>.dates>.line>a.date').click((event) => {
        $('.timedate>.dates>.line>a.date').removeClass('checked');
        event.target.classList.add('checked')
    });
    timedate_time.year = year;
    timedate_time.month = month;
}
var date_data = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1 }
SetDateList(date_data.year, date_data.month);


$('img').on('dragstart', () => {
    return false;
});

var isMouseDown = false;

/* 菜单 */
let menus = {
    'win-title-bar-fill': function (args) { return [['最小化', 'MinWin(`' + args[0] + '`);'], [$(`.window.${args[0]}`).hasClass('max') ? '还原' : '最大化', 'MaxWin(`' + args[0] + '`);'], 'split', ['关闭', 'CloseWin(`' + args[0] + '`);']] },
    'win-title-bar-nomax': function (args) { return [['最小化', 'MinWin(`' + args[0] + '`);'], 'split', ['关闭', 'CloseWin(`' + args[0] + '`);']] },
    'start-logo-menu': [['程序和功能', ''], ['电源选项', ''], ['事件查看器', ''], ['系统', ''], ['设备管理器', ''], ['磁盘管理', ''], ['计算器管理', ''], ['命令提示符', ''], ['命令提示符(管理员)', ''], 'split', ['任务管理器', ''], ['控制面板', ''], ['文件资源管理器', ''], ['搜索', ''], ['运行', ''], 'split', ['桌面', 'ShowDesktop();']],
    'titlebar-showdesktop': [['<b>显示桌面</b>', 'ShowDesktop();'], ['查看桌面', '']],
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
        } else {
            menu_.innerHTML += `<div class="win9-menu-item" onclick="${item[1].replace('"', '\\"')};$('.win9-menu').blur();">${item[0]}</div>`;
        }
    });
    menu_.addEventListener("blur", function (event) {
        event.target.remove();
    }, true);
    document.body.appendChild(menu_);
    adjustElementPosition(menu_);
    menu_.focus();
    return false;
}

document.oncontextmenu = function () {
    return false;
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
        并不是微软的产品，作者是 <a onclick="window.open('https://lh11117.github.io')" title="https://lh11117.github.io" class="link">lh11117</a>。<br>
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
/* 检查到本地文件或 Live Server，不显示信息，避免开发浪费时间 */
if (!window.location.href.includes('127.0.0.1')) {
    ShowNotice('infos'); /* 显示信息 */
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
    var isMax = $('.window.' + name).hasClass('max');
    if (!isMax) {
        save_pos();
    }
    $('.window.' + name).toggleClass('max');
    if (!isMax) {
        document.querySelectorAll('.window.' + name)[0].style.left = '0px';
        document.querySelectorAll('.window.' + name)[0].style.top = '0px';
        $(`.window.${name}>.title-bar>.win9-windows-control-btn-group>.win9-windows-control-btn.max`).html('<img src="imgs/normal.svg"></img>');
    } else {
        $(`.window.${name}>.title-bar>.win9-windows-control-btn-group>.win9-windows-control-btn.max`).html('<i class="bi bi-square"></i>');
        try {
            document.querySelectorAll('.window.' + name)[0].style.left = window_pos[name].left;
            document.querySelectorAll('.window.' + name)[0].style.top = window_pos[name].top;
        } catch (e) { }
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
        }
    }
});
page.addEventListener('mouseup', function (event) {
    isMouseDown = false;
});


var wins = [];
var windows_z_index = [];

function DrawTaskbar() {
    $('.taskbar>.taskbar-icons>div').html(``);
    wins.forEach((item) => {
        $('.taskbar>.taskbar-icons>div').append(`<icon draggable="false" class="taskbar-icon ${item} ${(windows_z_index.indexOf(item) == 0 ? 'high' : '')}" onclick="TaskbarIconClick('${item}')" title='${$('.window.' + item + '>.title-bar>p.win9-title-text')[0].innerText}'>${$('.window.' + item + '>.title-bar>icon')[0].innerHTML}</icon>`);
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
    }
};



