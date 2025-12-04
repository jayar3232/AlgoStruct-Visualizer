// Tab switching
function switchTab(tabName, evt) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const section = document.getElementById(tabName + '-section');
    if (section) section.classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (evt && evt.target) {
        evt.target.classList.add('active');
    } else {
        // fallback: try to find a button that was intended for this tab
        const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.trim().toLowerCase().includes(tabName));
        if (btn) btn.classList.add('active');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Search Section
const dataInput = document.getElementById('dataInput');
const algorithmSelect = document.getElementById('algorithmSelect');
const targetInput = document.getElementById('targetInput');
const startBtn = document.getElementById('startBtn');
const visualization = document.getElementById('visualization');
const message = document.getElementById('message');

startBtn.addEventListener('click', async () => {
    const rawData = dataInput.value.trim();
    if (!rawData) {
        alert('Please enter array elements.');
        return;
    }
    let data = rawData.split(',').map(x => parseInt(x.trim()));
    if (data.some(isNaN)) {
        alert('Please enter valid numbers separated by commas.');
        return;
    }

    const targetVal = parseInt(targetInput.value.trim());
    if (isNaN(targetVal)) {
        alert('Please enter a valid target number.');
        return;
    }

    const algorithm = algorithmSelect.value;

    if (algorithm === 'binary') {
        data.sort((a, b) => a - b);
        createBars(data);
    } else {
        createBars(data);
    }

    message.textContent = 'Searching...';
    let index = -1;
    if (algorithm === 'linear') {
        index = await linearSearch(data, targetVal);
    } else if (algorithm === 'binary') {
        index = await binarySearch(data, targetVal);
    }

    if (index === -1) {
        message.textContent = `Value ${targetVal} not found in the array.`;
    } else {
        message.textContent = `Value ${targetVal} found at index ${index}.`;
    }
});

// Sorting Section
const sortDataInput = document.getElementById('sortDataInput');
const sortAlgorithmSelect = document.getElementById('sortAlgorithmSelect');
const startSortBtn = document.getElementById('startSortBtn');
const sortVisualization = document.getElementById('sortVisualization');
const sortMessage = document.getElementById('sortMessage');

startSortBtn.addEventListener('click', async () => {
    const rawData = sortDataInput.value.trim();
    if (!rawData) {
        alert('Please enter array elements.');
        return;
    }
    let data = rawData.split(',').map(x => parseInt(x.trim()));
    if (data.some(isNaN)) {
        alert('Please enter valid numbers separated by commas.');
        return;
    }

    const algorithm = sortAlgorithmSelect.value;
    createSortBars(data);
    let bars = getSortBars();

    sortMessage.textContent = 'Sorting...';

    let temp = new Array(data.length).fill(0);

    if (algorithm === 'selection') {
        await selectionSort(data, bars);
    } else if (algorithm === 'insertion') {
        await insertionSort(data, bars);
    } else if (algorithm === 'merge') {
        await mergeSortHelper(data, temp, 0, data.length - 1, bars);
    }

    sortMessage.textContent = 'Sorting completed!';
});

// Data Structures Section
const dsTypeSelect = document.getElementById('dsTypeSelect');
const dsVisualization = document.getElementById('dsVisualization');
const dsMessage = document.getElementById('dsMessage');

function switchDS() {
    const dsType = dsTypeSelect.value;
    document.querySelectorAll('.operation-group').forEach(group => {
        group.classList.remove('active');
    });
    document.getElementById(dsType + '-operations').classList.add('active');

    // Clear visualization and reset currentDS; DS instances will be created on-demand
    dsVisualization.innerHTML = '';
    dsNodes = [];
    currentDS = null;
}

