// Binary tree implementation and rendering
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.domNode = null;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
    }
    insert(value) {
        // Insert in level-order (fill left to right) so tree structure follows insertion order
        const newNode = new TreeNode(value);
        if (!this.root) { this.root = newNode; return; }
        const q = [this.root];
        while (q.length) {
            const node = q.shift();
            if (!node.left) { node.left = newNode; return; }
            else q.push(node.left);
            if (!node.right) { node.right = newNode; return; }
            else q.push(node.right);
        }
    }
    // Remove a node by value. For a level-order tree, find the node, replace its value
    // with the deepest rightmost node, and remove that deepest node.
    remove(value) {
        if (!this.root) return;
        if (this.root.value === value && !this.root.left && !this.root.right) { this.root = null; return; }

        // BFS to find node to remove and track last node and its parent
        const q = [this.root];
        let nodeToRemove = null;
        let last = null;
        while (q.length) {
            const node = q.shift();
            if (node.value === value) nodeToRemove = node;
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
            last = node;
        }

        if (!nodeToRemove) return; // not found

        // If last is the nodeToRemove, just remove it
        if (last === nodeToRemove) {
            const q2 = [this.root];
            while (q2.length) {
                const node = q2.shift();
                if (node.left) {
                    if (node.left === last) { node.left = null; return; }
                    q2.push(node.left);
                }
                if (node.right) {
                    if (node.right === last) { node.right = null; return; }
                    q2.push(node.right);
                }
            }
            return;
        }

        // Replace value and remove last
        nodeToRemove.value = last.value;
        // remove last node from parent
        const q3 = [this.root];
        while (q3.length) {
            const node = q3.shift();
            if (node.left) {
                if (node.left === last) { node.left = null; break; }
                q3.push(node.left);
            }
            if (node.right) {
                if (node.right === last) { node.right = null; break; }
                q3.push(node.right);
            }
        }
    }
    _findMin(node) { while (node.left) node = node.left; return node; }

    inorderTraverse() { const res=[]; this._inorderHelper(this.root, res); return res; }
    _inorderHelper(node, res) { if (!node) return; this._inorderHelper(node.left, res); res.push(node); this._inorderHelper(node.right, res); }
    preorderTraverse() { const res=[]; this._preorderHelper(this.root, res); return res; }
    _preorderHelper(node,res){ if(!node) return; res.push(node); this._preorderHelper(node.left,res); this._preorderHelper(node.right,res); }
    postorderTraverse() { const res=[]; this._postorderHelper(this.root, res); return res; }
    _postorderHelper(node,res){ if(!node) return; this._postorderHelper(node.left,res); this._postorderHelper(node.right,res); res.push(node); }

    // render using min/max x-range recursion
    getNodesForRender() {
        if (!this.root) return;
        const nodeSize = 40;
        const vSpace = 80;
        dsNodes = [];
        dsVisualization.innerHTML = '';
        dsVisualization.style.position = 'relative';

        // Flatten tree with inorder to compute horizontal order
        const inorderList = [];
        const assignDepth = (node, depth) => {
            if (!node) return;
            assignDepth(node.left, depth + 1);
            inorderList.push({ node, depth });
            assignDepth(node.right, depth + 1);
        };
        assignDepth(this.root, 0);

        const totalNodes = inorderList.length || 1;
        const totalWidth = (dsVisualization && dsVisualization.clientWidth && dsVisualization.clientWidth > 200) ? dsVisualization.clientWidth : 900;
        const xOffset = totalWidth / (totalNodes + 1);

        // Create DOM nodes based on inorder position and recorded depth
        inorderList.forEach((entry, idx) => {
            const midX = (idx + 1) * xOffset;
            const y = entry.depth * vSpace + 20;
            const el = document.createElement('div');
            el.classList.add('tree-node');
            el.textContent = entry.node.value;
            el.style.position = 'absolute';
            el.style.left = (midX - nodeSize / 2) + 'px';
            el.style.top = y + 'px';
            entry.node.domNode = el;
            dsVisualization.appendChild(el);
            dsNodes.push(el);
        });

        // Draw connectors between parent and children using dom positions
        const drawLines = (node) => {
            if (!node || !node.domNode) return;
            const x1 = node.domNode.offsetLeft + nodeSize / 2;
            const y1 = node.domNode.offsetTop + nodeSize;
            if (node.left && node.left.domNode) {
                const x2 = node.left.domNode.offsetLeft + nodeSize / 2;
                const y2 = node.left.domNode.offsetTop;
                createLine(x1, y1, x2, y2);
            }
            if (node.right && node.right.domNode) {
                const x2 = node.right.domNode.offsetLeft + nodeSize / 2;
                const y2 = node.right.domNode.offsetTop;
                createLine(x1, y1, x2, y2);
            }
            drawLines(node.left);
            drawLines(node.right);
        };
        drawLines(this.root);

        const maxFinalY = dsNodes.reduce((max, n) => Math.max(max, n.offsetTop + nodeSize), 0);
        dsVisualization.style.minHeight = `${maxFinalY + 20}px`;
    }
}

function createLine(x1,y1,x2,y2) {
    const line = document.createElement('div');
    line.classList.add('tree-connector');
    const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.style.position = 'absolute';
    line.style.width = `${length}px`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    dsVisualization.appendChild(line);
}

function renderTree(tree) {
    if (!tree) return;
    tree.getNodesForRender();
}

async function performTreeOp(op, value) {
    try {
        if (!currentDS || !(currentDS instanceof BinaryTree)) currentDS = new BinaryTree();
        const val = parseInt(value);
        
        if ((op === 'insert' || op === 'remove') && isNaN(val)) {
            throw new Error('Invalid value provided for tree operation.');
        }

        dsNodes.forEach(n=>n.classList.remove('active','found'));
        dsMessage.textContent = `Performing ${op}...`;
        
        if (op === 'insert') {
            currentDS.insert(val);
            renderTree(currentDS);
            const find = (node,t)=>{ if(!node) return null; if(node.value===t) return node; return find(node.left,t)||find(node.right,t); };
            const f = find(currentDS.root,val);
            if (f && f.domNode) { f.domNode.classList.add('active'); await sleep(800); f.domNode.classList.remove('active'); }
        } else if (op === 'remove') {
            const find = (node,t)=>{ if(!node) return null; if(node.value===t) return node; return find(node.left,t)||find(node.right,t); };
            const f = find(currentDS.root,val);
            if (!f) {
                throw new Error(`Value ${val} not found in tree.`);
            }
            if (f && f.domNode) { f.domNode.classList.add('active'); await sleep(600); }
            currentDS.remove(val);
            renderTree(currentDS);
        } else if (op && op.startsWith('traverse')) {
            if (!currentDS.root) {
                throw new Error('Cannot traverse an empty tree.');
            }
            renderTree(currentDS);
            let traversal = [];
            let label = '';
            if (op === 'traverse-inorder') { traversal = currentDS.inorderTraverse(); label='Inorder'; }
            else if (op === 'traverse-preorder') { traversal = currentDS.preorderTraverse(); label='Preorder'; }
            else if (op === 'traverse-postorder') { traversal = currentDS.postorderTraverse(); label='Postorder'; }
            dsMessage.textContent = `${label} Traversal: ${traversal.map(n=>n.value).join(', ')}`;
            for (const n of traversal) { if (n.domNode) { n.domNode.classList.add('active'); await sleep(500); n.domNode.classList.remove('active'); } }
        }
        dsNodes.forEach(n=>n.classList.remove('active','found'));
    } catch (error) {
        dsMessage.textContent = `Error: ${error.message}`;
    }
}
