// script.js

const board = document.querySelectorAll('.cell');
let playerTurn = true;
let gameOver = false;
let startTime;
const bestTimesList = document.getElementById('times-list');

// Inicialización del juego y eventos
board.forEach(cell => cell.addEventListener('click', handlePlayerMove));
window.addEventListener('load', loadBestTimes);

// Función de movimiento del jugador
function handlePlayerMove(event) {
    if (gameOver || !playerTurn) return;
    
    const cell = event.target;
    cell.textContent = 'X';
    cell.classList.add('clicked');
    playerTurn = false;
    
    if (!startTime) startTime = Date.now();
    
    if (checkWinner('X')) {
        endGame('Jugador');
    } else if (isBoardFull()) {
        endGame('Empate');
    } else {
        setTimeout(handleComputerMove, 500);
    }
}

// Movimiento aleatorio de la computadora
function handleComputerMove() {
    if (gameOver) return;

    let availableCells = Array.from(board).filter(cell => !cell.textContent);
    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.textContent = 'O';
    randomCell.classList.add('clicked');

    if (checkWinner('O')) {
        endGame('Computadora');
    } else if (isBoardFull()) {
        endGame('Empate');
    } else {
        playerTurn = true;
    }
}

// Verificación de ganador
function checkWinner(mark) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    return winningCombinations.some(combination =>
        combination.every(index => board[index].textContent === mark)
    );
}

// Verificación de tablero completo
function isBoardFull() {
    return Array.from(board).every(cell => cell.textContent);
}

// Finalización del juego
function endGame(winner) {
    gameOver = true;
    if (winner === 'Jugador') {
        let timeTaken = (Date.now() - startTime) / 1000;
        let playerName = prompt('¡Ganaste! Ingresa tu nombre:');
        if (playerName) saveBestTime(playerName, timeTaken);
    }
    setTimeout(resetGame, 2000);
}

// Guardar el mejor tiempo en LocalStorage
function saveBestTime(player, time) {
    let bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
    bestTimes.push({ player, time, date: new Date().toLocaleString() });
    bestTimes.sort((a, b) => a.time - b.time);
    if (bestTimes.length > 10) bestTimes = bestTimes.slice(0, 10);
    localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
    loadBestTimes();
}

// Cargar y mostrar los mejores tiempos
function loadBestTimes() {
    bestTimesList.innerHTML = '';
    let bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
    bestTimes.forEach(record => {
        let li = document.createElement('li');
        li.textContent = `${record.player} - ${record.time}s (${record.date})`;
        bestTimesList.appendChild(li);
    });
}

// Reinicio del juego
function resetGame() {
    board.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('clicked');
    });
    playerTurn = true;
    gameOver = false;
    startTime = null;
}

