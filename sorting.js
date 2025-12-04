function createSortBars(data) {
    sortVisualization.innerHTML = '';
    data.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = value * 20 + 'px';
        bar.textContent = value;
        sortVisualization.appendChild(bar);
    });
}

function getSortBars() {
    return Array.from(sortVisualization.querySelectorAll('.bar'));
}

function updateBar(bar, value) {
    bar.style.height = value * 20 + 'px';
    bar.textContent = value;
}

function setClass(bar, className) {
    bar.classList.remove('comparing', 'min', 'sorted', 'dividing', 'active');
    if (className) {
        bar.classList.add(className);
    }
}

function swap(i, j, data, bars) {
    [data[i], data[j]] = [data[j], data[i]];
    updateBar(bars[i], data[i]);
    updateBar(bars[j], data[j]);
}

async function selectionSort(data, bars) {
    for (let i = 0; i < data.length - 1; i++) {
        let minIdx = i;
        setClass(bars[i], 'active'); // current position

        for (let j = i + 1; j < data.length; j++) {
            setClass(bars[j], 'comparing');
            await sleep(200);

            if (data[j] < data[minIdx]) {
                if (minIdx !== i) setClass(bars[minIdx], '');
                minIdx = j;
                setClass(bars[minIdx], 'min');
            }
            setClass(bars[j], '');
        }

        if (minIdx !== i) {
            swap(i, minIdx, data, bars);
            await sleep(300);
        }

        setClass(bars[i], 'sorted');
        if (minIdx !== i) setClass(bars[minIdx], 'sorted');
    }
}

async function insertionSort(data, bars) {
    for (let i = 1; i < data.length; i++) {
        let key = data[i];
        let keyBar = bars[i];
        setClass(keyBar, 'active');

        let j = i - 1;
        while (j >= 0 && data[j] > key) {
            setClass(bars[j], 'comparing');
            await sleep(200);

            data[j + 1] = data[j];
            updateBar(bars[j + 1], data[j + 1]);
            j--;
        }

        data[j + 1] = key;
        updateBar(bars[j + 1], key);
        setClass(keyBar, ''); // clear active if needed

        // Mark sorted portion
        for (let k = 0; k <= i; k++) {
            setClass(bars[k], 'sorted');
        }
        await sleep(300);
    }
}

async function mergeSortHelper(data, temp, left, right, bars) {
    if (left < right) {
        let mid = Math.floor((left + right) / 2);

        // Highlight dividing range briefly
        for (let idx = left; idx <= right; idx++) {
            setClass(bars[idx], 'dividing');
        }
        await sleep(200);

        await mergeSortHelper(data, temp, left, mid, bars);
        await mergeSortHelper(data, temp, mid + 1, right, bars);

        await mergeHelper(data, temp, left, mid, right, bars);

        // Clear dividing after merge
        for (let idx = left; idx <= right; idx++) {
            if (bars[idx].classList.contains('dividing')) {
                bars[idx].classList.remove('dividing');
            }
        }
    }
}

async function mergeHelper(data, temp, left, mid, right, bars) {
    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
        setClass(bars[i], 'comparing');
        setClass(bars[j], 'comparing');
        await sleep(300);

        if (data[i] <= data[j]) {
            temp[k++] = data[i++];
        } else {
            temp[k++] = data[j++];
        }

        // Clear previous comparisons
        if (i > left) setClass(bars[i - 1], '');
        if (j > mid + 1) setClass(bars[j - 1], '');
    }

    while (i <= mid) {
        temp[k++] = data[i++];
    }
    while (j <= right) {
        temp[k++] = data[j++];
    }

    // Copy back with animation
    for (let p = left; p <= right; p++) {
        data[p] = temp[p];
        updateBar(bars[p], data[p]);
        setClass(bars[p], 'sorted');
        await sleep(150);
    }
}
