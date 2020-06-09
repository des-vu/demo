var chess = document.getElementsByClassName('chess')[0];
var reset = document.getElementsByClassName('reset')[0];
var dom = [];
var key = true;
reset.onclick = function() {
    chess.innerHTML = '';
    init();
}

function init() {
    dom = [];
    key = true;
    for (var i = 0; i < 20; i++) {
        dom.push([]);
        for (var j = 0; j < 20; j++) {
            var div = document.createElement('div');
            div.style.left = j * 30 + 30 + 'px';
            div.style.top = i * 30 + 30 + 'px';
            div.classList.add('end');
            dom[i].push(div);
            chess.appendChild(div);
            bindEvent(div, i, j);
        }
    }
}
init();

function bindEvent(div, row, col) {
    div.onclick = function() {
        if (key) {
            div.style.background = 'radial-gradient(circle at 70% 30%, #45484d 1%, #000000 100%)';
            div.value = 1;
            key = false;
        } else {
            div.style.background = 'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 1) 0%, rgba(244, 244, 244, 1) 100%)';
            div.value = 2;
            key = true;
        }
        div.style.clipPath = 'circle(50% at center)';
        div.classList.add('hid');
        judgment(row, col);
        div.onclick = null;
    }
}

function judgment(row, col) {
    var result1 = 0,
        result2 = 0,
        result3 = 0,
        result4 = 0,
        value = dom[row][col].value;
    //水平方向
    for (var i = col; i > col - 5 && i >= 0; i--) {
        if (!dom[row][i].value || dom[row][i].value != value) {
            break;
        }
        result1++;
    }
    for (var i = col; i < col + 5 && i <= 19; i++) {
        if (!dom[row][i].value || dom[row][i].value != value) {
            break;
        }
        result1++;
    }
    //垂直方向
    for (var i = row; i > row - 5 && i >= 0; i--) {
        if (!dom[i][col].value || dom[i][col].value != value) {
            break;
        }
        result2++;
    }
    for (var i = row; i < row + 5 && i <= 19; i++) {
        if (!dom[i][col].value || dom[i][col].value != value) {
            break;
        }
        result2++;
    }
    //左上、右下方向
    var j = 0;
    for (var i = row; i > row - 5 && i >= 0 && col - j >= 0; i--) {
        if (!dom[i][col - j].value || dom[i][col - j].value != value) {
            break;
        }
        result3++;
        j++;
    }
    var j = 0;
    for (var i = row; i < row + 5 && i <= 19 && col + j <= 19; i++) {
        if (!dom[i][col + j].value || dom[i][col + j].value != value) {
            break;
        }
        result3++;
        j++;
    }
    //右上、左下方向
    var j = 0;
    for (var i = row; i > row - 5 && i >= 0 && col + j <= 19; i--) {
        if (!dom[i][col + j].value || dom[i][col + j].value != value) {
            break;
        }
        result4++;
        j++;
    }
    var j = 0;
    for (var i = row; i < row + 5 && i <= 19 && col - j >= 0; i++) {
        if (!dom[i][col - j].value || dom[i][col - j].value != value) {
            break;
        }
        result4++;
        j++;
    }
    //胜利
    if (result1 >= 6 || result2 >= 6 || result3 >= 6 || result4 >= 6) {
        setTimeout(function() {
            alert(value == 1 ? '黑棋胜利' : '白棋胜利');
        }, 20);
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                dom[i][j].onclick = null;
                dom[i][j].classList.remove('end');
            }
        }
    }
}