const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const restartBtn = document.getElementById('restartBtn');
const speedSlider = document.getElementById('speedSlider');
const speedDisplay = document.getElementById('speedDisplay');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, food, score, dx, dy;
let gameLoop;

function init() {
    snake = [
        { x: 10 * gridSize, y: 10 * gridSize }
    ];
    food = getRandomFood();
    score = 0;
    dx = gridSize;
    dy = 0;
    scoreDisplay.textContent = score;
    
    // Clear previous game loop if exists
    if (gameLoop) clearInterval(gameLoop);
    
    // Start new game loop with current speed
    gameLoop = setInterval(() => {
        updateGame();
        drawGame();
    }, speedSlider.value);
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * tileCount) * gridSize,
        y: Math.floor(Math.random() * tileCount) * gridSize
    };
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
}

function updateGame() {
    const newHead = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // 检查是否吃到食物
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        food = getRandomFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);

    // 检查碰撞
    if (checkCollision()) {
        init();
    }
}

function checkCollision() {
    const head = snake[0];

    // 墙壁碰撞
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // 自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': if (dy !== gridSize) { dx = 0; dy = -gridSize; } break;
        case 'ArrowDown': if (dy !== -gridSize) { dx = 0; dy = gridSize; } break;
        case 'ArrowLeft': if (dx !== gridSize) { dx = -gridSize; dy = 0; } break;
        case 'ArrowRight': if (dx !== -gridSize) { dx = gridSize; dy = 0; } break;
    }
});

// Speed slider event listener
speedSlider.addEventListener('input', () => {
    const speed = speedSlider.value;
    speedDisplay.textContent = (300 / speed).toFixed(1) + 'x';
    init(); // Restart game with new speed
});

restartBtn.addEventListener('click', init);

// Initial game setup
init();