// Toggle visibility of input fields based on operation type
function toggleLinkedListInputs(type) {
    const indexInput = document.getElementById(`${type}IndexInput`);
    const valueInput = document.getElementById(`${type}ValueInput`);
    const opSelect = document.getElementById(`${type}OpSelect`);
    const op = opSelect.value;

    // Hide all by default
    indexInput.style.display = 'none';
    valueInput.style.display = 'none';
    indexInput.previousElementSibling.style.display = 'none'; // Hide index label
    valueInput.previousElementSibling.style.display = 'none'; // Hide value label

    // Show based on operation
    if (op === 'get' || op === 'remove') {
        indexInput.style.display = 'block';
        indexInput.previousElementSibling.style.display = 'block';
    } else if (op === 'set') {
        indexInput.style.display = 'block';
        valueInput.style.display = 'block';
        indexInput.previousElementSibling.style.display = 'block';
        valueInput.previousElementSibling.style.display = 'block';
    } else if (op === 'insert') {
        indexInput.style.display = 'block';
        valueInput.style.display = 'block';
        indexInput.previousElementSibling.style.display = 'block';
        valueInput.previousElementSibling.style.display = 'block';
    } else if (op === 'unshift') {
        valueInput.style.display = 'block';
        valueInput.previousElementSibling.style.display = 'block';
    }
}

// Add change listeners to linked list operation selects
document.getElementById('singlyOpSelect').addEventListener('change', () => toggleLinkedListInputs('singly'));
document.getElementById('doublyOpSelect').addEventListener('change', () => toggleLinkedListInputs('doubly'));

// Initialize visibility on page load
toggleLinkedListInputs('singly');
toggleLinkedListInputs('doubly');

// Event Listeners for DS
document.getElementById('singlyBtn').addEventListener('click', async () => {
    const op = document.getElementById('singlyOpSelect').value;
    const index = document.getElementById('singlyIndexInput').value.trim();
    const value = document.getElementById('singlyValueInput').value.trim();
    if ((op === 'get' || op === 'remove') && !index) {
        alert('Index required.');
        return;
    }
    if (op === 'set' && (!index || !value)) {
        alert('Index and value required.');
        return;
    }
    // Insert may be used without index to append to the end
    if (op === 'insert' && !value) {
        alert('Value required for insert.');
        return;
    }
    if (op === 'reverse' && index) {
        alert('No index needed for reverse.');
        return;
    }
    dsMessage.textContent = `Performing ${op}...`;
    const result = await performLinkedListOp('singly', op, index, value);
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `${op} result: ${result}`;
    } else if (result === false) {
        dsMessage.textContent = 'Operation failed (invalid index).';
    } else {
        dsMessage.textContent = `${op} completed.`;
    }
});

document.getElementById('doublyBtn').addEventListener('click', async () => {
    const op = document.getElementById('doublyOpSelect').value;
    const index = document.getElementById('doublyIndexInput').value.trim();
    const value = document.getElementById('doublyValueInput').value.trim();
    if ((op === 'get' || op === 'remove') && !index) {
        alert('Index required.');
        return;
    }
    if (op === 'set' && (!index || !value)) {
        alert('Index and value required.');
        return;
    }
    if (op === 'insert' && !value) {
        alert('Value required for insert.');
        return;
    }
    if (op === 'reverse' && index) {
        alert('No index needed for reverse.');
        return;
    }
    dsMessage.textContent = `Performing ${op}...`;
    const result = await performLinkedListOp('doubly', op, index, value);
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `${op} result: ${result}`;
    } else if (result === false) {
        dsMessage.textContent = 'Operation failed (invalid index).';
    } else {
        dsMessage.textContent = `${op} completed.`;
    }
});

document.getElementById('stackPushBtn').addEventListener('click', async () => {
    const value = document.getElementById('stackValueInput').value.trim();
    if (!value) {
        alert('Value required for push.');
        return;
    }
    dsMessage.textContent = 'Performing push...';
    const result = await performStackOp('push', value);
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `Push result: ${result}`;
    } else {
        dsMessage.textContent = 'Push completed.';
    }
});

document.getElementById('stackPopBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing pop...';
    const result = await performStackOp('pop', '');
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `Pop result: ${result}`;
    } else {
        dsMessage.textContent = 'Pop completed.';
    }
});

document.getElementById('stackTopBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing top...';
    const result = await performStackOp('top', '');
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `Top result: ${result}`;
    } else {
        dsMessage.textContent = 'Top completed.';
    }
});

document.getElementById('stackResetBtn').addEventListener('click', () => {
    document.getElementById('stackValueInput').value = '';
    dsVisualization.innerHTML = '';
    dsMessage.textContent = '';
    dsNodes = [];
    currentDS = null;
});

