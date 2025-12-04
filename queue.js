// Queue class and rendering
class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(value) {
        this.items.push(value);
    }
    dequeue() {
        return this.items.shift();
    }
    rear() {
        return this.items[this.items.length - 1];
    }
    peek() {
        return this.items[0];
    }
    getItems() {
        return [...this.items];
    }
}

function renderQueue(queue) {
    dsVisualization.innerHTML = '';
    dsNodes = [];
    dsVisualization.style.justifyContent = 'flex-start';
    dsVisualization.style.flexDirection = 'row';

    const items = queue.getItems();
    items.forEach((value, index) => {
        const node = document.createElement('div');
        node.classList.add('queue-node');
        node.textContent = value;
        if (index === 0) node.style.borderLeft = '4px solid #50c878';
        if (index === items.length - 1) node.style.borderRight = '4px solid #e94e77';
        dsVisualization.appendChild(node);
        dsNodes.push(node);
    });
}

async function performQueueOp(op, value) {
    try {
        if (!currentDS || !(currentDS instanceof Queue)) {
            currentDS = new Queue();
            renderQueue(currentDS);
        }
        const queue = currentDS;
        let result = null;

        dsNodes.forEach(node => node.classList.remove('active', 'found'));
        dsMessage.textContent = `Performing ${op}...`;

        if (op === 'enqueue') {
            if (isNaN(parseInt(value))) {
                throw new Error('Invalid value provided for enqueue operation.');
            }
            queue.enqueue(parseInt(value));
            renderQueue(queue);
            highlightNode(dsNodes.length - 1, 'active');
            await sleep(1000);
        } else if (op === 'dequeue') {
            if (queue.getItems().length === 0) {
                throw new Error('Cannot dequeue from an empty queue.');
            }
            if (dsNodes.length > 0) {
                highlightNode(0, 'active');
                await sleep(500);
            }
            result = queue.dequeue();
            if (result !== undefined) {
                renderQueue(queue);
            }
        } else if (op === 'rear') {
            if (queue.getItems().length === 0) {
                throw new Error('Cannot get rear of an empty queue.');
            }
            result = queue.rear();
            if (result !== undefined && dsNodes.length > 0) {
                highlightNode(dsNodes.length - 1, 'found');
                await sleep(1000);
            }
        } else if (op === 'peek') {
            if (queue.getItems().length === 0) {
                throw new Error('Cannot peek an empty queue.');
            }
            result = queue.peek();
            if (result !== undefined && dsNodes.length > 0) {
                highlightNode(0, 'found');
                await sleep(1000);
            }
        }

        dsNodes.forEach(node => node.classList.remove('active', 'found'));
        return result;
    } catch (error) {
        dsMessage.textContent = `Error: ${error.message}`;
        return null;
    }
}
