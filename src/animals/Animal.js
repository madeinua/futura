import { getStep, throwError } from "../helpers.js";
export default class Animal {
    constructor(x, y, settings) {
        this.id = this.getName() + '-' + getStep();
        this.x = x;
        this.y = y;
        this.settings = settings;
        this.history = [];
    }
    getName() {
        return this.constructor.ANIMAL_NAME;
    }
    getSettings() {
        return this.settings;
    }
    getMoveChance() {
        return this.getSettings().moveChance;
    }
    getImage() {
        return this.getSettings().image;
    }
    getColor() {
        return this.getSettings().color;
    }
    getPosition() {
        return [this.x, this.y];
    }
    getHistoryAt(pos) {
        return this.history.length >= pos && pos > 0
            ? this.history[this.history.length - pos]
            : false;
    }
    getPrevPosition() {
        return this.getHistoryAt(1);
    }
    moveTo(x, y) {
        if (x === this.x && y === this.y) {
            throwError('Can not move to itself', 1, true);
            return;
        }
        this.history.push([this.x, this.y]);
        this.x = x;
        this.y = y;
    }
}
Animal.ANIMAL_NAME = 'Animal';
