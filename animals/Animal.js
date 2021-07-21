class Animal {

    /** @var {number} */
    x;

    /** @var {number} */
    y;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @return {boolean}
     */
    canMove() {
        return iAmLucky(50);
    }

    /**
     * @param {BinaryMatrix} movementsArea
     * @return {Array}
     */
    getNextMove(movementsArea) {

        let availableTiles = movementsArea.getFilledNeighbors(this.x, this.y, 1);
        availableTiles.push([this.x, this.y]);

        return availableTiles.randomElement();
    }

    /**
     * @param {BinaryMatrix} movementsArea
     * @return {boolean}
     */
    move(movementsArea) {

        let xy = this.getNextMove(movementsArea);

        this.x = xy[0];
        this.y = xy[1];

        return true;
    }
}