// Global variables
let currentFormula = ''; // To store the current formula entered in the formula bar
let isDragging = false;
let selectedCells = [];

// Function to update the formula bar value
function updateFormula() {
    const formulaBar = document.getElementById('formulaBar');
    currentFormula = formulaBar.value.trim(); // Trim spaces for clean input
}

// Function to apply the formula entered in the formula bar
function applyFormula() {
    if (!currentFormula.startsWith('=')) {
        alert("Invalid formula! Please start the formula with '='.");
        return;
    }

    const formula = currentFormula.slice(1).toUpperCase(); // Remove '=' and normalize input

    try {
        if (formula.startsWith("SUM")) {
            calculateTableSum();
        } else if (formula.startsWith("AVERAGE")) {
            calculateTableAverage();
        } else {
            alert("Formula not recognized.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Function to calculate the sum of selected cells
function calculateTableSum() {
    let sum = 0;
    selectedCells.forEach(cell => {
        const value = parseFloat(cell.innerText);
        if (!isNaN(value)) {
            sum += value;
        }
    });
    alert(`Sum of selected cells: ${sum}`);
}

// Function to calculate the average of selected cells
function calculateTableAverage() {
    let sum = 0;
    let count = 0;
    selectedCells.forEach(cell => {
        const value = parseFloat(cell.innerText);
        if (!isNaN(value)) {
            sum += value;
            count++;
        }
    });
    const average = count > 0 ? sum / count : 0;
    alert(`Average of selected cells: ${average}`);
}

// Helper function to select a cell
function selectCell(cell) {
    if (!selectedCells.includes(cell)) {
        cell.classList.add('selected-cell');
        selectedCells.push(cell);
    }
}

// Helper function to clear previous selection
function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected-cell'));
    selectedCells = [];
}

// Function to clear content of selected cells
function clearAllCells() {
    selectedCells.forEach(cell => {
        cell.innerText = '';
    });
    alert('Selected cells cleared.');
}

// Function to clear cell selection
function clearCellSelection() {
    const highlightedCells = document.querySelectorAll('.selected-cell');
    highlightedCells.forEach(cell => {
        cell.classList.remove('selected-cell');
    });
    selectedCells = [];
}

// Function to handle drag start
function handleDragStart(event) {
    isDragging = true;
    clearCellSelection(); // Clear any previous selection
    selectCell(event.target);
}

// Function to handle dragging over cells
function handleDragOver(event) {
    if (isDragging && event.target.tagName === 'TD') {
        selectCell(event.target);
    }
}

// Function to handle drag end
function handleDragEnd() {
    isDragging = false; // Reset dragging state
}

// Function to clear selection when clicking outside the table
function clearSelectionOnClickOutside() {
    document.addEventListener('click', (event) => {
        const spreadsheet = document.getElementById('spreadsheet');
        if (!spreadsheet.contains(event.target)) {
            clearCellSelection(); // Clear cell selection
            isDragging = false; // Reset dragging state
        }
    });
}

// Add event listeners to table cells
function attachCellEventListeners() {
    const cells = document.querySelectorAll('#spreadsheet td');
    cells.forEach(cell => {
        cell.addEventListener('mousedown', handleDragStart); // Start drag
        cell.addEventListener('mouseover', handleDragOver); // Drag over
        cell.addEventListener('mouseup', handleDragEnd); // End drag
    });
}

// Initialize drag-to-select functionality
function initializeDragFunctions() {
    attachCellEventListeners();
    clearSelectionOnClickOutside(); // Activate the outside click listener
}

// Call this function once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDragFunctions();

    // Attach event listeners for calculation buttons
    document.getElementById('calculate-sum').addEventListener('click', calculateTableSum);
    document.getElementById('calculate-average').addEventListener('click', calculateTableAverage);
    document.getElementById('clear-cells').addEventListener('click', clearAllCells);
});
// Function to remove duplicate values in selected cells
function removeDuplicateCells() {
    if (selectedCells.length === 0) {
        alert("Please select cells to remove duplicates.");
        return;
    }

    const uniqueValues = new Set(); // Store unique values
    selectedCells.forEach((cell) => {
        const value = cell.innerText.trim(); // Trim spaces for clean comparison
        if (value && uniqueValues.has(value)) {
            cell.innerText = ''; // Clear duplicate cell content
        } else {
            uniqueValues.add(value); // Add unique value to the set
        }
    });

    alert("Duplicates removed from selected cells.");
}
document.getElementById('clear-cells').addEventListener('click', clearAllCells);
document.querySelector('button[onclick="removeDuplicateCells()"]').addEventListener('click', removeDuplicateCells);
function addRow() {
    const table = document.getElementById('spreadsheet').querySelector('tbody');
    const columnsCount = table.rows[0].cells.length; // Get the number of columns
    const newRow = document.createElement('tr');
    const rowIndex = table.rows.length + 1;

    // Add the row header (row number)
    const rowHeader = document.createElement('td');
    rowHeader.innerText = rowIndex;
    newRow.appendChild(rowHeader);

    // Add editable cells
    for (let i = 0; i < columnsCount - 1; i++) { // -1 for the row header
        const cell = document.createElement('td');
        cell.contentEditable = "true";
        cell.setAttribute('data-row', rowIndex - 1); // Zero-based indexing
        cell.setAttribute('data-col', i);
        cell.addEventListener('mousedown', handleDragStart); // Attach event listeners
        cell.addEventListener('mouseover', handleDragOver);
        cell.addEventListener('mouseup', handleDragEnd);
        newRow.appendChild(cell);
    }

    table.appendChild(newRow);
}
function addColumn() {
    const table = document.getElementById('spreadsheet');
    const headers = table.querySelector('thead').querySelector('tr');
    const columnCount = headers.cells.length; // Get the current number of columns
    const columnHeader = document.createElement('th');
    columnHeader.innerText = String.fromCharCode(64 + columnCount); // Convert to A, B, C...
    headers.appendChild(columnHeader);

    // Add a new cell to each row in the body
    const rows = table.querySelector('tbody').querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        const cell = document.createElement('td');
        cell.contentEditable = "true";
        cell.setAttribute('data-row', rowIndex);
        cell.setAttribute('data-col', columnCount - 1); // Zero-based indexing
        cell.addEventListener('mousedown', handleDragStart); // Attach event listeners
        cell.addEventListener('mouseover', handleDragOver);
        cell.addEventListener('mouseup', handleDragEnd);
        row.appendChild(cell);
    });
}
function deleteRow(rowIndex) {
    const table = document.getElementById('spreadsheet').querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    if (rowIndex > 0 && rowIndex <= rows.length) {
        table.deleteRow(rowIndex - 1); // Zero-based indexing
    } else {
        alert("Invalid row index.");
    }
}
function deleteColumn(colIndex) {
    const table = document.getElementById('spreadsheet');
    const headers = table.querySelector('thead').querySelector('tr');
    const rows = table.querySelector('tbody').querySelectorAll('tr');

    if (colIndex > 0 && colIndex < headers.cells.length) {
        headers.deleteCell(colIndex); // Remove column header

        // Remove the column in all rows
        rows.forEach(row => {
            row.deleteCell(colIndex);
        });
    } else {
        alert("Invalid column index.");
    }
}
// Function to apply formatting to selected cells
function applyFormatting(style, value = null) {
    if (selectedCells.length === 0) {
        alert("No cells selected! Please select cells to format.");
        return;
    }

    selectedCells.forEach(cell => {
        if (style === "bold") {
            cell.style.fontWeight = cell.style.fontWeight === "bold" ? "normal" : "bold";
        } else if (style === "italic") {
            cell.style.fontStyle = cell.style.fontStyle === "italic" ? "normal" : "italic";
        } else if (style === "color") {
            cell.style.color = value || "black";
        } else if (style === "fontSize") {
            cell.style.fontSize = value || "16px";
        }
    });
}

