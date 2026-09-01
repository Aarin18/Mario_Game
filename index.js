// Fit the game to the screen on phones/tablets. The game's internal
// coordinate system always stays 800x400 (that's what jump heights,
// obstacle speed, marioX limits, etc. are all tuned for) — we just scale
// the whole box visually with CSS transform, so nothing about the actual
// game logic below has to change. getBoundingClientRect() (used for
// collision) already accounts for CSS transforms, so hit detection stays
// accurate at any size.
const gameWrapper = document.querySelector(".game-wrapper");
const gameEl = document.querySelector(".game");
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

function fitGameToScreen() {
  const horizontalPadding = 16;
  const availableWidth = window.innerWidth - horizontalPadding;
  const scale = Math.min(1, availableWidth / GAME_WIDTH);

  gameEl.style.transform = `scale(${scale})`;
  gameWrapper.style.width = GAME_WIDTH * scale + "px";
  gameWrapper.style.height = GAME_HEIGHT * scale + "px";
}

fitGameToScreen();
window.addEventListener("resize", fitGameToScreen);
window.addEventListener("orientationchange", fitGameToScreen);

let mario = document.querySelector(".mario");
let obstacle = document.querySelector(".obstacle");
let gameOverbox = document.querySelector(".game-over");
let button = document.querySelector(".restart-button");
let jumpButton = document.querySelector(".jump-button");
let scoreText = document.querySelector(".score");
let highScoreText = document.querySelector(".high-score");
let highScore = Number(localStorage.getItem("marioHighScore")) || 0;
highScoreText.innerText = `Best: ${highScore}`;

button.addEventListener("click", () => {
  location.reload();
});

//right,left,up,down
let marioX = 50;
let marioY = 0;
let marioVelocityY = 0;
const gravity = 0.9;
const jumpStrength = 16;

//obstacle for loopp
let obstacleX = 800;

//score
let score = 0;

//running variables
let gamerunning = true;
let isJumping = false;

//left,right
document.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (gamerunning == false) {
    return;
  }

  if (event.key == "ArrowRight" || event.key == "d" || event.key == "D") {
    marioX += 10;

    if (marioX >= 550) {
      marioX = 550;
    }

    mario.style.left = marioX + "px";
  }
  if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") {
    marioX -= 10;
    if (marioX <= 0) {
      marioX = 0;
    }
    mario.style.left = marioX + "px";
  }

  if (
    event.key == "ArrowUp" ||
    event.key == "w" ||
    event.key == "W" ||
    event.key == " "
  ) {
    jump();
  }
});

//jump

function jump() {
  if (isJumping) {
    return;
  }

  isJumping = true;
  marioVelocityY = jumpStrength;
}

// Mobile jump control. Prevent the touch from also triggering browser gestures.
jumpButton.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
    if (gamerunning) {
      jump();
    }
  },
  { passive: false },
);

//obs

let gameloop = setInterval(() => {
  if (isJumping) {
    marioVelocityY -= gravity;
    marioY += marioVelocityY;

    if (marioY <= 0) {
      marioY = 0;
      marioVelocityY = 0;
      isJumping = false;
    }

    mario.style.bottom = marioY + "px";
  }

  obstacleX -= 7;
  obstacle.style.left = obstacleX + "px";

  if (obstacleX <= -40) {
    obstacleX = 800;

    score++;
    scoreText.innerText = ` Score: ${score} `;
  }
  let marioBox = mario.getBoundingClientRect();
  let obstacleBox = obstacle.getBoundingClientRect();
  // console.log(marioBox, obstacleBox);

  if (
    marioBox.right > obstacleBox.left &&
    marioBox.left < obstacleBox.right &&
    marioBox.bottom > obstacleBox.top &&
    marioBox.top < obstacleBox.bottom
  ) {
    gamerunning = false;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("marioHighScore", highScore);
      highScoreText.innerText = `Best: ${highScore}`;
    }
    gameOverbox.style.display = "flex";
    clearInterval(gameloop);
  }
}, 20);
