//Global Variables
const gridContainer = document.querySelector(".grid-container");
const container = document.querySelector(".container");
const start = document.querySelector(".start");
const startGame = document.querySelector(".startGame");
const player1ns = document.querySelector(".player1");
const player2ns = document.querySelector(".player2");
const player1 = player1ns.querySelector("span");
const player2 = player2ns.querySelector("span");
let gameSize;

let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let inputPlayer1;
let inputPlayer2;
let Player1Turn = true;
let Player2Turn = false;
let winsCountPlayer1 = 0;
let winsCountPlayer2 = 0;

document.querySelector(".player2").querySelector(".score").textContent =
  scorePlayer2;

document.querySelector(".player1").querySelector(".score").textContent =
  scorePlayer1;

document.querySelector(".player2").querySelector(".wins").textContent =
  winsCountPlayer2;

document.querySelector(".player1").querySelector(".wins").textContent =
  winsCountPlayer1;

//Add EventListener
startGame.addEventListener("click", function (e) {
  e.preventDefault();

  inputPlayer1 = document.querySelector("#player1").value;
  inputPlayer2 = document.querySelector("#player2").value;

  if (inputPlayer1 == "" || inputPlayer2 == "") {
    alert("all fields must be completed");
    return;
  }
  start.classList.add("hide");
  container.classList.remove("hide");
  player1.innerHTML = inputPlayer1;
  player2.innerHTML = inputPlayer2;

  //GameSize
  gameSize = document.querySelector("#small").checked ? true : false;
  selectGameSize();
});

function selectGameSize() {
  if (gameSize == true) {
    fetch("./data/card4x4.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        cards = [...data, ...data];
        console.log(cards);
        shuffleCards();
        generateCards();
      });
    gridContainer.style.setProperty(
      "grid-template-columns",
      "repeat(4, 140px)"
    );
  } else {
    fetch("./data/card6x6.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        cards = [...data, ...data];
        console.log(cards);
        shuffleCards();
        generateCards();
      });

    gridContainer.style.setProperty(
      "grid-template-columns",
      "repeat(6, 140px)"
    );
  }
}

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (Player1Turn) this.classList.add("flipped");
  else this.classList.add("flipped2");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  if (checkForMatch()) {
    Player1Turn ? scorePlayer1++ : scorePlayer2++;
    document.querySelector(".player1").querySelector(".score").textContent =
      scorePlayer1;
    document.querySelector(".player2").querySelector(".score").textContent =
      scorePlayer2;
    disableCards();
    isFinished();
  } else {
    unflipCards();
    switchTurns();
  }
}

function switchTurns() {
  if (Player1Turn) {
    Player1Turn = false;
    Player2Turn = true;
    player2ns.classList.add("green");
    player1ns.classList.remove("green");
  } else {
    Player1Turn = true;
    Player2Turn = false;
    player1ns.classList.add("green");
    player2ns.classList.remove("green");
  }
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  return isMatch;
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.classList.remove("flipped2");
    secondCard.classList.remove("flipped2");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  document.querySelector(".player1").querySelector(".score").textContent =
    scorePlayer1;
  document.querySelector(".player2").querySelector(".score").textContent =
    scorePlayer2;
  gridContainer.innerHTML = "";
  generateCards();
}


function isFinished(){
  if(gameSize && scorePlayer1 + scorePlayer2 == 8){
    if(scorePlayer1 > scorePlayer2){
      winsCountPlayer1++;
    }
    else if(scorePlayer2 > scorePlayer1){
      winsCountPlayer2++;
    }
  }
  else if(scorePlayer1 + scorePlayer2 == 18){
    if(scorePlayer1 > scorePlayer2){
      winsCountPlayer1++;
    }
    else if(scorePlayer2 > scorePlayer1){
      winsCountPlayer2++;
    }
  }
document.querySelector(".player2").querySelector(".wins").textContent =
  winsCountPlayer2;

document.querySelector(".player1").querySelector(".wins").textContent =
  winsCountPlayer1;
}