// Initialize cell selection and event listeners for formatting
document.addEventListener('DOMContentLoaded', () => {
    initializeDragFunctions();

    // Example: Clear formatting button
    document.getElementById('clear-cells').addEventListener('click', () => {
        selectedCells.forEach(cell => {
            cell.style = ""; // Reset all styles
        });
    });
});
// Data type mapping for cells
const cellDataTypes = new Map(); // Key: "row-col", Value: "type"

// Function to set the data type for a specific cell
function setCellDataType(row, col, dataType) {
    cellDataTypes.set(`${row}-${col}`, dataType);
    alert(`Cell (${row + 1}, ${String.fromCharCode(65 + col)}) set to ${dataType}`);
}

// Validate cell input based on its data type
function validateCellInput(cell, dataType) {
    const value = cell.textContent.trim();

    if (dataType === "number") {
        if (isNaN(value)) {
            alert("Invalid input! This cell only accepts numbers.");
            cell.textContent = ""; // Clear invalid input
        }
    } else if (dataType === "date") {
        if (isNaN(Date.parse(value))) {
            alert("Invalid input! Please enter a valid date (e.g., YYYY-MM-DD).");
            cell.textContent = ""; // Clear invalid input
        }
    }
    // Add additional data type checks here if needed
}

// Attach event listeners to cells for validation
document.querySelectorAll("td[contenteditable='true']").forEach(cell => {
    cell.addEventListener("input", function () {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const dataType = cellDataTypes.get(`${row}-${col}`);
        if (dataType) {
            validateCellInput(cell, dataType);
        }
    });
});

