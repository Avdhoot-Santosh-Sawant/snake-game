

let cvs = document.getElementById("game");
let ctx = cvs.getContext("2d");

//  box size
const box = 20;

//fruit image
let fruit = new Image();
fruit.src = "./fruit.png";

fruit.onload = function () {
    ctx.drawImage(fruit, food.x, food.y, box, box);
};


//snake
let snake = [];

snake[0] = {
    x: 10 * box,
    y: 10 * box,
};
ctx.fillStyle = "green"
ctx.fillRect(snake[0].x, snake[0].y, box - 2, box - 2);
ctx.lineWidth = 2;
ctx.strokeStyle = "black";
ctx.strokeRect(snake[0].x, snake[0].y, box - 2, box - 2);


//create food

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
};


let score = 0;
let runing = false
let d;

document.addEventListener("keydown", direction);
function direction(event) {
    event.preventDefault()
    if (event.keyCode == 37 && d != "right") {
        // move left
        d = "left";

    } else if (event.keyCode == 38 && d != "down") {
        // move up
        d = "up";
    } else if (event.keyCode == 39 && d != "left") {
        // move right
        d = "right";
    } else if (event.keyCode == 40 && d != "up") {
        // move down
        d = "down";
    }



}


function draw() {

    ctx.drawImage(fruit, food.x, food.y, box, box);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "yellow";
        ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);
        ctx.lineWidth = 2;

        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box - 2, box - 2);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    if (d != undefined) {
        runing = true
        if (d == "left") {
            newHead.x = snakeX - box;
        } else if (d == "right") {
            newHead.x = snakeX + box;
        } else if (d == "up") {
            newHead.y = snakeY - box;
        } else if (d == "down") {
            newHead.y = snakeY + box;
        }

        if (
            newHead.x == -20 ||
            newHead.y == -20 ||
            newHead.x == 400 ||
            newHead.y == 400 ||
            collideSelf(newHead)
        ) {
            window.clearInterval(i);
            setTimeout(() => {
                alert(`Your Score :- ${score}` + " \n click ok to restart ");
                window.location.reload();
            }, 300);

            return;
        }

        let collision = collisionEat(newHead, food);
        if (collision) {
            let pos = newFruitPos();
            food.x = pos.x;
            food.y = pos.y;
            score++;
            document.getElementById("score").innerHTML = `Score :- ${score}`;
        }

        snake = [newHead, ...snake];

        if (collision === false) {
            let pop = snake.pop();
            ctx.fillStyle = "white";
            ctx.fillRect(pop.x, pop.y, box, box);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.strokeRect(pop.x, pop.y, box - 2, box - 2);
        }

        if (snake.length == 1) {
            ctx.fillStyle = "green";
            ctx.fillRect(newHead.x, newHead.y, box, box);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.strokeRect(newHead.x, newHead.y, box - 2, box - 2);
        }
    }
}

function collisionEat(newPos, food) {
    if (newPos.x === food.x && newPos.y === food.y) {
        return true;
    } else {
        return false;
    }
}

function collideSelf(newPos) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == newPos.x && snake[i].y == newPos.y) {
            return true;
        }
    }
    return false;
}

function newFruitPos() {
    let pos = {};
    pos.x = Math.floor(Math.random() * 19 + 1) * box;
    pos.y = Math.floor(Math.random() * 19 + 1) * box;

    if (collideSelf(pos)) {
        return newFruitPos();
    }

    return pos;
}

// speed for snake

let speed = 300;
let speedSelect = document.getElementById('speed')


if (window.localStorage.getItem('speed') === null) {
    window.localStorage.setItem('speed', JSON.stringify(300));
}
else {
    speed = JSON.parse(window.localStorage.getItem('speed'))

    let options = speedSelect.children

    for (let e of options) {
        if (e.getAttribute('selected')) {
            e.removeAttribute("selected")
        }
        if (Number(e.value) == speed) {
            e.setAttribute('selected', 'true')
        }
    }
}

let i = window.setInterval(draw, speed);


speedSelect.addEventListener('input', function (event) {
    if (runing === false) {
        speed = event.target.value.toString()
        speed = Number(speed)
        window.localStorage.setItem('speed', JSON.stringify(speed));
        window.clearInterval(i)
        i = window.setInterval(draw, speed)
    }
})

