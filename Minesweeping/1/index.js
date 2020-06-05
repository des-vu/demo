function Mine(tr, td, mineNum) {
    this.tr = tr; //行数
    this.td = td; //列数
    this.mineNum = mineNum; //雷的数量
    this.squares = []; //存储所有的方块的信息，每个方块的坐标，二维数组，行和列
    this.tds = []; //存储所有单元格的DOM
    this.surplusMine = mineNum; //剩余雷的数量
    this.allRight = false; //右击标的小红旗是否全是雷
    this.parent = document.getElementsByClassName('gameBox')[0];
}

//生成n个不重复的数字
Mine.prototype.randomNum = function() {
    var square = new Array(this.tr * this.td); //生成长度为格子总数的空数组
    for (var i = 0; i < square.length; i++) {
        square[i] = i;
    }
    square.sort(function(a, b) {
        return 0.5 - Math.random();
    })
    return square.splice(0, this.mineNum);
}

Mine.prototype.init = function() {
    // console.log(this.randomNum());
    var rn = this.randomNum(); //雷在格子里的位置
    var n = 0; //用来找到格子对应的索引
    for (i = 0; i < this.tr; i++) {
        this.squares[i] = [];
        for (j = 0; j < this.td; j++) {
            // this.squares[i][j] = ;
            n++;
            //如果这个条件成立，说明现在循环到的这个索引在雷的数组里找到了
            if (rn.indexOf(n) != -1) {
                this.squares[i][j] = {
                    type: 'mine',
                    x: j,
                    y: i
                }
            } else {
                this.squares[i][j] = {
                    type: 'number',
                    x: j,
                    y: i,
                    value: 0
                }
            }
        }
        /* {
            type: 'mine',
            x: 0,
            y: 0,
        }
        {
            type: 'number',
            x: 0,
            y: 0,
            value: 2
        } */
    }
    //阻止右键默认事件
    this.parent.oncontextmenu = function() {
            return false;
        }
        // console.log(this.squares);
    this.updateNum();
    this.creatDom();
    //剩余雷数
    this.mineNumDom = document.getElementsByClassName('mineNum')[0];
    this.mineNumDom.innerHTML = this.mineNum;
}

//创建表格并添加到html中
Mine.prototype.creatDom = function() {
    var This = this;
    var table = document.createElement('table');
    for (var i = 0; i < this.tr; i++) { //行
        var domTr = document.createElement('tr');
        this.tds[i] = [];
        for (j = 0; j < this.td; j++) { //列
            var domTd = document.createElement('td');
            // domTd.innerHTML = 0;
            domTd.pos = [i, j]; //把格子对应的行与列存到格子身上，为了下面通过这个值去数组里取到对应的数据
            domTd.onmousedown = function() {
                This.play(event, this); //This是实例对象，this是点击的那个td
            }
            this.tds[i][j] = domTd; //把所有创建的td添加到数组当中
            /* if (this.squares[i][j].type == 'mine') {
                domTd.className = 'mine';
            } else {
                domTd.innerHTML = this.squares[i][j].value;
            } */
            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this.parent.innerHTML = ''; //避免多次点击创建多个
    this.parent.appendChild(table);
}

//找某个格子周围不是雷的方格
Mine.prototype.getAround = function(square) {
    var x = square.x;
    var y = square.y;
    var result = []; //把找到的格子坐标返回出去
    /* 
        x-1,y-1     x,y-1       x+1,y-1
        x-1,y       x,y         x+1,y
        x+1,y+1     x,y+1       x+1,y+1
    */
    //通过坐标去循环九宫格
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (
                i < 0 || //格子超出了左边的范围
                j < 0 || //格子超出了上边的范围
                i >= this.td || //格子超出了右边的范围
                j >= this.tr || //格子超出了下边的范围
                (i == x && j == y) || //当前循环的格子是自己
                this.squares[j][i].type == 'mine' //周围的格子是雷
            ) {
                continue;
            }
            result.push([j, i]); //以行与列的形式返回出去
        }
    }
    return result;
}

