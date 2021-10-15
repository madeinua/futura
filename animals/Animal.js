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

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.id = this.getName() + '-' + x + '-' + y;
        this.x = x;
        this.y = y;
        this.age = 0;
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
     * @return {number}
     */
    getLifespan() {
        return 15;
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
}