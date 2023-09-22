const colors = ["#FFFF00", "#0000FF", "#00FF00", "#FF0000", "#FFFFFF", "#FF69B4", "#FFA500", "#808080"];
let selectedColors = []
let solution;

let currentRow = 0;
let board = [];

function generateSolution() {
    const shuffledColors = shuffleArray([...colors]);
    return shuffledColors.slice(0, 4);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function selectColor(index) {
    const copyArray = [...colors]
    const colorPicker = document.querySelectorAll('.color-option')[index];
    if (!selectedColors[index]) {
        colorPicker.style.backgroundColor = copyArray[0];
        selectedColors[index] = copyArray[0];
    } else {
        const indexSelectedColor = copyArray.indexOf(selectedColors[index]);
        colorPicker.style.backgroundColor = copyArray[indexSelectedColor + 1];
        selectedColors[index] = copyArray[indexSelectedColor + 1];
    }
}

function validateGuess() {
    if (selectedColors.filter(Boolean).length < 4) {
        alert("Veuillez choisir 4 couleurs.");
        return;
    }

    let correctColors = 0;
    const matchingColor = []
    for (let i = 0; i < 4; i++) {
        if (selectedColors[i] === solution[i] && !matchingColor.includes(selectedColors[i])) {
            correctColors++;
            matchingColor.push(selectedColors[i])
        }
    }

    let misplacedColors = 0;

    for (let i = 0; i < 4; i++) {
        if (solution.includes(selectedColors[i]) && !matchingColor.includes(selectedColors[i])) {
            misplacedColors++;
        }
    }

    displayFeedback(correctColors, misplacedColors);

    if (correctColors === 4) {
        document.getElementById("score").hidden = false
        const colorPickers = document.querySelectorAll('.color-option-result');
        colorPickers.forEach((colorPicker, index) => {
            colorPicker.style.backgroundColor = solution[index];
        });
        alert("Félicitations, vous avez gagné !");
    } else if (currentRow === 11) {
        document.getElementById("score").hidden = false
        const colorPickers = document.querySelectorAll('.color-option-result');
        colorPickers.forEach((colorPicker, index) => {
            colorPicker.style.backgroundColor = solution[index];
        });
        alert("Désolé, vous avez perdu.");
    } else {
        currentRow++;
        selectedColors = [];
        const colorPickers = document.querySelectorAll('.color-option');
        colorPickers.forEach(colorPicker => {
            colorPicker.style.backgroundColor = "";
        });
    }
}

function displayFeedback(correctColors, misplacedColors) {
    const cell1 = document.getElementById(`row${currentRow}-feedback-col${0}`);
    cell1.textContent = misplacedColors + "❎";
    for (let i = 1; i < 5; i++) {
        const cell2 = document.getElementById(`row${currentRow}-col${i}`);
        cell2.style.backgroundColor = selectedColors[i-1];
    }

    const cell = document.getElementById(`row${currentRow}-feedback-col${5}`);
    cell.textContent = correctColors + "✅";
}

function resetGame() {
    currentRow = 0;
    solution = generateSolution();
    board = [];

    for (let i = 0; i < 12; i++) {
        board.push([]);
        let cell =  document.getElementById(`row${i}-feedback-col0`);
        cell.textContent = "";
        for (let j = 1; j < 5; j++) {
            cell = document.getElementById(`row${i}-col${j}`);
            cell.style.backgroundColor = "#ddd";
            cell.textContent = "";
        }
        cell =  document.getElementById(`row${i}-feedback-col5`);
        cell.textContent = "";
    }
    selectedColors = [];
    const colorPickers = document.querySelectorAll('.color-option');
    colorPickers.forEach(colorPicker => {
        colorPicker.style.backgroundColor = "#ddd";
    });
}

function createBoard() {
    const boardContainer = document.getElementById("board");

    for (let i = 0; i < 12; i++) {
        const feedbackCell = document.createElement("div");
        feedbackCell.classList.add("cell", "feedback-cell-misplaced");
        feedbackCell.id = `row${i}-feedback-col0`;
        boardContainer.appendChild(feedbackCell);
        for (let j = 1; j < 5; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell", "result-cell");
            cell.id = `row${i}-col${j}`;
            boardContainer.appendChild(cell);
        }
        const feedbackCell2 = document.createElement("div");
        feedbackCell2.classList.add("cell", "feedback-cell-correct");
        feedbackCell2.id = `row${i}-feedback-col5`;
        boardContainer.appendChild(feedbackCell2);
    }
}

createBoard();
resetGame();
