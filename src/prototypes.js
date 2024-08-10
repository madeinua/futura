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
    let j, x;
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arrayCopy[i];
        arrayCopy[i] = arrayCopy[j];
        arrayCopy[j] = x;
    }
    return arrayCopy;
};
Array.prototype.intersect = function (array) {
    return this.filter(value => array.includes(value));
};
Array.prototype.diff = function (array) {
    return this.filter(value => !array.includes(value));
};
Array.prototype.includesCell = function (cell) {
    return this.some(([x, y]) => x === cell[0] && y === cell[1]);
};
Array.prototype.intersectCells = function (array) {
    return this.filter(cell => array.includesCell(cell));
};
Array.prototype.diffCells = function (array) {
    return this.filter(cell => !array.includesCell(cell));
};
Array.prototype.unique = function () {
    return this.filter((value, index, self) => index === self.findIndex((t) => (Array.isArray(value) && Array.isArray(t)
        ? value.length === t.length && value.every((val, i) => val === t[i])
        : t === value)));
};
Array.prototype.getClosestDistanceTo = function (x, y) {
    let closestDistance = Number.MAX_SAFE_INTEGER;
    const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    this.forEach(([cx, cy]) => {
        closestDistance = Math.min(closestDistance, distance(x, y, cx, cy));
    });
    return closestDistance;
};
export {};
