const firstEle = document.querySelector(".first");
const secondEle = document.querySelector(".second");
const threedEle = document.querySelector(".threed");
const videoEle = document.querySelector(".video");

const volumeUpEle = document.querySelector(".btn-volume");

const startGameEle = document.querySelector(".start-game");
const playGameEle = document.querySelector(".play-game");
const chooseGamerEle = document.querySelector(".choose-gamer");

const backgroundEle = document.querySelector(".background");
const pointEle = document.querySelector(".point");
const heroEle = document.querySelector(".hero"); // это для измения кастуюма
const heroes = document.querySelector(".herois"); //это для движения фигурки
const timeEle = document.querySelector(".timer");
const scoreEle = document.querySelectorAll(".score");
const gameContentEle = document.querySelector(".game-content");
const playGame = document.querySelector(".play-game");

let currentPosition = false;
let timerInterval;
let score = 0;
let currentTimer = 20;
let gameOver = false;
let jumpInProgress = false;
let pointSpawnInterval;
let maxWidth = 800;

const activePoints = [];

const chHero = [
  { name: "candice", source: "candice.png" },
  { name: "ferb", source: "ferbs.png" },
  { name: "phines", source: "phines.png" },
  {
    name: "perri",
    source: {
      1: "perri1.png",
      2: "perri3.png",
      3: "perri4.png",
      4: "perri2.png",
    },
  },
];

const points = [
  "baby.png",
  "book.png",
  "doofs.png",
  "concertina.png",
  "jackhammer.png",
  "Momo.png",
  "Klimpaloon.png",
  "phone.png",
  "paket.png",
  "zebra.png",
  "balls.png",
];

playGame.addEventListener("click", () => {
  startGameEle.classList.add("hidden");
  chooseGamerEle.classList.remove("hidden");
});

function gamerChoose(gamer) {
  localStorage.setItem("user", gamer);
  switch (gamer) {
    case "candice":
      heroEle.src = `assets/image/${chHero[0].source}`;
      break;
    case "ferb":
      heroEle.src = `assets/image/${chHero[1].source}`;
      break;
    case "phines":
      heroEle.src = `assets/image/${chHero[2].source}`;
      break;
    case "perri":
      heroEle.src = `assets/image/${chHero[3].source[1]}`;
      backgroundEle.src = `assets/image/longTower.png`;
      heroes.style.width = "23%";
      heroes.style.height = "31%";
      break;
    default:
      console.log("Unknown character");
  }
  animateBackground();

  currentPosition = true;
  gameOver = false;
  score = 0;
  currentTimer = 20;
  updateScore();

  firstEle.classList.add("hidden");
  secondEle.classList.remove("hidden");

  timerInterval = setInterval(() => {
    timeEle.textContent = currentTimer;
    currentTimer--;
    if (currentTimer < 0) {
      clearInterval(timerInterval);
      clearInterval(pointSpawnInterval);
      endGame();
    }
  }, 1000);

  pointSpawnInterval = setInterval(() => {
    if (!gameOver) createMovingPoint();
  }, 1000);
}

function createMovingPoint() {
  const pointImg = document.createElement("img");
  pointImg.src = `assets/image/${
    points[Math.floor(Math.random() * points.length)]
  }`;
  pointImg.classList.add("point");
  pointImg.style.position = "absolute";
  pointImg.style.top = `${Math.random() * (window.innerHeight * 0.3)}px`;
  pointImg.style.left = `${window.innerWidth}px`;
  pointImg.style.width = "70px";
  pointImg.style.height = "70px";

  gameContentEle.appendChild(pointImg);
  activePoints.push(pointImg);

  movePointLeft(pointImg);
}

function movePointLeft(point) {
  let posX = parseFloat(point.style.left);

  function frame() {
    if (gameOver) return;

    posX -= 2;
    point.style.left = `${posX - maxWidth}px`;

    checkPointCollision(point);

    if (posX < -60) {
      point.remove();
      const index = activePoints.indexOf(point);
      if (index > -1) activePoints.splice(index, 1);
      return;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function checkPointCollision(point) {
  const heroRect = heroEle.getBoundingClientRect();
  const pointRect = point.getBoundingClientRect();

  if (
    heroRect.bottom > pointRect.top &&
    heroRect.top < pointRect.bottom &&
    heroRect.right > pointRect.left &&
    heroRect.left < pointRect.right
  ) {
    point.remove();
    const index = activePoints.indexOf(point);
    if (index > -1) activePoints.splice(index, 1);
    score++;
    updateScore();
  }
}

function updateScore() {
  scoreEle.forEach((el) => (el.textContent = score));
}

let touchStartY = 0;
let touchEndY = 0;

secondEle.addEventListener("touchstart", (e) => {
  touchStartY = e.changedTouches[0].clientY;
});

secondEle.addEventListener("touchend", (e) => {
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchStartY - touchEndY;

  if (Math.abs(diff) < 30 || jumpInProgress || gameOver) return;

  if (diff > 0) {
    jumpHeroUp();
  } else {
    jumpHeroDown();
  }
}

function jumpHeroUp() {
  jumpInProgress = true;

  heroes.style.transition = "top 0.3s";
  const currentTop = parseInt(heroes.style.top || "200");
  heroes.style.top = `${currentTop - 30}px`;

  setTimeout(() => {
    heroes.style.top = `25%`;
    jumpInProgress = false;
  }, 300);
}

function jumpHeroDown() {
  jumpInProgress = true;

  heroes.style.transition = "top 0.3s";
  const currentTop = parseInt(heroes.style.top || "300");
  heroes.style.top = `${currentTop + 100}px`;

  setTimeout(() => {
    heroes.style.top = `25%`;
    jumpInProgress = false;
  }, 300);
}

secondEle.addEventListener("click", jumpHeroUp);

secondEle.addEventListener("dblclick", jumpHeroDown);

let backgroundOffset = 0;

function animateBackground() {
  if (gameOver) return;

  backgroundOffset -= 0.8;
  backgroundEle.style.transform = `translateX(${backgroundOffset}px)`;

  requestAnimationFrame(animateBackground);
}

function endGame() {
  gameOver = true;
  activePoints.forEach((p) => p.remove());
  activePoints.length = 0;
  threedEle.classList.remove("hidden");
  secondEle.classList.add("hidden");
}
function playAgain() {
  let gamer = localStorage.getItem("user");
  gamerChoose(`${gamer}`);
  score = 0;
  currentTimer = 20;
  console.log(gamer);
  updateScore();
  timeEle.textContent = currentTimer;
  gameOver = false;
  backgroundOffset = 0;
  backgroundEle.style.transform = `translateX(0px)`;
  animateBackground();
}
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  if (width < 400) {
    maxWidth = 10;
  } else {
    maxWidth = 800;
  }
});

document.addEventListener("keydown", (e) => {
  if (gameOver || jumpInProgress) return;

  if (e.key === "ArrowUp") {
    jumpHeroUp();
  } else if (e.key === "ArrowDown") {
    jumpHeroDown();
  }
});
