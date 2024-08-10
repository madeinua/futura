import { getStep, throwError } from "../helpers.js";
class Animal {
    constructor(x, y, settings) {
        this.id = `${this.getName()}-${getStep()}`;
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
        return this.settings.moveChance;
    }
    getImage() {
        return this.settings.image;
    }
    getColor() {
        return this.settings.color;
    }
    getPosition() {
        return [this.x, this.y];
    }
    getHistoryAt(pos) {
        return pos > 0 && pos <= this.history.length
            ? this.history[this.history.length - pos]
            : false;
    }
    getPrevPosition() {
        return this.getHistoryAt(1);
    }
    moveTo(x, y) {
        if (x === this.x && y === this.y) {
            throwError('Cannot move to the same position', 1, true);
            return;
        }
        this.history.push([this.x, this.y]);
        this.x = x;
        this.y = y;
    }
}
Animal.ANIMAL_NAME = 'Animal';
export default Animal;