// Function to prompt user to set a data type for a cell
function setCellType() {
    const row = parseInt(prompt("Enter row number (1-based):")) - 1;
    const col = prompt("Enter column letter (e.g., A, B):").toUpperCase().charCodeAt(0) - 65;

    if (row < 0 || col < 0) {
        alert("Invalid row or column!");
        return;
    }

    const dataType = prompt("Enter data type (number, text, date):").toLowerCase();
    if (!["number", "text", "date"].includes(dataType)) {
        alert("Invalid data type!");
        return;
    }

    setCellDataType(row, col, dataType);
}

// Add a toolbar button for setting cell data types
document.querySelector(".toolbar").innerHTML += `
    <button onclick="setCellType()">Set Cell Data Type</button>
`;
// TRIM: Removes leading and trailing whitespace from a cell
function trimCell() {
    const cell = getSelectedCell();
    if (cell) {
        cell.textContent = cell.textContent.trim();
        alert("Leading and trailing spaces removed from the selected cell.");
    } else {
        alert("No cell selected!");
    }
}

// UPPER: Converts the text in a cell to uppercase
function upperCell() {
    const cell = getSelectedCell();
    if (cell) {
        cell.textContent = cell.textContent.toUpperCase();
        alert("Text in the selected cell converted to uppercase.");
    } else {
        alert("No cell selected!");
    }
}

// LOWER: Converts the text in a cell to lowercase
function lowerCell() {
    const cell = getSelectedCell();
    if (cell) {
        cell.textContent = cell.textContent.toLowerCase();
        alert("Text in the selected cell converted to lowercase.");
    } else {
        alert("No cell selected!");
    }
}

// REMOVE_DUPLICATES: Removes duplicate rows from the table
function removeDuplicateRows() {
    const rows = Array.from(document.querySelectorAll("#spreadsheet tbody tr"));
    const seen = new Set();

    rows.forEach(row => {
        const rowText = Array.from(row.querySelectorAll("td"))
            .map(cell => cell.textContent.trim())
            .join("|");

        if (seen.has(rowText)) {
            row.remove();
        } else {
            seen.add(rowText);
        }
    });

    alert("Duplicate rows removed!");
}

// FIND_AND_REPLACE: Find and replace specific text within the table
function findAndReplace() {
    const findText = prompt("Enter text to find:");
    const replaceText = prompt("Enter replacement text:");

    if (!findText || !replaceText) {
        alert("Please enter valid find and replace text!");
        return;
    }

    const cells = document.querySelectorAll("#spreadsheet td[contenteditable='true']");
    let replacedCount = 0;

    cells.forEach(cell => {
        if (cell.textContent.includes(findText)) {
            cell.textContent = cell.textContent.replaceAll(findText, replaceText);
            replacedCount++;
        }
    });

    alert(`${replacedCount} occurrences replaced.`);
}

// Helper function to get the currently selected cell
function getSelectedCell() {
    const selectedCell = document.querySelector(".selected-cell");
    return selectedCell || null;
}

// Add buttons to the toolbar for new functionality
document.querySelector(".toolbar").innerHTML += `
    <button onclick="trimCell()">TRIM</button>
    <button onclick="upperCell()">UPPER</button>
    <button onclick="lowerCell()">LOWER</button>
    <button onclick="removeDuplicateRows()">REMOVE_DUPLICATES ROWS</button>
    <button onclick="findAndReplace()">FIND_AND_REPLACE</button>
`;

// Add event listener to highlight the selected cell
document.querySelectorAll("#spreadsheet td[contenteditable='true']").forEach(cell => {
    cell.addEventListener("click", function () {
        document.querySelectorAll("#spreadsheet td").forEach(td => td.classList.remove("selected-cell"));
        this.classList.add("selected-cell");
    });
});
// History stack to keep track of changes
const historyStack = [];
const redoStack = [];

// Function to save the current state to the history stack
function saveState() {
    const tableState = Array.from(document.querySelectorAll("#spreadsheet tbody tr")).map(row => 
        Array.from(row.querySelectorAll("td")).map(cell => cell.textContent)
    );
    historyStack.push(JSON.stringify(tableState));
    redoStack.length = 0; // Clear redo stack after new action
}

// Function to load a state from the history stack
function loadState(state) {
    const rows = document.querySelectorAll("#spreadsheet tbody tr");
    const tableState = JSON.parse(state);

    tableState.forEach((rowData, rowIndex) => {
        rowData.forEach((cellData, cellIndex) => {
            rows[rowIndex].querySelectorAll("td")[cellIndex].textContent = cellData;
        });
    });
}

