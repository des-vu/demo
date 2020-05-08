function Mine(row, col, number) {
    this.gameBox = document.getElementsByClassName('game-box')[0];
    this.span = document.getElementsByTagName('span')[0];
    this.row = row;
    this.col = col;
    this.spanNumber = number;
    this.flagNumber = number;
    this.domDiv = [];
    this.randomNum = [];
    this.color = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
}
Mine.prototype.createDom = function() {
    for (var i = 0; i < this.row; i++) {
        this.domDiv.push([]);
        for (var j = 0; j < this.col; j++) {
            var div = document.createElement('div');
            div.style.left = j * 22 + 'px';
            div.style.top = i * 22 + 'px';
            this.gameBox.appendChild(div);
            this.domDiv[i].push(div);
            this.randomNum.push(i * this.col + j);
            this.clickEvent(div, i, j);
        }
    }
    this.gameBox.style.width = this.row * 22 + 'px';
    this.gameBox.style.height = this.col * 22 + 'px';
    this.span.innerHTML = this.spanNumber;
};
Mine.prototype.randomMine = function() {
    this.randomNum.sort(function() {
        return 0.5 - Math.random();
    }).splice(this.spanNumber);
    for (var i = 0; i < this.randomNum.length; i++) {
        var r = Math.floor(this.randomNum[i] / this.col);
        var c = this.randomNum[i] % this.col;
        this.domDiv[r][c].value = -1;
    }
};
Mine.prototype.clickEvent = function(dom, r, c) {
    var self = this;
    dom.onmousedown = function(e) {
        if (e.which == 1 && !dom.classList.contains('flag')) {
            if (dom.value == -1) {
                dom.style.backgroundColor = 'red';
                setTimeout(function() {
                    alert('游戏失败');
                }, 20);
                self.gameOver();
            } else if (!dom.classList.contains('number')) {
                dom.classList.add('number');
                self.valueNumber(r, c);
                self.aroundNumber(r, c);
            }
        } else if (e.which == 3 && !dom.classList.contains('number')) {
            if (!dom.classList.contains('flag')) {
                dom.classList.add('flag');
                self.spanNumber--;
                if (dom.value == -1) {
                    self.flagNumber--;
                }
            } else {
                dom.classList.remove('flag');
                self.spanNumber++;
                if (dom.value == -1) {
                    self.flagNumber++;
                }
            }
            self.span.innerHTML = self.spanNumber;
            if (self.spanNumber == 0) {
                if (self.flagNumber == 0) {
                    setTimeout(function() {
                        alert('游戏胜利');
                    }, 50);
                } else {
                    setTimeout(function() {
                        alert('游戏失败');
                    }, 50);
                }
                self.gameOver();
            }
        }
    }
};
Mine.prototype.gameOver = function() {
    for (var i = 0; i < this.row; i++) {
        for (var j = 0; j < this.col; j++) {
            this.domDiv[i][j].onmousedown = null;
            if (this.domDiv[i][j].classList.contains('flag')) {
                this.domDiv[i][j].classList.remove('flag');
            }
            if (this.domDiv[i][j].value == -1) {
                this.domDiv[i][j].classList.add('mine');
            }
        }
    }
};
Mine.prototype.aroundNumber = function(r, c) {
    if (this.domDiv[r][c].value != 0) {
        this.domDiv[r][c].innerHTML = this.domDiv[r][c].value;
        this.domDiv[r][c].classList.add(this.color[this.domDiv[r][c].value]);
    } else {
        for (var i = r - 1; i <= r + 1; i++) {
            for (var j = c - 1; j <= c + 1; j++) {
                if (i >= 0 && j >= 0 && i < this.row && j < this.col && !this.domDiv[i][j].classList.contains('number')) {
                    this.domDiv[i][j].classList.add('number');
                    this.valueNumber(i, j);
                    if (this.domDiv[i][j].value != 0) {
                        this.domDiv[i][j].innerHTML = this.domDiv[i][j].value;
                        this.domDiv[i][j].classList.add(this.color[this.domDiv[i][j].value]);
                    } else {
                        this.aroundNumber(i, j);
                    }
                }
            }
        }
    }
};
Mine.prototype.valueNumber = function(r, c) {
    this.domDiv[r][c].value = 0;
    for (var i = r - 1; i <= r + 1; i++) {
        for (var j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && j >= 0 && i < this.row && j < this.col && !this.domDiv[i][j].classList.contains('number')) {
                if (this.domDiv[i][j].value == -1) {
                    this.domDiv[r][c].value++;
                }
            }
        }
    }
};
Mine.prototype.init = function() {
    this.gameBox.innerHTML = '';
    document.oncontextmenu = function() {
        return false;
    };
    this.createDom();
    this.randomMine();
};
var btn = document.getElementsByTagName('button'),
    ln = 0,
    level = [
        [9, 9, 10],
        [16, 16, 40],
        [28, 28, 99]
    ];
var mine = new Mine(...level[0]);
mine.init();
for (let i = 0; i < 3; i++) {
    btn[i].onclick = function() {
        btn[ln].classList.remove('active');
        btn[i].classList.add('active');
        var mine = new Mine(...level[i]);
        mine.init();
        ln = i;
    }
}
btn[3].onclick = function() {
    var mine = new Mine(...level[ln]);
    mine.init();
}