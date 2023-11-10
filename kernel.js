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

// 日期
setTimeout(() => {
    UpdateTime();
    setInterval(UpdateTime, 1000)
}, 1000 - (new Date()).getMilliseconds());
UpdateTime();
document.getElementById('taskbar-time-show').style.visibility = 'visible'; /* 这样做是为了避免让用户看见vue代码 */


$('img').on('dragstart', () => {
    return false;
});

var isMouseDown = false;


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
    });
    window_.addEventListener('mousedown', function (event) {
        TopWin(name);
    });
    title_bar.addEventListener('mousedown', function (event) {
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
        MinOrShowWin(name);
    } else {
        if (!$(`.window.${name}`).hasClass('min')) {
            TopWin(name);
        } else {
            ShowWin(name);
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



let apps = {
    setting: {
        init: () => {
            let items = document.querySelectorAll('.win9-setting>.left>.item>a.items');
            let pages = document.querySelectorAll('.win9-setting>.right>.setting-page');
            for (let i = 0; i < items.length; i++) {
                items[i].addEventListener('click', () => {
                    for (var j = 0; j < items.length; j++) {
                        items[j].classList.remove('checked');
                    }
                    items[i].classList.toggle('checked');
                    apps.setting.gotoPage(items[i].classList[1]);
                });
            }
            apps.setting.gotoPage('activation');
        },
        gotoPage: (name) => {
            let pages = document.querySelectorAll('.win9-setting>.right>.setting-page');
            for (var j = 0; j < pages.length; j++) {
                pages[j].classList.remove('show');
            }
            try {
                document.querySelectorAll(`.win9-setting>.right>.setting-page.${name}`)[0].classList.toggle('show');
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
            apps.calc.element.value = Math.sqrt(Number(apps.calc.element.value)).toString();
        }
    }
};



