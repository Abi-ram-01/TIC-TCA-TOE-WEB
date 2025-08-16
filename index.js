document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const nameEntryScreen = document.getElementById('name-entry-screen');
    const gameScreen = document.getElementById('game-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const playerXNameInput = document.getElementById('player-x-name-input');
    const playerONameInput = document.getElementById('player-o-name-input');
    
    const playerXNameElem = document.getElementById('player-x-name');
    const playerXScoreElem = document.getElementById('player-x-score');
    const playerONameElem = document.getElementById('player-o-name');
    const playerOScoreElem = document.getElementById('player-o-score');

    const playerXScoreboard = document.getElementById('player-x-scoreboard');
    const playerOScoreboard = document.getElementById('player-o-scoreboard');

    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status-text');

    const endGameModal = document.getElementById('end-game-modal');
    const endGameMessage = document.getElementById('end-game-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');

    // --- Game State Variables ---
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let playerNames = { X: 'Player X', O: 'Player O' };
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Functions ---
    const updateStatusText = () => {
        statusText.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
    };

    const updateScoreboard = () => {
        playerXScoreElem.textContent = scores.X;
        playerOScoreElem.textContent = scores.O;
        
        playerXNameElem.textContent = playerNames.X;
        playerONameElem.textContent = playerNames.O;

        if (currentPlayer === 'X') {
            playerXScoreboard.classList.add('active');
            playerOScoreboard.classList.remove('active');
        } else {
            playerOScoreboard.classList.add('active');
            playerXScoreboard.classList.remove('active');
        }
    };

    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatusText();
        updateScoreboard();
    };

    const handleResultValidation = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            scores[currentPlayer]++;
            updateScoreboard();
            showEndGameModal(`${playerNames[currentPlayer]} Wins!`);
            return;
        }

        if (!gameState.includes("")) {
            gameActive = false;
            showEndGameModal("It's a Draw!");
            return;
        }

        handlePlayerChange();
    };

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());

        handleResultValidation();
    };
    
    const showEndGameModal = (message) => {
        endGameMessage.textContent = message;
        endGameModal.classList.add('active');
    };

    const hideEndGameModal = () => {
        endGameModal.classList.remove('active');
    };

    const playAgain = () => {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusText.textContent = '';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        hideEndGameModal();
        updateStatusText();
        updateScoreboard();
    };

    const restartGame = () => {
        scores = { X: 0, O: 0 };
        playerNames = { X: 'Player X', O: 'Player O' };
        playerXNameInput.value = '';
        playerONameInput.value = '';
        
        playAgain(); // Resets the board
        hideEndGameModal();

        gameScreen.classList.remove('active');
        nameEntryScreen.classList.add('active');
    };

    const startGame = () => {
        const pXName = playerXNameInput.value.trim();
        const pOName = playerONameInput.value.trim();

        playerNames.X = pXName === '' ? 'Player X' : pXName;
        playerNames.O = pOName === '' ? 'Player O' : pOName;
        
        nameEntryScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        updateScoreboard();
        updateStatusText();
    };

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', startGame);
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    playAgainBtn.addEventListener('click', playAgain);
    restartGameBtn.addEventListener('click', restartGame);
});

// (Keep all your existing JavaScript code)

// ----- MODIFY THIS FUNCTION -----
const handleResultValidation = () => {
    let roundWon = false;
    let winningLine = []; // To store the winning cell indices
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition; // *** NEW: Store the winning line
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        scores[currentPlayer]++;
        // *** NEW: Highlight the winning cells
        winningLine.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
        updateScoreboard();
        // Use a slight delay to allow the animation to be seen before the modal appears
        setTimeout(() => {
            showEndGameModal(`${playerNames[currentPlayer]} Wins!`);
        }, 500); // 0.5 second delay
        return;
    }

    if (!gameState.includes("")) {
        gameActive = false;
        showEndGameModal("It's a Draw!");
        return;
    }

    handlePlayerChange();
};


// ----- AND MODIFY THIS FUNCTION -----
const playAgain = () => {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning-cell'); // *** NEW: Remove winning-cell class
    });
    hideEndGameModal();
    updateStatusText();
    updateScoreboard();
};


// (The rest of your JavaScript file remains the same)