document.getElementById('queueEnqueueBtn').addEventListener('click', async () => {
    const value = document.getElementById('queueValueInput').value.trim();
    if (!value) {
        alert('Value required for enqueue.');
        return;
    }
    dsMessage.textContent = 'Performing enqueue...';
    const result = await performQueueOp('enqueue', value);
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `Enqueue result: ${result}`;
    } else {
        dsMessage.textContent = 'Enqueue completed.';
    }
});

document.getElementById('queueDequeueBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing dequeue...';
    const result = await performQueueOp('dequeue', '');
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `Dequeue result: ${result}`;
    } else {
        dsMessage.textContent = 'Dequeue completed.';
    }
});

document.getElementById('queueRearBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing rear...';
    const result = await performQueueOp('rear', '');
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `Rear result: ${result}`;
    } else {
        dsMessage.textContent = 'Rear completed.';
    }
});

document.getElementById('queuePeekBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing peek...';
    const result = await performQueueOp('peek', '');
    if (result !== null && result !== undefined) {
        dsMessage.textContent = `Peek result: ${result}`;
    } else {
        dsMessage.textContent = 'Peek completed.';
    }
});

document.getElementById('queueResetBtn').addEventListener('click', () => {
    document.getElementById('queueValueInput').value = '';
    dsVisualization.innerHTML = '';
    dsMessage.textContent = '';
    dsNodes = [];
    currentDS = null;
});

document.getElementById('treeInsertBtn').addEventListener('click', async () => {
    const value = document.getElementById('treeValueInput').value.trim();
    if (!value) {
        alert('Value required for insert.');
        return;
    }
    dsMessage.textContent = 'Performing insert...';
    await performTreeOp('insert', value);
    dsMessage.textContent = 'Insert completed.';
});

document.getElementById('treeRemoveBtn').addEventListener('click', async () => {
    const value = document.getElementById('treeValueInput').value.trim();
    if (!value) {
        alert('Value required for remove.');
        return;
    }
    dsMessage.textContent = 'Performing remove...';
    await performTreeOp('remove', value);
    dsMessage.textContent = 'Remove completed.';
});

document.getElementById('treeInorderBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing inorder traversal...';
    await performTreeOp('traverse-inorder', '');
});

document.getElementById('treePreorderBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing preorder traversal...';
    await performTreeOp('traverse-preorder', '');
});

document.getElementById('treePostorderBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing postorder traversal...';
    await performTreeOp('traverse-postorder', '');
});

document.getElementById('treeResetBtn').addEventListener('click', () => {
    document.getElementById('treeValueInput').value = '';
    dsVisualization.innerHTML = '';
    dsMessage.textContent = '';
    dsNodes = [];
    currentDS = null;
});

// Reverse button handlers
document.getElementById('singlyReverseBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing reverse...';
    const result = await performLinkedListOp('singly', 'reverse', '', '');
    dsMessage.textContent = 'Reverse completed.';
});

document.getElementById('doublyReverseBtn').addEventListener('click', async () => {
    dsMessage.textContent = 'Performing reverse...';
    const result = await performLinkedListOp('doubly', 'reverse', '', '');
    dsMessage.textContent = 'Reverse completed.';
});

// Reset button handlers
document.getElementById('singlyResetBtn').addEventListener('click', () => {
    document.getElementById('singlyIndexInput').value = '';
    document.getElementById('singlyValueInput').value = '';
    document.getElementById('singlyOpSelect').value = 'get';
    toggleLinkedListInputs('singly');
    dsVisualization.innerHTML = '';
    dsMessage.textContent = '';
    dsNodes = [];
    currentDS = null;
});

document.getElementById('doublyResetBtn').addEventListener('click', () => {
    document.getElementById('doublyIndexInput').value = '';
    document.getElementById('doublyValueInput').value = '';
    document.getElementById('doublyOpSelect').value = 'get';
    toggleLinkedListInputs('doubly');
    dsVisualization.innerHTML = '';
    dsMessage.textContent = '';
    dsNodes = [];
    currentDS = null;
});

// Initial load
switchDS();
