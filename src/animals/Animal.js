import {getStep, throwError} from "../helpers.js";

export default class Animal {

    static ANIMAL_NAME = 'Animal';

    /** @var {number} */
    x;

    /** @var {number} */
    y;

    /** @var {Object} */
    settings;

    /** @var {string} */
    id;

    /** @var {Array} */
    history;

    /**
     * @param {number} x
     * @param {number} y
     * @param {Object} settings
     */
    constructor(x, y, settings) {
        this.id = this.getName() + '-' + getStep();
        this.x = x;
        this.y = y;
        this.settings = settings;
        this.history = [];
    }

    /**
     * @returns {string}
     */
    getName() {
        return this.constructor.ANIMAL_NAME;
    }

    /**
     * @returns {*}
     */
    getSettings() {
        return this.settings;
    }

    /**
     * 0 -> 100
     * @returns {number}
     */
    getMoveChance() {
        return this.getSettings().moveChance;
    }

    /**
     * @returns {null|string}
     */
    getImage() {
        return this.getSettings().image;
    }

    /**
     * @returns {null|string}
     */
    getColor() {
        return this.getSettings().color;
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