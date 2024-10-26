const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const bestTimesElement = document.getElementById('bestTimes');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let startTime;
let bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];

resetButton.addEventListener('click', resetGame);

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
});

function handleCellClick(cell, index) {
    if (board[index] === '' && gameActive) {
        if (!startTime) {
            startTime = new Date();
        }
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') {
            setTimeout(computerMove, 500); 
        }
    }
}

function computerMove() {
    let emptyCells = board.map((value, index) => value === '' ? index : null).filter(v => v !== null);
    if (emptyCells.length > 0 && gameActive) {
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = 'O';
        let cell = cells[randomIndex];
        cell.textContent = 'O';
        cell.classList.add('O');
        checkWinner();
        currentPlayer = 'X';
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let roundWon = false;
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        const endTime = new Date();
        const timeElapsed = ((endTime - startTime) / 1000).toFixed(2);
        messageElement.textContent = `¡Ganaste en ${timeElapsed} segundos!`;
        setTimeout(() => saveBestTime(timeElapsed), 500); 
        return;
    }

    if (!board.includes('')) {
        messageElement.textContent = '¡Empate!';
        gameActive = false;
        return;
    }
}

function saveBestTime(timeElapsed) {
    const playerName = prompt('Ingresa tu nombre para guardar tu tiempo:');
    if (playerName) {
        const newRecord = {
            name: playerName,
            time: parseFloat(timeElapsed),
            date: new Date().toLocaleString()
        };
        bestTimes.push(newRecord);
        bestTimes.sort((a, b) => a.time - b.time);  // Ordenar de menor a mayor tiempo
        if (bestTimes.length > 10) {
            bestTimes.pop();  // Limitar a 10 los mejores tiempos
        }
        localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
        displayBestTimes();
    }
}

function displayBestTimes() {
    bestTimesElement.innerHTML = '';
    bestTimes.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.name}: ${record.time} segundos (Fecha: ${record.date})`;
        bestTimesElement.appendChild(li);
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    messageElement.textContent = '';
    startTime = null;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
}

displayBestTimes();  // Mostrar mejores tiempos al cargar la página
