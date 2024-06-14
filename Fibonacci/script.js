document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const resetButton = document.getElementById('reset-button');
    const setSizeButton = document.getElementById('set-size-button');
    const gridSizeInput = document.getElementById('grid-size');
    const onColorInput = document.getElementById('on-color');
    let gridSize = parseInt(gridSizeInput.value);
    let grid = [];
    let history = [];

    // Initialize the grid with all lights off
    function initializeGrid() {
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
        grid = [];
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = false;
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');
                gridItem.addEventListener('click', () => {
                    toggleLights(i, j);
                    addHistory(i, j); // Pass coordinates to addHistory
                });
                gridContainer.appendChild(gridItem);
            }
        }
    }

    // Toggle a specific light
    function toggleLight(row, col) {
        grid[row][col] = !grid[row][col];
        const index = row * gridSize + col;
        const gridItem = gridContainer.children[index];
        if (grid[row][col]) {
            gridItem.style.backgroundColor = onColorInput.value;
        } else {
            gridItem.style.backgroundColor = '#333';
        }
    }

    // Toggle the light and its neighbors
    function toggleLights(row, col) {
        toggleLight(row, col);
        if (row > 0) toggleLight(row - 1, col);
        if (row < gridSize - 1) toggleLight(row + 1, col);
        if (col > 0) toggleLight(row, col - 1);
        if (col < gridSize - 1) toggleLight(row, col + 1);
    }

    
    // Reset the grid to all lights off
    function resetGrid() {
        gridContainer.innerHTML = '';
        history = [];
        updateHistoryUI();
        initializeGrid();
    }
        
    // Update grid size and reinitialize the grid
    function setGridSize() {
        gridSize = parseInt(gridSizeInput.value);
        resetGrid();
        }
        
        // Change the color of all "on" tiles when the on-color input value changes
        function updateOnColor() {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (grid[i][j]) {
                        const index = i * gridSize + j;
                        const gridItem = gridContainer.children[index];
                        gridItem.style.backgroundColor = onColorInput.value;
                    }
                }
            }
        }
                            
    // Add the current grid state to history
    function addHistory(i, j) {
        const gridState = grid.map(row => [...row]);
        history.push({ state: gridState, coordinates: { i: i + 1, j: j + 1 } });
        updateHistoryUI();
    }

    // Update the history UI
    function updateHistoryUI() {
        const historyList = document.querySelector('.history-list');
        historyList.innerHTML = '';
        history.forEach((entry, index) => {
            const mapping = (entry.coordinates.i - 1) * gridSize + (entry.coordinates.j);
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');

            const coordinatesText = document.createElement('p');
            coordinatesText.textContent = `Changed Coordinate: (${entry.coordinates.i}, ${entry.coordinates.j}) \u21A6 ${mapping}`;

            const miniGridContainer = document.createElement('div');
            miniGridContainer.classList.add('mini-grid-container');
            miniGridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;

            entry.state.forEach(row => {
                row.forEach(cell => {
                    const miniGridItem = document.createElement('div');
                    miniGridItem.classList.add('mini-grid-container-item');
                    if (cell) miniGridItem.style.backgroundColor = onColorInput.value;
                    miniGridContainer.appendChild(miniGridItem);
                });
            });

            const revertButton = document.createElement('button');
            revertButton.textContent = 'Revert';
            revertButton.style.padding = '10px 20px';
            revertButton.style.backgroundColor = '#138cff';
            revertButton.style.color = 'white';
            revertButton.style.border = 'none';
            revertButton.style.borderRadius = '5px';
            revertButton.style.cursor = 'pointer';
            revertButton.style.fontSize = '16px';
            revertButton.style.fontFamily = "'Roboto', sans-serif";
            revertButton.style.transition = 'background-color 0.4s';
            revertButton.addEventListener('click', () => revertToHistory(index));
            revertButton.addEventListener('mouseover', () => revertButton.style.backgroundColor = '#0056b3');
            revertButton.addEventListener('mouseout', () => revertButton.style.backgroundColor = '#138cff');

            historyItem.appendChild(coordinatesText);
            historyItem.appendChild(miniGridContainer);
            historyItem.appendChild(revertButton);
            historyList.prepend(historyItem); 
        });
    }


    // Revert to a specific history state
    function revertToHistory(index) {
        grid = history[index].map(row => [...row]);
        updateGridUI();
    }

    // Update the grid UI based on the current grid state
    function updateGridUI() {
        const gridItems = gridContainer.children;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const gridItem = gridItems[i * gridSize + j];
                if (grid[i][j]) {
                    gridItem.style.backgroundColor = onColorInput.value;
                } else {
                    gridItem.style.backgroundColor = '#333';
                }
            }
        }
    }

    // Initialize and reset button event
    initializeGrid();
    updateHistoryUI();
    resetButton.addEventListener('click', resetGrid);
    setSizeButton.addEventListener('click', setGridSize);
    onColorInput.addEventListener('input', updateOnColor);
});

function openHist() {
    document.getElementById("history").style.width = "500px";
    document.getElementById("main").style.marginLeft = "500px";
}
  
function closeHist() {
document.getElementById("history").style.width = "0";
document.getElementById("main").style.marginLeft = "0";
}