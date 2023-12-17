// Deklarasi variabel global untuk papan permainan, simbol pemain manusia, simbol pemain bot, dan kombinasi menang
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

// Mendapatkan semua elemen dengan kelas 'cell' pada HTML
const cells = document.querySelectorAll('.cell');

// Memulai permainan
startGame();

// Fungsi untuk memilih simbol pemain
function pilihSimbol(simbol){
  pManusia = simbol;
  pBot = simbol==='O' ? 'X' :'O';
  papanPermainan = Array.from(Array(9).keys());

  // Menambahkan event listener untuk setiap sel pada papan permainan
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick, false);
  }

  // Jika simbol bot adalah 'X', maka bot melakukan langkah pertamanya
  if (pBot === 'X') {
    turn(bestSpot(), pBot);
  }

  // Menyembunyikan tampilan pemilihan simbol setelah pemain memilih simbol
  document.querySelector('.pilihSimbol').style.display = "none";
  document.getElementById('gameTable').style.display = "table";
}

// Fungsi untuk memulai permainan
function startGame() {
  document.getElementById('gameTable').style.display = "none";
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innerText ="";
  document.querySelector('.pilihSimbol').style.display = "block";

  // Mengatur ulang tampilan sel pada papan permainan
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
}

// Fungsi yang dipanggil ketika pemain mengklik suatu sel pada papan permainan
function turnClick(square) {
  if (typeof papanPermainan[square.target.id] === 'number') {
    // Pemain manusia melakukan langkah
    turn(square.target.id, pManusia);


  }
}

// Fungsi untuk mengeksekusi langkah pemain pada suatu sel
function turn(squareId, player) {
  papanPermainan[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = cekMenang(papanPermainan, player);

  // Jika terdapat pemenang, panggil fungsi gameOver
  if (gameWon) {
    gameOver(gameWon);
  }

  // Memeriksa apakah permainan berakhir dengan seri
  cekSeri();
}

// Fungsi untuk mengecek apakah terdapat pemenang
function cekMenang(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;

  // Iterasi melalui kombinasi menang untuk mengecek apakah pemain telah menang
  for (let [index, win] of comboMenang.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

// Fungsi yang dipanggil ketika terdapat pemenang
function gameOver(gameWon){
  // Menandai sel-sel yang membentuk kombinasi menang dengan warna
  for (let index of comboMenang[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player === pManusia ? "blue" : "red";
  }

  // Menonaktifkan event listener pada sel-sel untuk menghindari klik lebih lanjut
  for (let i=0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }

  // Menampilkan pesan hasil permainan
  declareWinner(gameWon.player === pManusia ? "Kamu Menang!" : "Kamu kalah");
}

// Fungsi untuk menampilkan pesan hasil permainan
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

// Fungsi untuk mendapatkan sel-sel yang masih kosong pada papan permainan
function cekSpotKosong() {
  return papanPermainan.filter((elm, i) => i===elm);
}
  
// Fungsi untuk mendapatkan langkah terbaik yang dapat diambil oleh bot
function bestSpot(){
  return minimax(papanPermainan, pBot).index;
}
  
// Fungsi untuk mengecek apakah permainan berakhir dengan seri
function cekSeri() {
  if (cekSpotKosong().length === 0){
    // Jika permainan seri, mewarnai sel-sel dengan warna hijau
    for (cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener('click',turnClick, false);
    }

    // Menampilkan pesan hasil permainan
    declareWinner("Game seri!");
    return true;
  } 
  return false;
}

// Fungsi untuk mengimplementasikan algoritma minimax untuk pemilihan langkah terbaik oleh bot
function minimax(papanBaru, player) {
  var availSpots = cekSpotKosong(papanBaru);
  
  // Jika pemain manusia menang, berikan skor -10
  if (cekMenang(papanBaru, pManusia)) {
    return {score: -10};
  } 
  // Jika pemain bot menang, berikan skor 10
  else if (cekMenang(papanBaru, pBot)) {
    return {score: 10};
  } 
  // Jika tidak ada spot kosong, berikan skor 0 (seri)
  else if (availSpots.length === 0) {
    return {score: 0};
  }
  


  // Pada setiap pemanggilan fungsi rekurisf, akan membuat sebuah array moves yang bakal menyimpan langkah-langkah yang mungkin, dimana setiap langkah memiliki index dan score
  // Inisialisasi array untuk menyimpan langkah-langkah yang mungkin
  var moves = [];
  
  // Iterasi melalui seluruh spot kosong dan rekursif mencari skor untuk setiap langkah
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = papanBaru[availSpots[i]];
    papanBaru[availSpots[i]] = player;
    
    // Panggil rekursif minimax untuk mendapatkan skor langkah
    if (player === pBot)
      move.score = minimax(papanBaru, pManusia).score;
    else
       move.score =  minimax(papanBaru, pBot).score;

    // Kembalikan papan permainan ke keadaan sebelumnya
    papanBaru[availSpots[i]] = move.index;

    // Tambahkan langkah ke array moves
    moves.push(move);
  }
  
  // Pilih langkah terbaik berdasarkan skor
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
  
  // Kembalikan langkah terbaik
  return moves[bestMove];
}
