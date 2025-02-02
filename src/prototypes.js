Array.prototype.randomElement = function () {
    return this.length ? this[Math.floor(Math.random() * this.length)] : undefined;
};
Array.prototype.removeElementByIndex = function (index) {
    return this.filter((_, i) => i !== index);
};
Array.prototype.removeElementByValue = function (value) {
    return this.filter(e => e !== value);
};
Array.prototype.shuffle = function () {
    const arrayCopy = [...this];
    let j, temp;
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arrayCopy[i];
        arrayCopy[i] = arrayCopy[j];
        arrayCopy[j] = temp;
    }
    return arrayCopy;
};
Array.prototype.intersect = function (array) {
    return this.filter((value) => array.includes(value));
};
Array.prototype.diff = function (array) {
    return this.filter((value) => !array.includes(value));
};
Array.prototype.includesCell = function (cell) {
    return this.some(([x, y]) => x === cell[0] && y === cell[1]);
};
Array.prototype.intersectCells = function (array) {
    return this.filter((cell) => array.includesCell(cell));
};
Array.prototype.diffCells = function (array) {
    return this.filter((cell) => !array.includesCell(cell));
};
Array.prototype.unique = function () {
    return this.filter((value, index, self) => index === self.findIndex((t) => Array.isArray(value) && Array.isArray(t)
        ? value.length === t.length && value.every((val, i) => val === t[i])
        : t === value));
};
Array.prototype.getClosestDistanceTo = function (x, y) {
    let minSq = Number.MAX_SAFE_INTEGER;
    // Using squared distance to avoid unnecessary sqrt calls in the loop.
    this.forEach(([cx, cy]) => {
        const dx = x - cx, dy = y - cy;
        const dSq = dx * dx + dy * dy;
        if (dSq < minSq) {
            minSq = dSq;
        }
    });
    return Math.sqrt(minSq);
};
Array.prototype.getClosestDistanceToCell = function (cell) {
    // Delegates to getClosestDistanceTo using the cell's coordinates.
    return this.getClosestDistanceTo(cell[0], cell[1]);
};
export {};
