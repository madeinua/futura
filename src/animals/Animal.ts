import {Cell} from "../structures/Cells.js";
import {getStep, throwError} from "../helpers.js";

export interface AnimalSettings {

    /**
     * @minimum 0
     * @maximum 100
     */
    intensity: number;

    /**
     * @minimum 0
     * @maximum 100
     */
    moveChance: number;

    /**
     * @minimum 0
     * @maximum 1
     */
    rarity: number;

    color: string;

    image: string | null;
}

export default class Animal {
    static ANIMAL_NAME = 'Animal';

    x: number;
    y: number;
    readonly settings: AnimalSettings;
    readonly id: string;
    history: Cell[];

    constructor(x: number, y: number, settings: AnimalSettings) {
        this.id = this.getName() + '-' + getStep();
        this.x = x;
        this.y = y;
        this.settings = settings;
        this.history = [];
    }

    getName(): string {
        return (this.constructor as typeof Animal).ANIMAL_NAME;
    }

    getSettings(): AnimalSettings {
        return this.settings;
    }

    getMoveChance(): number {
        return this.getSettings().moveChance;
    }

    getImage(): string | null {
        return this.getSettings().image;
    }

    getColor(): string {
        return this.getSettings().color;
    }

    getPosition(): Cell {
        return [this.x, this.y];
    }

    getHistoryAt(pos: number): Cell | boolean {
        return this.history.length >= pos && pos > 0
            ? this.history[this.history.length - pos]
            : false;
    }

    getPrevPosition(): Cell | boolean {
        return this.getHistoryAt(1);
    }

    moveTo(x: number, y: number) {

        if (x === this.x && y === this.y) {
            throwError('Can not move to itself', 1, true);
            return;
        }

        this.history.push([this.x, this.y]);
        this.x = x;
        this.y = y;
    }
}