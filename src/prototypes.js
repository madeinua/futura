/**
 * Retrieve random element of array
 */
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
};
/**
 * Remove/delete an element from the array by the index
 */
Array.prototype.removeElementByIndex = function (index) {
    return this.filter((e, i) => i !== index);
};
/**
 * Remove/delete an element from the array by the value
 */
Array.prototype.removeElementByValue = function (value) {
    return this.filter((e) => e !== value);
};
/**
 * Shuffles array
 */
Array.prototype.shuffle = function () {
    let j, x, i;
    for (i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this;
};
Array.prototype.intersect = function (array) {
    return this.filter(value => array.includes(value));
};
Array.prototype.diff = function (array) {
    return this.filter(value => !array.includes(value));
};
Array.prototype.includesCell = function (xy) {
    return this.some(e => ((e[0] === xy[0]) && (e[1] === xy[1])));
};
Array.prototype.intersectCells = function (array) {
    return this.filter(value => array.includesCell(value));
};
Array.prototype.diffCells = function (array) {
    return this.filter(value => !array.includesCell(value));
};
/**
 * Retrieve array of unique values
 */
Array.prototype.unique = function () {
    let a = this.concat(), isArray = a.length > 0 && a[0] instanceof Array;
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (isArray
                ? a[i][0] === a[j][0] && a[i][1] === a[j][1]
                : a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
};
/**
 * Retrieve the closest distance to the cell
 */
Array.prototype.getClosestDistanceTo = function (x, y) {
    let closeness = Number.MAX_SAFE_INTEGER, distance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    };
    for (let i = 0; i < this.length; i++) {
        closeness = Math.min(closeness, distance(x, y, this[i][0], this[i][1]));
    }
    return closeness;
};
export {};
