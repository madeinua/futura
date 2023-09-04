import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class Fraction {
    constructor(startPointX, startPointY, fractionSettings) {
        this.maxHistoryLength = 10;
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
        }
        else {
            this.latestId++;
        }
        return this.latestId;
    }
    getId() {
        return this.id;
    }
    getFractionName() {
        return this.fractionName;
    }
    getFractionColor() {
        return this.fractionColor;
    }
    getStartPosition() {
        return this.startPosition;
    }
    getTerritory() {
        return this.territory;
    }
    getHistoryAt(pos) {
        return this.territoryHistory.length >= pos && pos > 0
            ? this.territoryHistory[this.territoryHistory.length - pos]
            : false;
    }
}
