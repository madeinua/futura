import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import {Cell} from "../structures/Cells.js";

export interface FractionSettings {
    name: string;
    color: string;
}

export default class Fraction {

    id: string;
    fractionName: string;
    fractionColor: string;
    startPosition: Cell;
    territory: BinaryMatrix;
    territoryHistory: BinaryMatrix[];
    maxHistoryLength: number = 10;

    static latestId: number;

    constructor(startPointX: number, startPointY: number, fractionSettings: FractionSettings) {
        this.id = this.constructor.name + '-' + Fraction.incrementId();
        this.fractionName = fractionSettings.name;
        this.fractionColor = fractionSettings.color;
        this.startPosition = [startPointX, startPointY];
        this.territory = (new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE)).fill(startPointX, startPointY);
        this.territoryHistory = [];
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        } else {
            this.latestId++;
        }

        return this.latestId;
    }

    getId(): string {
        return this.id;
    }

    getFractionName(): string {
        return this.fractionName;
    }

    getFractionColor(): string {
        return this.fractionColor;
    }

    getStartPosition(): Cell {
        return this.startPosition;
    }

    getTerritory(): BinaryMatrix {
        return this.territory;
    }

    getHistoryAt(pos: number): BinaryMatrix | boolean {
        return this.territoryHistory.length >= pos && pos > 0
            ? this.territoryHistory[this.territoryHistory.length - pos]
            : false;
    }
}