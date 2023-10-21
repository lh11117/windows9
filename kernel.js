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