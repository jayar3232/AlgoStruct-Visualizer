function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightNode(index, className) {
    if (typeof dsNodes === 'undefined') return;
    dsNodes.forEach(node => node.classList.remove('active', 'found'));
    if (index >= 0 && index < dsNodes.length) {
        dsNodes[index].classList.add(className);
        // Ensure visibility when highlighting
        dsNodes[index].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
}
