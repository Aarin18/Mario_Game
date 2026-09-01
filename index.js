let mario = document.querySelector(".mario");
let obstacle = document.querySelector(".obstacle");
let gameOverbox = document.querySelector(".game-over");
let button = document.querySelector("button");
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
