// Stack class and rendering
class Stack {
    constructor() {
        this.items = [];
    }
    push(value) {
        this.items.push(value);
    }
    pop() {
        return this.items.pop();
    }
    top() {
        return this.items[this.items.length - 1];
    }
    getItems() {
        return [...this.items];
    }
}

function renderStack(stack) {
    dsVisualization.innerHTML = '';
    dsNodes = [];
    dsVisualization.style.justifyContent = 'center';
    dsVisualization.style.flexDirection = 'column-reverse';

    const items = stack.getItems();
    items.forEach((value) => {
        const node = document.createElement('div');
        node.classList.add('stack-node');
        node.textContent = value;
        dsVisualization.appendChild(node);
        dsNodes.push(node);
    });
}

async function performStackOp(op, value) {
    try {
        if (!currentDS || !(currentDS instanceof Stack)) {
            currentDS = new Stack();
            renderStack(currentDS);
        }
        const stack = currentDS;
        let result = null;

        dsNodes.forEach(node => node.classList.remove('active', 'found'));
        dsMessage.textContent = `Performing ${op}...`;

        if (op === 'push') {
            if (isNaN(parseInt(value))) {
                throw new Error('Invalid value provided for push operation.');
            }
            stack.push(parseInt(value));
            renderStack(stack);
            highlightNode(dsNodes.length - 1, 'active');
            await sleep(1000);
        } else if (op === 'pop') {
            if (stack.getItems().length === 0) {
                throw new Error('Cannot pop from an empty stack.');
            }
            if (dsNodes.length > 0) {
                highlightNode(dsNodes.length - 1, 'active');
                await sleep(500);
            }
            result = stack.pop();
            if (result !== undefined) {
                renderStack(stack);
            }
        } else if (op === 'top') {
            if (stack.getItems().length === 0) {
                throw new Error('Cannot get top of an empty stack.');
            }
            result = stack.top();
            if (result !== undefined && dsNodes.length > 0) {
                highlightNode(dsNodes.length - 1, 'found');
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
