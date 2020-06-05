function Mine(row, col, number) {
    this.gameBox = document.getElementsByClassName('game-box')[0];
    this.span = document.getElementsByTagName('span')[0];
    this.row = row;
    this.col = col;
    this.number = number;
    this.domDiv = [];
    this.infoDiv = [];
    this.color = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    this.flagNumber = 0;
    this.mineNumber = number;
    this.keyNumber = 0;
}
Mine.prototype.createDom = function() {
    this.span.innerHTML = this.number;
    for (var i = 0; i < this.row; i++) {
        this.domDiv.push([]);
        this.infoDiv.push([]);
        for (var j = 0; j < this.col; j++) {
            var div = document.createElement('div');
            div.style.left = j * 22 + 'px';
            div.style.top = i * 22 + 'px';
            this.domDiv[i].push(div);
            this.infoDiv[i].push({
                r: i,
                c: j,
                value: 0
            });
            this.gameBox.appendChild(div);
        }
    }
    this.gameBox.style.width = this.row * 22 + 'px';
    this.gameBox.style.height = this.col * 22 + 'px';
};
Mine.prototype.randomMine = function() {
    var randomNum = [];
    for (var i = 0; i < this.row * this.col; i++) {
        randomNum.push(i);
    }
    randomNum.sort(function() {
        return 0.5 - Math.random();
    });
    randomNum = randomNum.splice(0, this.number);
    for (var i = 0; i < randomNum.length; i++) {
        var r = Math.floor(randomNum[i] / this.col);
        var c = randomNum[i] % this.col;
        this.infoDiv[r][c].value = -1;
        this.domDiv[r][c].value = 0;
        // this.domDiv[r][c].classList.add('mine');
    }
};
Mine.prototype.clickEvent = function() {
    var self = this;
    this.gameBox.onmousedown = function(e) {
        if (e.which == 1 && !e.target.classList.contains('flag')) {
            if (e.target.value == 0) {
                e.target.style.backgroundColor = 'red';
                self.gameBox.onmousedown = null;
                for (var i = 0; i < self.row; i++) {
                    for (var j = 0; j < self.col; j++) {
                        if (self.domDiv[i][j].classList.contains('flag')) {
                            self.domDiv[i][j].classList.remove('flag');
                        } else if (!(self.domDiv[i][j].value == 0)) {
                            continue;
                        }
                        self.domDiv[i][j].classList.add('mine');
                    }
                }
                setTimeout(function() {
                    alert('游戏失败');
                }, 100);
            } else if (!e.target.classList.contains('number')) {
                e.target.classList.add('number');
                self.keyNumber++;
                var r = e.target.offsetTop / 22;
                var c = e.target.offsetLeft / 22;
                self.aroundNumber(r, c);
                if (self.keyNumber == self.row * self.col - self.mineNumber && self.flagNumber == self.mineNumber - 1) {
                    setTimeout(function() {
                        alert('游戏胜利');
                    }, 200);
                    for (var i = 0; i < self.row; i++) {
                        for (var j = 0; j < self.col; j++) {
                            if (self.domDiv[i][j].classList.contains('flag')) {
                                self.domDiv[i][j].classList.remove('flag');
                            }
                            if (self.domDiv[i][j].value == 0) {
                                self.domDiv[i][j].classList.add('mine');
                            }
                        }
                    }
                    self.gameBox.onmousedown = null;
                } else if (self.keyNumber > self.row * self.col - self.mineNumber) {
                    self.gameBox.onmousedown = null;
                    setTimeout(function() {
                        alert('游戏失败');
                    }, 200);
                    for (var i = 0; i < self.row; i++) {
                        for (var j = 0; j < self.col; j++) {
                            if (self.domDiv[i][j].classList.contains('flag')) {
                                self.domDiv[i][j].classList.remove('flag');
                            }
                            if (self.domDiv[i][j].value == 0) {
                                self.domDiv[i][j].classList.add('mine');
                            }
                        }
                    }
                }
            }
        } else if (e.which == 3 && !e.target.classList.contains('number')) {
            if (!e.target.classList.contains('flag')) {
                e.target.classList.add('flag');
                self.number--;
                if (e.target.value == 0) {
                    self.flagNumber++;
                }
                if (e.target.value != 0) {
                    self.keyNumber += 2;
                }
            } else {
                e.target.classList.remove('flag');
                self.number++;
                if (e.target.value == 0) {
                    self.flagNumber--;
                }
                if (e.target.value != 0) {
                    self.keyNumber -= 2;
                }
            }
            self.span.innerHTML = self.number;
            if (self.number == 0) {
                if (self.flagNumber == self.mineNumber) {
                    setTimeout(function() {
                        alert('游戏胜利');
                    }, 200);
                } else {
                    setTimeout(function() {
                        alert('游戏失败');
                    }, 200);
                }
                self.gameBox.onmousedown = null;
                setTimeout(function() {
                    for (var i = 0; i < self.row; i++) {
                        for (var j = 0; j < self.col; j++) {
                            if (self.domDiv[i][j].classList.contains('flag')) {
                                self.domDiv[i][j].classList.remove('flag');
                            }
                            if (self.domDiv[i][j].value == 0) {
                                self.domDiv[i][j].classList.add('mine');
                            }
                        }
                    }
                }, 100);
            }
        }
    }
};
Mine.prototype.aroundNumber = function(r, c) {
    if (this.infoDiv[r][c].value != 0) {
        this.domDiv[r][c].innerHTML = this.infoDiv[r][c].value;
        this.domDiv[r][c].classList.add(this.color[this.infoDiv[r][c].value - 1]);
    } else {
        for (var i = r - 1; i <= r + 1; i++) {
            for (var j = c - 1; j <= c + 1; j++) {
                if (i >= 0 && j >= 0 && i < this.row && j < this.col && !this.domDiv[i][j].classList.contains('number')) {
                    this.domDiv[i][j].classList.add('number');
                    this.keyNumber++;
                    if (this.infoDiv[i][j].value != 0) {
                        this.domDiv[i][j].innerHTML = this.infoDiv[i][j].value;
                        this.domDiv[i][j].classList.add(this.color[this.infoDiv[i][j].value - 1]);
                    } else {
                        this.aroundNumber(i, j);
                    }
                }
            }
        }
    }
};
Mine.prototype.valueNumber = function() {
    for (var i = 0; i < this.row; i++) {
        for (var j = 0; j < this.col; j++) {
            if (this.infoDiv[i][j].value != -1) {
                for (var r = i - 1; r <= i + 1; r++) {
                    for (var c = j - 1; c <= j + 1; c++) {
                        if (r >= 0 && c >= 0 && r < this.row && c < this.col) {
                            if (this.infoDiv[r][c].value == -1) {
                                this.infoDiv[i][j].value++;
                            }
                        }
                    }
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
    this.clickEvent();
    this.valueNumber();
};
var btn = document.getElementsByClassName('btn');
var ln = 0;
var level = [
    [9, 9, 10],
    [16, 16, 40],
    [28, 28, 99]
];
var mine = new Mine(...level[0]);
mine.init();
for (let i = 0; i < btn.length; i++) {
    btn[i].onclick = function() {
        btn[ln].classList.remove('active');
        btn[i].classList.add('active');
        var mine = new Mine(...level[i]);
        mine.init();
        ln = i;
    }
}
var reset = document.getElementsByClassName('reset')[0];
reset.onclick = function() {
    var mine = new Mine(...level[ln]);
    mine.init();
}