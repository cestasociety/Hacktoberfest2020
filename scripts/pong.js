// Add a div with the id of #pong to load game
let canvas;
let canvasContext;
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;

let ballX = 50;
let ballSpeedX = 15;
let ballY = 50;
let ballSpeedY = 15;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
let playerPaddleY = 250;
let compPaddleY = 400;
const compSpeedY = 18;

const WINNING_SCORE = 30;
let winScreen = false;
let playerScore = 0;
let compScore = 0;

function calcualtePlayerPaddle(e) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = e.clientX - rect.left - root.scrollLeft;
  const mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

window.onload = () => {
  canvas = document.getElementById('pong');
  canvasContext = canvas.getContext('2d');
  canvasContext.canvas.width = GAME_WIDTH;
  canvasContext.canvas.height = GAME_HEIGHT;

  const FPS = 30;
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000 / FPS);

  canvas.addEventListener('mousemove', e => {
    const mousePos = calcualtePlayerPaddle(e);
    playerPaddleY = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function computerMovement() {
  const paddleCenter = compPaddleY + PADDLE_HEIGHT / 2;
  if (paddleCenter < ballY - 35) {
    compPaddleY += compSpeedY;
  } else if (paddleCenter > ballY + 35) {
    compPaddleY -= compSpeedY;
  }
}

function moveEverything() {
  if (winScreen) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  ballSpeedX;
  ballY += ballSpeedY;
  if (ballX < 0) {
    if (ballY > playerPaddleY && ballY < playerPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      const deltaY = ballY - (playerPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.5;
    } else {
      ++compScore;
      ballReset();
    }
  }
  if (ballX >= canvas.width) {
    if (ballY > compPaddleY && ballY < compPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      const deltaY = ballY - (compPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      ++playerScore;
      ballReset();
    }
  }

  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  // BG
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if (winScreen) {
    canvasContext.fillStyle = 'greenyellow';
    canvasContext.font = '30px Arial';
    canvasContext.fillText(
      `Click to restart`,
      canvas.width / 2 - 100,
      canvas.height / 2
    );
    return;
  }

  // Player Paddle
  colorRect(0, playerPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  // AI Paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    compPaddleY,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    'white'
  );

  // Ball
  colorCircle(ballX, ballY, 10, 'greenyellow');

  // Score board
  canvasContext.font = '30px Arial';
  canvasContext.fillText(`Score: ${playerScore}`, 100, 60);
  canvasContext.fillText(`Score: ${compScore}`, canvas.width - 200, 60);
}

function ballReset() {
  if (playerScore >= WINNING_SCORE || compScore >= WINNING_SCORE) {
    console.log(' GAME OVER ');
    compScore = 0;
    playerScore = 0;
    winScreen = true;
  }
  // ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function colorRect(x, y, w, h, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(x, y, w, h);
}

function colorCircle(x, y, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
