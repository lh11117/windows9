function addResize(query, minHeight = 44, minWidth = 400) {
    // 获取要调整大小的 div 元素
    const element = document.querySelectorAll(query)[0];

    // 定义边缘宽度为 10px
    const edgeWidth = 5;

    // 监听鼠标移动事件
    var setCursor = function (e) {
        // 获取 div 的宽度和高度
        const divWidth = element.offsetWidth;
        const divHeight = element.offsetHeight;

        // 计算鼠标距离 div 左侧和上侧的距离
        const xDiff = e.pageX - element.offsetLeft;
        const yDiff = e.pageY - element.offsetTop;

        // 判断鼠标位置是否在 div 的边缘
        const onLeftEdge = xDiff <= edgeWidth;
        const onRightEdge = xDiff >= divWidth - edgeWidth;
        const onTopEdge = yDiff <= edgeWidth;
        const onBottomEdge = yDiff >= divHeight - edgeWidth;

        // 设置鼠标样式
        if (onLeftEdge && onTopEdge || onRightEdge && onBottomEdge) {
            element.style.cursor = 'nwse-resize';
        } else if (onLeftEdge && onBottomEdge || onRightEdge && onTopEdge) {
            element.style.cursor = 'nesw-resize';
        } else if (onLeftEdge || onRightEdge) {
            element.style.cursor = 'e-resize';
        } else if (onTopEdge || onBottomEdge) {
            element.style.cursor = 'n-resize';
        } else {
            element.style.cursor = 'default';
        }
    }
    element.addEventListener('mousemove', setCursor);

    var cursor, startWidth, startHeight, screenStartX, screenStartY, startX, startY, resize, resizeDirection, canHeight, canWidth, setTop, setLeft;

    // 定义调整 div 大小的函数
    function resizeDiv(e) {
        // 计算鼠标在 div 中的位置
        const endX = e.clientX - element.offsetLeft;
        const endY = e.clientY - element.offsetTop;

        // 计算鼠标移动距离
        const moveX = endX - startX;
        const moveY = endY - startY;

        // 根据鼠标移动距离调整 div 大小
        if (canWidth)
            if (e.clientX >= 0 && !(screenStartX + startWidth < e.clientX))
                if (startWidth + moveX < minWidth) {
                    element.style.width = minWidth + 'px';
                } else {
                    element.style.width = startWidth + moveX + 'px';
                }
        if (canHeight)
            if (e.clientY >= 0 && !(screenStartY + startHeight < e.clientY))
                if (startHeight + moveY < minHeight) {
                    element.style.height = minHeight + 'px';
                } else {
                    element.style.height = startHeight + moveY + 'px';
                }


        if (setTop) {
            if (e.clientY >= 0 && !(screenStartY + startHeight < e.clientY)) {
                if (startHeight - e.clientY + screenStartY < minHeight) {
                    element.style.height = minHeight + 'px';
                } else {
                    element.style.height = startHeight - e.clientY + screenStartY + 'px';
                    element.style.top = e.clientY - startY + 'px';
                }
            }
        }

        if (setLeft) {
            if (e.clientX >= 0 && !(screenStartX + startWidth < e.clientX)) {
                if (startWidth - e.clientX + screenStartX < minWidth) {
                    element.style.width = minWidth + 'px';
                } else {
                    element.style.width = startWidth - e.clientX + screenStartX + 'px';
                    element.style.left = e.clientX - startX + 'px';
                }
            }
        }

        element.style.cursor = cursor;


        // 阻止默认事件和冒泡
        e.preventDefault();
        e.stopPropagation();
    }

    // 监听鼠标按下事件
    element.addEventListener('mousedown', function (e) {
        // 获取 div 的初始宽度和高度
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;

        // 获取鼠标在 div 中的位置
        startX = e.clientX - element.offsetLeft;
        startY = e.clientY - element.offsetTop;

        screenStartX = e.clientX;
        screenStartY = e.clientY;

        // 获取 div 的宽度和高度
        const divWidth = element.offsetWidth;
        const divHeight = element.offsetHeight;

        // 计算鼠标距离 div 左侧和上侧的距离
        const xDiff = e.pageX - element.offsetLeft;
        const yDiff = e.pageY - element.offsetTop;

        // 判断鼠标位置是否在 div 的边缘
        const onLeftEdge = xDiff <= edgeWidth;
        const onRightEdge = xDiff >= divWidth - edgeWidth;
        const onTopEdge = yDiff <= edgeWidth;
        const onBottomEdge = yDiff >= divHeight - edgeWidth;

        // 设置鼠标样式
        if (onLeftEdge && onTopEdge || onRightEdge && onBottomEdge) {
            element.style.cursor = 'nwse-resize';
            canHeight = true;
            canWidth = true;
            if (onLeftEdge && onTopEdge) {
                setTop = true, setLeft = true;
            } else {
                setTop = false, setLeft = false;
            }
        } else if (onLeftEdge && onBottomEdge || onRightEdge && onTopEdge) {
            element.style.cursor = 'nesw-resize';
            canHeight = true;
            canWidth = true;
            if (onLeftEdge && onBottomEdge) {
                setTop = false, setLeft = true;
            } else {
                setTop = true, setLeft = false;
            }
        } else if (onLeftEdge || onRightEdge) {
            element.style.cursor = 'e-resize';
            canHeight = false;
            canWidth = true;
            if (onLeftEdge) {
                setTop = false, setLeft = true;
            } else {
                setTop = false, setLeft = false;
            }
        } else if (onTopEdge || onBottomEdge) {
            element.style.cursor = 'n-resize';
            canHeight = true;
            canWidth = false;
            if (onTopEdge) {
                setTop = true, setLeft = false;
            } else {
                setTop = false, setLeft = false;
            }
        } else {
            element.style.cursor = 'default';
            canHeight = false;
            canWidth = false;
            setTop = false, setLeft = false;
        }
        cursor = element.style.cursor;

        if (onLeftEdge || onRightEdge || onTopEdge || onBottomEdge) {
            // 监听鼠标移动事件
            document.addEventListener('mousemove', resizeDiv);
            element.removeEventListener('mousemove', setCursor);

            // 阻止默认事件和冒泡
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // 监听鼠标抬起事件
    document.addEventListener('mouseup', function (e) {
        // 移除鼠标移动事件监听器
        document.removeEventListener('mousemove', resizeDiv);
        element.addEventListener('mousemove', setCursor);

        // 阻止默认事件和冒泡
        e.preventDefault();
        e.stopPropagation();
    });

}