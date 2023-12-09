let papanPermainan;
let pManusia ='O';
let pBot = 'X';
const comboMenang =[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

const cells = document.querySelectorAll('.cell');
startGame();

function selectSimbol(simbol){
  pManusia = simbol;
  pBot = simbol==='O' ? 'X' :'O';
  papanPermainan = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick, false);
  }
  if (pBot === 'X') {
    turn(bestSpot(),pBot);
  }
  document.querySelector('.selectSimbol').style.display = "none";
}

function startGame() {
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innerText ="";
  document.querySelector('.selectSimbol').style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
}

function turnClick(square) {
  if (typeof papanPermainan[square.target.id] ==='number') {
    turn(square.target.id, pManusia);
    if (!checkWin(papanPermainan, pManusia) && !checkTie())  
    setTimeout(function () {
      turn(bestSpot(), pBot);
    }, 1000);
  }
}

function turn(squareId, player) {
  papanPermainan[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(papanPermainan, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of comboMenang.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon){
  for (let index of comboMenang[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player === pManusia ? "blue" : "red";
  }
  for (let i=0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player === pManusia ? "Kamu Menang!" : "Kamu kalah");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}
function emptySquares() {
  return papanPermainan.filter((elm, i) => i===elm);
}
  
function bestSpot(){
  return minimax(papanPermainan, pBot).index;
}
  
function checkTie() {
  if (emptySquares().length === 0){
    for (cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener('click',turnClick, false);
    }
    declareWinner("Game seri!");
    return true;
  } 
  return false;
}

function minimax(papanBaru, player) {
  var availSpots = emptySquares(papanBaru);
  
  if (checkWin(papanBaru, pManusia)) {
    return {score: -10};
  } else if (checkWin(papanBaru, pBot)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  
  var moves = [];
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = papanBaru[availSpots[i]];
    papanBaru[availSpots[i]] = player;
    
    if (player === pBot)
      move.score = minimax(papanBaru, pManusia).score;
    else
       move.score =  minimax(papanBaru, pBot).score;

    papanBaru[availSpots[i]] = move.index;
    
    if ((player === pBot && move.score === 10) || (player === pManusia && move.score === -10))
      return move;
    else 
      moves.push(move);
  }
  
  let bestMove, bestScore;
  if (player === pBot) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  
  return moves[bestMove];
}