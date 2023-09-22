const colors = ["#FFFF00", "#0000FF", "#00FF00", "#FF0000", "#FFFFFF", "#FF69B4", "#FFA500", "#808080"];
let selectedColors = []
let solution;

let currentRow = 0;
let board = [];
let colorDuplication = false;
let numberOfCell = 4;
let numberOfRow = 12;

function generateSolution() {
    let shuffledColors = [];
    if (colorDuplication) {
        for (let i = 0; i < numberOfCell; i++) {
            shuffledColors.push(colors[Math.floor(Math.random() * 9)])
        }
    } else {
        shuffledColors = shuffleArray([...colors]).slice(0, numberOfCell);
    }
    return shuffledColors;
}

function setNumberOfCell() {
    const nbCellContainer = document.getElementById("nb-cell");
    if (nbCellContainer.value >= 4 && nbCellContainer.value <= 8) {
        numberOfCell = Number(nbCellContainer.value);
        numberOfRow = numberOfCell * numberOfCell - numberOfCell;
        createBoard();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function colorDuplicationParameter() {
    colorDuplication = !colorDuplication;
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
    if (selectedColors.filter(Boolean).length < numberOfCell) {
        alert("Veuillez choisir " + numberOfCell + " couleurs.");
        return;
    }


    let misplacedColors = 0;
    const missColor = []
    for (let i = 0; i < numberOfCell; i++) {
        const selColor = selectedColors[i];
        if (solution.includes(selColor) && !missColor.includes(selColor)) {
            const numberOfColorInSolution = solution.filter(item => item === selColor).length;
            const numberOfColorInSelection = selectedColors.filter(item => item === selColor).length
            if (numberOfColorInSolution >= numberOfColorInSelection) {
                misplacedColors += numberOfColorInSelection;
            } else {
                misplacedColors += numberOfColorInSolution;
            }
            missColor.push(selColor)
        }
    }

    let correctColors = 0;
    for (let i = 0; i < numberOfCell; i++) {
        if (selectedColors[i] === solution[i]) {
            correctColors++;
        }
    }
    misplacedColors -= correctColors;

    displayFeedback(correctColors, misplacedColors);

    if (correctColors === numberOfCell) {
        document.getElementById("score").hidden = false
        const colorPickers = document.querySelectorAll('.color-option-result');
        colorPickers.forEach((colorPicker, index) => {
            colorPicker.style.backgroundColor = solution[index];
        });
        alert("Félicitations, vous avez gagné !");
    } else if (currentRow === numberOfRow - 1) {
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
    for (let i = 1; i < numberOfCell + 1; i++) {
        const cell2 = document.getElementById(`row${currentRow}-col${i}`);
        cell2.style.backgroundColor = selectedColors[i - 1];
    }

    const cell = document.getElementById(`row${currentRow}-feedback-col${numberOfCell + 1}`);
    cell.textContent = correctColors + "✅";
}

function resetGame() {
    currentRow = 0;
    solution = generateSolution();
    board = [];

    for (let i = 0; i < numberOfRow; i++) {
        board.push([]);
        let cell = document.getElementById(`row${i}-feedback-col0`);
        cell.textContent = "";
        for (let j = 1; j < numberOfCell + 1; j++) {
            cell = document.getElementById(`row${i}-col${j}`);
            cell.style.backgroundColor = "#ddd";
            cell.textContent = "";
        }
        cell = document.getElementById(`row${i}-feedback-col${numberOfCell + 1}`);
        cell.textContent = "";
    }
    selectedColors = [];
    const colorPickers = document.querySelectorAll('.color-option');
    colorPickers.forEach(colorPicker => {
        colorPicker.style.backgroundColor = "#ddd";
    });
}

function createBoard() {

    const nbCellContainer = document.getElementById("nb-cell");
    nbCellContainer.value = numberOfCell;
    nbCellContainer.addEventListener('input', setNumberOfCell);

    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = ''
    boardContainer.style.gridTemplateColumns = "65px repeat(" + numberOfCell + ", 40px) 65px";

    for (let i = 0; i < numberOfRow; i++) {
        const feedbackCell = document.createElement("div");
        feedbackCell.classList.add("cell", "feedback-cell-misplaced");
        feedbackCell.id = `row${i}-feedback-col0`;
        boardContainer.appendChild(feedbackCell);
        for (let j = 1; j < numberOfCell + 1; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell", "result-cell");
            cell.id = `row${i}-col${j}`;
            boardContainer.appendChild(cell);
        }
        const feedbackCell2 = document.createElement("div");
        feedbackCell2.classList.add("cell", "feedback-cell-correct");
        feedbackCell2.id = `row${i}-feedback-col${numberOfCell + 1}`;
        boardContainer.appendChild(feedbackCell2);
    }

    const scoreContainer = document.getElementById("score");
    scoreContainer.innerHTML = '';
    const selectedCellContainer = document.getElementById("color-picker");
    selectedCellContainer.innerHTML = '';

    for (let i = 0; i < numberOfCell; i++) {

        const resultCell = document.createElement("div");
        resultCell.classList.add("color-option-result");
        scoreContainer.appendChild(resultCell);

        const cell = document.createElement("div");
        cell.classList.add("color-option");
        cell.onclick = () => selectColor(i);
        selectedCellContainer.appendChild(cell);
    }
    resetGame();
}

createBoard();