// UNDO: Reverts to the previous state
function undo() {
    if (historyStack.length > 0) {
        const currentState = JSON.stringify(
            Array.from(document.querySelectorAll("#spreadsheet tbody tr")).map(row => 
                Array.from(row.querySelectorAll("td")).map(cell => cell.textContent)
            )
        );
        redoStack.push(currentState); // Save current state to redo stack
        const previousState = historyStack.pop();
        loadState(previousState);
        alert("Undo successful!");
    } else {
        alert("No actions to undo.");
    }
}

// REDO: Reverts the undo action
function redo() {
    if (redoStack.length > 0) {
        const state = redoStack.pop();
        saveState(); // Save current state to history stack before redoing
        loadState(state);
        alert("Redo successful!");
    } else {
        alert("No actions to redo.");
    }
}

// Save state whenever a cell is edited
document.querySelectorAll("#spreadsheet td[contenteditable='true']").forEach(cell => {
    cell.addEventListener("input", saveState);
});

// Add buttons to the toolbar for Undo and Redo
document.querySelector(".toolbar").innerHTML += `
    <button onclick="undo()">Undo</button>
    <button onclick="redo()">Redo</button>
`;
// Function to save spreadsheet data as a JSON file
function saveSpreadsheet() {
    const tableData = Array.from(document.querySelectorAll("#spreadsheet tbody tr")).map(row =>
        Array.from(row.querySelectorAll("td")).map(cell => cell.textContent)
    );

    // Convert data to JSON
    const jsonData = JSON.stringify(tableData);

    // Create a Blob and trigger download
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "spreadsheet.json";
    link.click();
}

// Function to load a spreadsheet from a JSON file
function loadSpreadsheet(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const tableData = JSON.parse(e.target.result);

            // Validate that the loaded data is in the expected format (array of arrays)
            if (!Array.isArray(tableData) || !Array.isArray(tableData[0])) {
                throw new Error("Invalid file format");
            }

            // Clear the current table
            const tbody = document.querySelector("#spreadsheet tbody");
            tbody.innerHTML = "";

            // Populate the table with loaded data
            tableData.forEach((rowData, rowIndex) => {
                const row = document.createElement("tr");
                const rowNumber = document.createElement("td");
                rowNumber.textContent = rowIndex + 1;
                row.appendChild(rowNumber);

                rowData.forEach(cellData => {
                    const cell = document.createElement("td");
                    cell.contentEditable = "true";
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });

                tbody.appendChild(row);
            });

            alert("Spreadsheet loaded successfully!");
        } catch (error) {
            alert("Error loading spreadsheet: " + error.message);
        }
    };

    reader.readAsText(file);
}

// Add buttons to the toolbar for saving and loading
document.querySelector(".toolbar").innerHTML += `
    <button onclick="saveSpreadsheet()">Save</button>
    <input type="file" id="loadSpreadsheetInput" style="display: none;" onchange="loadSpreadsheet(event)">
    <button onclick="document.getElementById('loadSpreadsheetInput').click()">Load</button>
`;
function reattachEventListeners() {
    const cells = document.querySelectorAll("#spreadsheet td[contenteditable='true']");
    cells.forEach(cell => {
        cell.addEventListener("mousedown", handleDragStart);
        cell.addEventListener("mouseover", handleDragOver);
        cell.addEventListener("mouseup", handleDragEnd);
        cell.addEventListener("input", saveState);
    });

    document.querySelectorAll("#spreadsheet td").forEach(cell => {
        cell.addEventListener("click", function () {
            document.querySelectorAll("#spreadsheet td").forEach(td => td.classList.remove("selected-cell"));
            this.classList.add("selected-cell");
        });
    });
}

// Reinitialize after loading spreadsheet
document.getElementById('loadSpreadsheetInput').addEventListener('change', () => {
    setTimeout(reattachEventListeners, 100); // Allow DOM update before reattaching events
});
function generateChart() {
    if (selectedCells.length === 0) {
        alert("Please select cells with data to create a chart.");
        return;
    }

    // Extract data from selected cells
    const labels = []; // Labels for the chart
    const data = [];   // Data points for the chart

    selectedCells.forEach((cell, index) => {
        const cellValue = cell.innerText.trim();
        const numericValue = parseFloat(cellValue);

        // Use cell's coordinates or custom logic for labels
        labels.push(`Cell ${cell.dataset.row},${cell.dataset.col}`); 

        // Push numeric data or default to 0 if invalid
        data.push(isNaN(numericValue) ? 0 : numericValue);
    });

    // Display the chart container
    const chartContainer = document.getElementById("chartContainer");
    chartContainer.style.display = "block";

    // Create the chart
    const ctx = document.getElementById("chartCanvas").getContext("2d");
    new Chart(ctx, {
        type: "bar", // Change to other types if needed
        data: {
            labels: labels,
            datasets: [{
                label: "Selected Data",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function closeChart() {
    document.getElementById("chartContainer").style.display = "none";
}
