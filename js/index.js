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
const playAgain = document.querySelector(".play-again");
const volume = document.querySelector(".btn-volume");

let currentPosition = false;
let timerInterval;
let score = 0;
let currentTimer = 20;
let gameOver = false;
let jumpInProgress = false;
let pointSpawnInterval;
let maxWidth = 900;
let gamerLocal = localStorage.getItem("user");
let autoStartCurrent = false;
let intervalForSpawn = 1000;
let timing = false;
let speed = 2.3;

const activePoints = [];

const chHero = [
  { name: "candice", source: "candice.png" },
  { name: "ferb", source: "ferbs.png" },
  { name: "phines", source: "phines.webp" },
  { name: "perri", source: "perri3.png" },
];

const points = [
  "baby.png",
  "book.png",
  "doofs.png",
  "concertina.png",
  "jackhammer.png",
  "Momo.png",
  "Klimpaloon.png",
  "phone.webp",
  "paket.png",
  "balls.png",
  "Character.png",
];

function playGames() {
  startGameEle.classList.add("hidden");
  chooseGamerEle.classList.remove("hidden");
}

function gamerChoose(gamer) {
  localStorage.setItem("user", gamer);
  switch (gamer) {
    case "candice":
      heroEle.src = `assets/image/${chHero[0].source}`;
      backgroundEle.src = `assets/image/backgr.jpg`;
      break;
    case "ferb":
      heroEle.src = `assets/image/${chHero[1].source}`;
      backgroundEle.src = `assets/image/backgr.jpg`;
      break;
    case "phines":
      heroEle.src = `assets/image/${chHero[2].source}`;
      backgroundEle.src = `assets/image/backgr.jpg`;
      break;
    case "perri":
      heroEle.src = `assets/image/${chHero[3].source}`;
      backgroundEle.src = `assets/image/longtover.png`;
      heroes.style.width = "13%";
      heroes.style.height = "36%";
      break;
    default:
      console.log("Unknown character");
  }
  animateBackground();

  autoStartCurrent = true;
  currentPosition = true;
  gameOver = false;
  score = 0;
  currentTimer = 20;
  updateScore();
  autoStartCurrent = true;

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
  }, intervalForSpawn);
}

function createMovingPoint() {
  const pointImg = document.createElement("img");
  pointImg.src = `assets/image/${
    points[Math.floor(Math.random() * points.length)]
  }`;
  pointImg.classList.add("point");
  pointImg.style.position = "absolute";
  pointImg.style.top = `${Math.random() * (window.innerHeight * 0.01)}px`;
  const gameContentRect = gameContentEle.getBoundingClientRect();
  pointImg.style.left = `${gameContentEle.clientWidth - 10}px`;
  pointImg.style.width = "80px";
  pointImg.style.height = "70px";

  gameContentEle.appendChild(pointImg);
  activePoints.push(pointImg);

  movePointLeft(pointImg);
}

function movePointLeft(point) {
  let posX = parseFloat(point.style.left);
  let frameCount = 0;

  function frame() {
    if (gameOver) return;

    posX -= speed;
    frameCount++;

    const waveY = 30 * Math.sin(frameCount * 0.05);

    point.style.left = `${posX + 10}px`;

    point.style.transform = `translateY(${waveY}px)`;

    checkPointCollision(point);

    if (posX < -100) {
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
  if (point.dataset.collected === "true") return;

  const heroRect = heroEle.getBoundingClientRect();
  const pointRect = point.getBoundingClientRect();

  if (
    heroRect.bottom > pointRect.top &&
    heroRect.top < pointRect.bottom &&
    heroRect.right > pointRect.left &&
    heroRect.left < pointRect.right
  ) {
    point.dataset.collected = "true";
    point.classList.add("fade-out");

    setTimeout(() => point.remove(), 300);

    const index = activePoints.indexOf(point);
    if (index > -1) activePoints.splice(index, 1);

    score++;
    updateScore();
  }
}

function updateScore() {
  scoreEle.forEach((el) => (el.textContent = score));
}

function jumpHeroUp() {
  if (jumpInProgress) return;

  jumpInProgress = true;

  const jumpHeight = 130;
  const jumpDuration = 300;

  heroes.style.transition = `top ${jumpDuration}ms`;

  const computedTop = window.getComputedStyle(heroes).top;
  const currentTop = parseFloat(computedTop);
  const newTop = currentTop - jumpHeight;

  heroes.style.top = `${newTop}px`;

  setTimeout(() => {
    heroes.style.top = `${currentTop}px`;
    setTimeout(() => {
      jumpInProgress = false;
    }, jumpDuration);
  }, jumpDuration);
}

secondEle.addEventListener("click", jumpHeroUp);

let backgroundOffset = 0;

function animateBackground() {
  if (gameOver) return;

  backgroundOffset -= 0.7;
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
playAgain.addEventListener("click", playAgains);

function playAgains() {
  playGames();
  score = 0;
  currentTimer = 20;
  updateScore();
  timeEle.textContent = currentTimer;
  firstEle.classList.remove("hidden");
  chooseGamerEle.classList.remove("hidden");
  threedEle.classList.add("hidden");

  gameOver = false;
  backgroundOffset = 0;
  backgroundEle.style.transform = `translateX(0px)`;

  userInteracted = false;
  autoStartCurrent = false;

  setTimeout(() => {
    if (!userInteracted) {
      playGames();

      setTimeout(() => {
        if (!autoStartCurrent) {
          gamerChoose(`${gamerLocal}`);
        }
      }, 4000);
    }
  }, 4000);
}

function resizeHandler() {
  const height = window.innerHeight;
  const width = window.innerWidth;
  if (width < 400) {
    speed = 2;
    intervalForSpawn = 1300;
    videoEle.play();
    videoEle.src = "assets/video/vertical.mp4";
  } else if (height < 400) {
    intervalForSpawn = 3000;
    videoEle.play();
    timing = true;
    videoEle.src = "assets/video/horizontal.mp4";
    speed = 3;
  } else {
    speed = 2.1;
    videoEle.play();
    intervalForSpawn = 1300;
    videoEle.src = "assets/video/vertical.mp4";
  }
}

window.addEventListener("resize", resizeHandler);

resizeHandler();
let userInteracted = false;

playGameEle.addEventListener("click", () => {
  userInteracted = true;
  playGames();
});

function volumeUpDown() {
  let mutedVideo = videoEle.muted;
  if (!mutedVideo) {
    videoEle.muted = true;
    volume.innerHTML = `<i class="bi bi-volume-mute-fill"></i>`;
  } else {
    volume.innerHTML = `<i class="bi bi-volume-up-fill"></i>`;
    videoEle.muted = false;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    videoEle.play();
  }, 2000);
});
videoEle.addEventListener("ended", () => {
  const parentVideo = videoEle.parentElement;
  parentVideo.classList.add("hidden");
  firstEle.classList.remove("hidden");
  videoEle.pause();

  setTimeout(() => {
    if (!userInteracted) {
      playGames();

      setTimeout(() => {
        if (!autoStartCurrent && gamerLocal) {
          gamerChoose(gamerLocal);
        }
      }, 4000);
    }
  }, 4000);
});

volume.addEventListener("click", volumeUpDown);
