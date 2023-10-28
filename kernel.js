/* Windows 9 系统内核 */

function UpdateTime() {
    var date = new Date();
    var now = date.getHours() + ":" + (date.getMinutes().toString().length == 1 ? ('0' + date.getMinutes().toString()) : date.getMinutes().toString()) + ":" + (date.getSeconds().toString().length == 1 ? ('0' + date.getSeconds().toString()) : date.getSeconds().toString()) + "\n" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    document.getElementById('taskbar-time-show').innerText = now;
}


// 日期
setTimeout(() => {
    UpdateTime();
    setInterval(UpdateTime, 1000)
}, 1000 - (new Date()).getMilliseconds());
UpdateTime();


/* 窗口操作 */
function ShowWin(name) {
    if (!$('.window.' + name).hasClass('show')) {
        $('.window.' + name).toggleClass('show');
        if (!$('.window.' + name).hasClass('min')) {
            apps[name].init();
        }
    }
    if (!$('.window.' + name).hasClass('min')) {
        if (wins.indexOf(name) == -1) {
            wins.push(name);
            DrawTaskbar();
        }
    } else {
        $('.window.' + name).removeClass('min');
    }
}

function CloseWin(name) {
    $('.window.' + name).removeClass('show');
    wins.splice(wins.indexOf(name), 1);
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
    title_bar.addEventListener('dblclick', function () {
        MaxWin(window_.className.split(' ')[1]);
    });
    title_bar.addEventListener('mousedown', function (event) {
        mouseX = event.clientX - window_.offsetLeft;
        mouseY = event.clientY - window_.offsetTop;
        const name = window_.className.split(' ')[1];
        if ($('.window.' + name).hasClass('max')) {
            MaxWin(name);
            mouseX = window_.clientWidth / 2;
        }
        function MoveWin(event) {
            if ((event.clientX > 0))
                window_.style.left = (event.clientX - mouseX) + 'px';
            if ((event.clientY > 0))
                window_.style.top = (event.clientY - mouseY) + 'px';
        };
        page.addEventListener('mousemove', MoveWin);
        page.addEventListener('mouseup', function (event) {
            page.removeEventListener('mousemove', MoveWin);
            if (window_.style.top.substring(0, 1) == '-') {
                MaxWin(name);
            }
        });
    });
}

var wins = [];

function DrawTaskbar() {
    $('.taskbar>.taskbar-icons>div').html(``);
    wins.forEach((item) => {
        $('.taskbar>.taskbar-icons>div').append(`<icon onclick="MinOrShowWin('${item}')" title='${$('.window.' + item + '>.title-bar>p.win9-title-text')[0].innerText}'>${$('.window.' + item + '>.title-bar>icon')[0].innerHTML}</icon>`);
    });
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


let window_pos = {};

let apps = {
    setting: {
        init: () => {
            let items = document.querySelectorAll('.win9-setting>.left>.item>a.items');
            for (let i = 0; i < items.length; i++) {
                items[i].addEventListener('click', () => {
                    let items = document.querySelectorAll('.win9-setting>.left>.item>a.items');
                    for (var j = 0; j < items.length; j++) {
                        items[j].classList.remove('checked');
                    }
                    items[i].classList.toggle('checked');
                });
            }
        }
    }
};
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

function ShowDesktop(){
    for (var i = 0; i < windows.length; i++) {
        let win = windows[i];
        let name = win.className.split(' ')[1];
        MinWin(name);
    }
}


