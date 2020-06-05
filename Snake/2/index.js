var snakeWrap = document.getElementById('snake-wrap'),
    startBtn = document.getElementsByClassName('start-btn')[0],
    pauseBtn = document.getElementsByClassName('pause-btn')[0];
var row = 30,
    col = 30;
var snake = null,
    food = null,
    game = null;
//蛇的每一部分
function Square(x, y, name) {
    this.x = x;
    this.y = y;
    this.div = document.createElement('div');
    this.div.className = name;
}
Square.prototype.create = function() {
    this.div.style.left = this.x * 20 + 'px';
    this.div.style.top = this.y * 20 + 'px';
    snakeWrap.appendChild(this.div);
};
Square.prototype.remove = function() {
    this.div.remove();
};
//蛇
function Snake() {
    this.head = null;
    this.tail = null;
    this.pos = [];
    this.directionRun = {
        right: {
            x: 1,
            y: 0
        },
        left: {
            x: -1,
            y: 0
        },
        up: {
            x: 0,
            y: -1
        },
        down: {
            x: 0,
            y: 1
        }
    };
}
Snake.prototype.init = function() {
    var snakeHead = new Square(2, 0, 'snake-head');
    snakeHead.create();
    this.pos.push([2, 0]);
    this.head = snakeHead;
    var snakeBody1 = new Square(1, 0, 'snake-body');
    snakeBody1.create();
    this.pos.push([1, 0]);
    var snakeBody2 = new Square(0, 0, 'snake-body');
    snakeBody2.create();
    this.pos.push([0, 0]);
    this.tail = snakeBody2;
    //链表关系
    snakeHead.last = null;
    snakeHead.next = snakeBody1;
    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;
    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;
    this.direction = this.directionRun.right;
};
Snake.prototype.getNextPos = function() {
    var nextPos = [
        this.direction.x + this.head.x,
        this.direction.y + this.head.y
    ];
    //撞到墙
    if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] > col - 1 || nextPos[1] > row - 1) {
        this.strategies.die.call(this);
        return;
    }
    //食物
    if (food.x == nextPos[0] && food.y == nextPos[1]) {
        this.strategies.eat.call(this);
        return;
    }
    //撞到自己
    var self = this;
    this.pos.forEach(function(value) {
        if (value[0] == nextPos[0] && value[1] == nextPos[1]) {
            self.strategies.die.call(self);
            return;
        }
    });
    //继续走
    this.strategies.move.call(this);
};
Snake.prototype.strategies = {
    move: function(eatFood) {
        var newBody = new Square(this.head.x, this.head.y, 'snake-body');
        newBody.create();
        newBody.last = null;
        newBody.next = this.head.next;
        newBody.next.last = newBody;
        var newHead = new Square(this.direction.x + this.head.x, this.direction.y + this.head.y, 'snake-head');
        this.pos.unshift([this.direction.x + this.head.x, this.direction.y + this.head.y]);
        newHead.create();
        newHead.last = null;
        newHead.next = newBody;
        newBody.last = newHead;
        this.head.remove();
        this.head = newHead;
        if (!eatFood) {
            this.tail.remove();
            this.tail.next = null;
            this.tail = this.tail.last;
            this.pos.pop();
        }
    },
    eat: function() {
        this.strategies.move.call(this, true);
        food.remove();
        createFood();
        game.score++;
    },
    die: function() {
        game.over();
    }
};
snake = new Snake();

function createFood() {
    var x = null;
    var y = null;
    var include = true;
    while (include) {
        x = Math.round(Math.random() * (col - 1));
        y = Math.round(Math.random() * (row - 1));
        snake.pos.forEach(function(value) {
            if (x != value[0] && y != value[1]) {
                include = false;
            }
        });
    }
    food = new Square(x, y, 'food');
    food.create();
}

function Game() {
    this.timer = null;
    this.score = 0;
}
Game.prototype.start = function() {
    this.timer = setInterval(function() {
        snake.getNextPos();
    }, 200);
    document.onkeydown = function(e) {
        if (e.which == 37 && snake.direction != snake.directionRun.right) {
            snake.direction = snake.directionRun.left;
        } else if (e.which == 39 && snake.direction != snake.directionRun.left) {
            snake.direction = snake.directionRun.right;
        } else if (e.which == 38 && snake.direction != snake.directionRun.down) {
            snake.direction = snake.directionRun.up;
        } else if (e.which == 40 && snake.direction != snake.directionRun.up) {
            snake.direction = snake.directionRun.down;
        }
    };
};
Game.prototype.pause = function() {
    clearInterval(this.timer);
    document.onkeydown = null;
};
Game.prototype.over = function() {
    this.pause();
    alert('您的得分为：' + this.score);
    snakeWrap.innerHTML = '';
    snake = new Snake();
    game = new Game();
    startBtn.style.display = 'block';
};
Game.prototype.init = function() {
    snake.init();
    createFood();
};
game = new Game();
startBtn.onclick = function() {
    startBtn.style.display = 'none';
    game.start();
    game.init();
};
snakeWrap.onclick = function() {
    pauseBtn.style.display = 'block';
    game.pause();
};
pauseBtn.onclick = function() {
    pauseBtn.style.display = 'none';
    game.start();
};