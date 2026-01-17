function create_matrix() {
    const size = document.getElementById('size').value;
    let inputWidth = 100;
    if (size >= 6) inputWidth = 50;

    let html = '<table id="matrixTable">';
    for (let i = 0; i < size; i++) {
        html += '<tr>';
        for (let j = 0; j < size; j++) {
            html += `<td><input type="number" class="matrix-input" step="1" value="0" style="width:${inputWidth}px"></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    const container = document.getElementById('matrixContainer');
    container.innerHTML = `
        <div class="operation-item">
            <h3 class="operation-item label">Enter the Values for the Matrix</h3>
            ${html}
            <button type="button" onclick="calculate_determinant()">Calculate Determinant</button>
        </div>
    `;
}

function create_matrix() {
    const size = document.getElementById('size').value;
    let inputWidth = 100;
    if (size >= 6) inputWidth = 80;

    let html = '<table id="matrixTable">';
    for (let i = 0; i < size; i++) {
        html += '<tr>';
        for (let j = 0; j < size; j++) {
            html += `<td><input type="number" class="matrix-input" step="1" value="" min="-999999" max="999999" inputmode="decimal" placeholder="" oninput="validateNumberInput(this)"></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    const container = document.getElementById('matrixContainer');
    container.innerHTML = `
        <div class="operation-item">
            <h3 class="operation-item label">Enter the Values for the Matrix</h3>
            ${html}
            <button type="button" onclick="calculate_determinant()">Calculate Determinant</button>
        </div>
    `;
}

function check_input(input) {
    let value = input.value;
    value = value.replace(/[^0-9.\-]/g, '');

    if ((value.match(/\./g) || []).length > 1) {
        value = value.slice(0, -1);
    }
    if ((value.match(/\-/g) || []).length > 1) {
        value = value.replace(/\-/g, '');
        value = '-' + value;
    }
    input.value = value;
}

function get_matrix() {
    const inputs = document.querySelectorAll('.matrix-input');
    const size = Math.sqrt(inputs.length);
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(parseFloat(inputs[i * size + j].value));
        }
        matrix.push(row);
    }
    return matrix;
}

// Getting Determinant via Cofactor Expansion
function cofactor_determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    let det = 0;
    for (let col = 0; col < n; col++) {
        const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== col));
        det += Math.pow(-1, col) * matrix[0][col] * cofactor_determinant(minor);
    }
    return det;
}

function calculate_determinant() {
    const inputs = document.querySelectorAll('.matrix-input');
    const errorMsg = document.getElementById('errorMessage');
    
    let hasEmptyInput = false;
    for (let input of inputs) {
        if (input.value === '' || input.value === null) {
            hasEmptyInput = true;
            break;
        }
    }
    
    if (hasEmptyInput) {
        errorMsg.textContent = 'Please fill in all matrix values!';
        errorMsg.style.display = 'block';
        document.getElementById('result').style.display = 'none';
        return;
    }
    
    const matrix = get_matrix();
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (isNaN(matrix[i][j])) {
                errorMsg.textContent = 'All matrix values must be valid numbers!';
                errorMsg.style.display = 'block';
                document.getElementById('result').style.display = 'none';
                return;
            }
        }
    }
    
    try {
        const det = cofactor_determinant(matrix);
        document.getElementById('determinant').textContent = det.toFixed(2);
        
        const statusEl = document.getElementById('singularStatus');
        if (Math.abs(det) < 0.0001) {
            statusEl.textContent = 'The Matrix is SINGULAR';
            statusEl.className = 'status-text singular';
        } else {
            statusEl.textContent = 'The Matrix is NONSINGULAR';
            statusEl.className = 'status-text nonsingular';
        }
        
        errorMsg.style.display = 'none';
        document.getElementById('result').style.display = 'block';
    } catch (e) {
        errorMsg.textContent = 'Invalid matrix calculation!';
        errorMsg.style.display = 'block';
        document.getElementById('result').style.display = 'none';
    }
}

function matrix_input() {
    const size = document.getElementById('size').value;
    const errorMsg = document.getElementById('errorMessage');
    
    if (size === '' || size === null) {
        errorMsg.textContent = 'Please enter a matrix size!';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (size < 1 || size > 10) {
        errorMsg.textContent = 'Matrix size must be between 1 and 10!';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (!Number.isInteger(Number(size))) {
        errorMsg.textContent = 'Matrix size must be a whole number!';
        errorMsg.style.display = 'block';
        return;
    }
    
    errorMsg.style.display = 'none';
    create_matrix();
}

// Button Interactions
function reset_calculator() {
    document.getElementById('step1').style.display = 'block';
    document.getElementById('matrixContainer').innerHTML = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('size').value = '';
    document.getElementById('errorMessage').style.display = 'none';
}

function startApp() {
    document.getElementById('start_screen').style.display = 'none';
}

function goToStartScreen() {
    const startScreen = document.getElementById('start_screen');
    startScreen.style.display = 'flex';
}

function openInstructions() {
    document.getElementById('instructionsPanel').style.display = 'block';
    document.getElementById('backdrop').style.display = 'block';
}

function closeInstructions() {
    document.getElementById('instructionsPanel').style.display = 'none';
    document.getElementById('backdrop').style.display = 'none';
}