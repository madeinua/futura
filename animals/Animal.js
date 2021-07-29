class Animal {

    static NAME = 'Animal';

    /** @var {number} */
    x;

    /** @var {number} */
    y;

    /** @var {string} */
    id;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = this.constructor.NAME + '-' + x + '-' + y;
    }

    /**
     * @return {boolean}
     */
    canMove() {
        return true;
    }

    /**
     * @param {Array} xy
     */
    moveToTile(xy) {
        this.x = xy[0];
        this.y = xy[1];
    }

    /**
     * @param {Array} xy
     * @return {boolean}
     */
    atPos(xy) {
        return xy[0] === this.x && xy[1] === this.y;
    }
}