//更新所有的数字
Mine.prototype.updateNum = function() {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            //要更新的是雷周围的数字
            if (this.squares[i][j].type == 'number') {
                continue;
            }
            var num = this.getAround(this.squares[i][j]);
            // console.log(num);
            for (var k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1;
            }
        }
    }
    // console.log(this.squares);
}

Mine.prototype.play = function(e, obj) {
    var This = this;
    if (e.which == 1 && obj.className != 'flag') { //后面的条件是为了限制用户标完小红旗后就不能被左键点击
        //点击的是左键
        // console.log(obj);
        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        if (curSquare.type == 'number') {
            // 用户点到的是数字
            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];
            if (curSquare.value == 0) {
                /*  
                    用户点到数字0
                        1.显示自己
                        2.找四周
                            1.显示四周（如果四周的值不为0；那就显示到这里不需要再找了）
                            2.如果值为0
                                1.显示自己
                                2.找四周（如果四周的值不为0；那就显示到这里不需要再找了）
                                    1.显示自己
                                    2.找四周（如果四周的值不为0；那就显示到这里不需要再找了）
                  */
                obj.innerHTML = '';

                function getAllZero(square) {
                    var around = This.getAround(square); //找到了周围的n个格子
                    for (var i = 0; i < around.length; i++) {
                        // around[i]=[0,0]
                        var x = around[i][0]; //行
                        var y = around[i][1]; //列
                        This.tds[x][y].className = cl[This.squares[x][y].value];
                        if (This.squares[x][y].value == 0) {
                            //如果以某个格子为中心找到的格子值为0；那就需要接着调用函数（递归）
                            if (!This.squares[x][y].check) {
                                //给对应的td添加一个属性，这条属性用于决定这个格子有没有被找过，如果被找过的话，他的为true，下一次就不会再被找了
                                This.squares[x][y].check = true;
                                getAllZero(This.squares[x][y]);
                            }
                        } else {
                            // 值不为0
                            This.tds[x][y].innerHTML = This.squares[x][y].value;
                        }
                    }
                }
                getAllZero(curSquare);
            }
        } else {
            // 用户点到的雷
            this.gameOver(obj);
        }
    }
    // 用户点击的是右键
    if (e.which == 3) {
        // 如果点击的是一个数字，那就不能点击
        if (obj.className && obj.className != 'flag') {
            return;
        }
        obj.className = obj.className == 'flag' ? '' : 'flag'; //再次点击取消，切换class
        if (this.squares[obj.pos[0]][obj.pos[1]] == 'mine') {
            this.allRight = true; //用户标的小红旗背后都是雷
        } else {
            this.allRight = false;
        }
        if (obj.className == 'flag') {
            this.mineNumDom.innerHTML = --this.surplusMine;
        } else {
            this.mineNumDom.innerHTML = ++this.surplusMine;
        }
        if (this.surplusMine == 0) {
            //剩余雷的数量为0
            if (this.allRight) {
                alert('恭喜你，游戏通过');
            } else {
                alert('游戏失败');
                this.gameOver();
            }
        }
    }
}


//游戏失败函数
Mine.prototype.gameOver = function(clickTd) {
    /* 
        1.显示所有的雷
        2.取消所有格子的点击事件
        3.点击到的雷标红
    */
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'mine') {
                this.tds[i][j].className = 'mine';
            }
            this.tds[i][j].onmousedown = null;
        }
    }
    clickTd.style.backgroundColor = 'red';
}

// 上边button的功能
var bts = document.getElementsByTagName('button');
var mine = null; //用来存储生成的实例
var ln = 0; //用来处理当前选中的状态
var arr = [ //不同级别的行数列数雷数
    [9, 9, 10],
    [16, 16, 40],
    [28, 28, 99]
];
for (let i = 0; i < bts.length - 1; i++) {
    bts[i].onclick = function() {
        bts[ln].className = '';
        this.className = 'active';
        mine = new Mine(...arr[i]);
        mine.init();
        ln = i; //上一次
    }
}
bts[0].onclick(); //初始化一下
//重新开始
bts[3].onclick = function() {
    mine.init();
}

// var mine = new Mine(28, 28, 99);
// mine.init();