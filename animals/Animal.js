class Animal {

    static NAME = 'Animal';

    /** @var {number} */
    x;

    /** @var {number} */
    y;

    /** @var {string} */
    id;

    /** @var {number} */
    age;

    /** @var {Array} */
    history;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.id = this.getName() + '-' + getTick();
        this.x = x;
        this.y = y;
        this.age = 0;
        this.history = [];
    }

    /**
     * @returns {string}
     */
    getName() {
        return this.constructor.NAME;
    }

    /**
     * @return {boolean}
     */
    canMove() {
        return true;
    }

    /**
     * 0 -> 100
     * @returns {number}
     */
    getMoveChance() {
        return 100;
    }

    /**
     * @returns {null|string}
     */
    getImage() {
        return null;
    }

    /**
     * @returns {string}
     */
    getColor() {
        return config.ANIMAL_COLOR;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    moveTo(x, y) {

        if (x === this.x && y === this.y) {
            throwError('Can not move to itself', 1, true);
            return;
        }

        this.history.push([this.x, this.y]);

        if (this.history.length > 5) {
            this.history.shift();
        }

        this.x = x;
        this.y = y;
    }

    /**
     * @returns {Array}
     */
    getPosition() {
        return [this.x, this.y];
    }

    /**
     * @param {number} pos
     * @returns {boolean|{Array}}
     */
    getHistoryAt(pos) {
        return this.history.length >= pos && pos > 0
            ? this.history[this.history.length - pos]
            : false;
    }

    /**
     * @returns {boolean|{Array}}
     */
    getPrevPosition() {
        return this.getHistoryAt(1);
    }
}