// Linked list classes and operations (Singly + Doubly)
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    insert(index, value) {
        if (index < 0 || index > this.size) return false;
        const newNode = new Node(value);
        if (index === 0) {
            newNode.next = this.head;
            this.head = newNode;
            if (this.size === 0) this.tail = newNode;
        } else {
            let curr = this.head;
            for (let i = 0; i < index - 1; i++) curr = curr.next;
            newNode.next = curr.next;
            curr.next = newNode;
            if (index === this.size) this.tail = newNode;
        }
        this.size++;
        return true;
    }
    unshift(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
        if (this.size === 0) this.tail = newNode;
        this.size++;
        return true;
    }
    remove(index) {
        if (index < 0 || index >= this.size) return null;
        let removed;
        if (index === 0) {
            removed = this.head.value;
            this.head = this.head.next;
            if (!this.head) this.tail = null;
        } else {
            let curr = this.head;
            for (let i = 0; i < index - 1; i++) curr = curr.next;
            removed = curr.next.value;
            curr.next = curr.next.next;
            if (index === this.size - 1) this.tail = curr;
        }
        this.size--;
        return removed;
    }
    get(index) {
        if (index < 0 || index >= this.size) return null;
        let curr = this.head;
        for (let i = 0; i < index; i++) curr = curr.next;
        return curr.value;
    }
    set(index, value) {
        if (index < 0 || index >= this.size) return false;
        let curr = this.head;
        for (let i = 0; i < index; i++) curr = curr.next;
        curr.value = value;
        return true;
    }
    reverse() {
        let prev = null;
        let curr = this.head;
        this.tail = curr;
        while (curr) {
            let next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        this.head = prev;
    }
    getNodes() {
        const nodes = [];
        let curr = this.head;
        while (curr) {
            nodes.push(curr.value);
            curr = curr.next;
        }
        return nodes;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    insert(index, value) {
        if (index < 0 || index > this.size) return false;
        const newNode = new Node(value);
        if (this.size === 0) {
            this.head = newNode;
            this.tail = newNode;
        } else if (index === 0) {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        } else if (index === this.size) {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        } else {
            let curr = index <= this.size / 2 ? this.head : this.tail;
            if (index <= this.size / 2) {
                for (let i = 0; i < index; i++) curr = curr.next;
            } else {
                for (let i = this.size - 1; i > index; i--) curr = curr.prev;
            }
            newNode.next = curr;
            newNode.prev = curr.prev;
            curr.prev.next = newNode;
            curr.prev = newNode;
        }
        this.size++;
        return true;
    }
    unshift(value) {
        const newNode = new Node(value);
        if (this.size === 0) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
        return true;
    }
    remove(index) {
        if (index < 0 || index >= this.size) return null;
        let removedNode;
        if (index === 0) {
            removedNode = this.head;
            this.head = removedNode.next;
            if (this.head) this.head.prev = null;
            else this.tail = null;
        } else if (index === this.size - 1) {
            removedNode = this.tail;
            this.tail = removedNode.prev;
            if (this.tail) this.tail.next = null;
            else this.head = null;
        } else {
            let curr = index < this.size / 2 ? this.head : this.tail;
            if (index < this.size / 2) {
                for (let i = 0; i < index; i++) curr = curr.next;
            } else {
                for (let i = this.size - 1; i > index; i--) curr = curr.prev;
            }
            removedNode = curr;
            curr.prev.next = curr.next;
            curr.next.prev = curr.prev;
        }
        this.size--;
        return removedNode.value;
    }
    get(index) {
        if (index < 0 || index >= this.size) return null;
        let curr = this.head;
        for (let i = 0; i < index; i++) curr = curr.next;
        return curr.value;
    }
    set(index, value) {
        if (index < 0 || index >= this.size) return false;
        let curr = this.head;
        for (let i = 0; i < index; i++) curr = curr.next;
        curr.value = value;
        return true;
    }
    reverse() {
        let curr = this.head;
        while (curr) {
            [curr.next, curr.prev] = [curr.prev, curr.next];
            curr = curr.prev;
        }
        [this.head, this.tail] = [this.tail, this.head];
    }
    getNodes() {
        const nodes = [];
        let curr = this.head;
        while (curr) {
            nodes.push(curr.value);
            curr = curr.next;
        }
        return nodes;
    }
}

// Render and operations for linked lists
function renderLinkedList(list, type) {
    dsVisualization.innerHTML = '';
    dsNodes = [];
    dsVisualization.style.justifyContent = 'flex-start';
    const nodes = list.getNodes();

    nodes.forEach((value, index) => {
        const container = document.createElement('div');
        container.classList.add('list-container');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginRight = '20px';
        container.style.position = 'relative';

        const node = document.createElement('div');
        node.classList.add('node');
        node.textContent = value;
        node.style.margin = '0';
        container.appendChild(node);

        if (index < nodes.length - 1) {
            const arrowContainer = document.createElement('div');
            arrowContainer.classList.add('arrow-container');
            arrowContainer.style.display = 'flex';
            arrowContainer.style.flexDirection = 'column';
            arrowContainer.style.alignItems = 'center';
            arrowContainer.style.justifyContent = 'center';
            arrowContainer.style.marginLeft = '8px';

            const fwd = document.createElement('div');
            fwd.classList.add('list-arrow');
            fwd.textContent = '→';
            fwd.style.lineHeight = '1';
            fwd.style.fontSize = '18px';
            arrowContainer.appendChild(fwd);

            if (type === 'doubly') {
                const back = document.createElement('div');
                back.classList.add('list-back-arrow');
                back.textContent = '←';
                back.style.lineHeight = '1';
                back.style.fontSize = '14px';
                back.style.marginTop = '2px';
                arrowContainer.appendChild(back);
            }

            container.appendChild(arrowContainer);
        }

        dsVisualization.appendChild(container);
        dsNodes.push(node);
    });
}

async function performLinkedListOp(type, op, index, value) {
    try {
        if (!currentDS || (type === 'singly' && !(currentDS instanceof SinglyLinkedList)) || (type === 'doubly' && !(currentDS instanceof DoublyLinkedList))) {
            currentDS = type === 'singly' ? new SinglyLinkedList() : new DoublyLinkedList();
            renderLinkedList(currentDS, type);
        }
        const list = currentDS;
        let result = null;
        let highlightIndex = parseInt(index);

        // Validate index is a number for operations that need it
        if ((op === 'get' || op === 'set' || op === 'insert' || op === 'remove') && isNaN(highlightIndex) && op !== 'insert') {
            throw new Error(`Invalid index provided for ${op} operation.`);
        }

        // Validate value is a number for operations that need it
        if ((op === 'set' || op === 'unshift' || op === 'insert') && isNaN(parseInt(value))) {
            throw new Error(`Invalid value provided for ${op} operation.`);
        }

        dsNodes.forEach(node => node.classList.remove('active', 'found'));
        dsMessage.textContent = `Performing ${op}...`;

        if (op === 'get') {
            if (highlightIndex < 0 || highlightIndex >= list.size) {
                throw new Error(`Index ${highlightIndex} is out of bounds. List size: ${list.size}`);
            }
            result = list.get(highlightIndex);
            if (result !== null) {
                highlightNode(highlightIndex, 'found');
                await sleep(1000);
            }
        } else if (op === 'unshift') {
            result = list.unshift(parseInt(value));
            if (result) {
                renderLinkedList(list, type);
                highlightNode(0, 'active');
                await sleep(800);
            }
        } else if (op === 'set') {
            if (highlightIndex < 0 || highlightIndex >= list.size) {
                throw new Error(`Index ${highlightIndex} is out of bounds. List size: ${list.size}`);
            }
            result = list.set(highlightIndex, parseInt(value));
            if (result) {
                highlightNode(highlightIndex, 'active');
                await sleep(500);
                renderLinkedList(list, type);
            }
        } else if (op === 'insert') {
            if (isNaN(highlightIndex)) highlightIndex = list.size;
            if (highlightIndex < 0 || highlightIndex > list.size) {
                throw new Error(`Index ${highlightIndex} is out of bounds. Valid range: 0-${list.size}`);
            }
            result = list.insert(highlightIndex, parseInt(value));
            if (result) {
                renderLinkedList(list, type);
                highlightNode(highlightIndex, 'active');
                await sleep(1000);
            }
        } else if (op === 'remove') {
            if (highlightIndex < 0 || highlightIndex >= list.size) {
                throw new Error(`Index ${highlightIndex} is out of bounds. List size: ${list.size}`);
            }
            if (highlightIndex >= 0 && highlightIndex < list.size) {
                highlightNode(highlightIndex, 'active');
                await sleep(500);
                result = list.remove(highlightIndex);
                if (result !== null) {
                    renderLinkedList(list, type);
                }
            } else {
                result = null;
            }
        } else if (op === 'reverse') {
            if (list.size === 0) {
                throw new Error('Cannot reverse an empty list.');
            }
            list.reverse();
            renderLinkedList(list, type);
            await sleep(1000);
        }

        dsNodes.forEach(node => node.classList.remove('active', 'found'));

        return result;
    } catch (error) {
        dsMessage.textContent = `Error: ${error.message}`;
        return null;
    }
}
