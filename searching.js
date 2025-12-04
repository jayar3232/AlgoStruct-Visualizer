function createBars(data) {
    visualization.innerHTML = '';
    data.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = value * 20 + 'px';
        bar.textContent = value;
        visualization.appendChild(bar);
    });
}

async function linearSearch(data, target) {
    for (let i = 0; i < data.length; i++) {
        highlightBar(i, 'active');
        await sleep(500);
        if (data[i] === target) {
            highlightBar(i, 'found');
            return i;
        } else {
            highlightBar(i, '');
        }
    }
    return -1;
}

async function binarySearch(data, target) {
    let left = 0;
    let right = data.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        highlightBar(mid, 'active');
        await sleep(700);
        if (data[mid] === target) {
            highlightBar(mid, 'found');
            return mid;
        } else if (data[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        highlightBar(mid, '');
    }
    return -1;
}

function highlightBar(index, className) {
    const bars = visualization.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.classList.remove('active', 'found');
    });
    if (index >= 0 && index < bars.length && className) {
        bars[index].classList.add(className);
        bars[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
