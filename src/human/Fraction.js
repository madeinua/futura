import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import { fractionToRGB, hexToRgb, rgbToRgba } from "../helpers.js";
export default class Fraction {
    constructor(startPointX, startPointY, fractionSettings) {
        this.id = this.constructor.name + '-' + Fraction.incrementId();
        this.fractionName = fractionSettings.name;
        this.fractionColor = hexToRgb(fractionSettings.color);
        this.startPosition = [startPointX, startPointY];
        this.territory = (new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE)).fill(startPointX, startPointY);
        this.borders = (new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE)).fill(startPointX, startPointY);
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
    getFractionColor() {
        return this.fractionColor;
    }
    getFractionTerritoryColor() {
        return rgbToRgba(this.getFractionColor(), fractionToRGB(0.5));
    }
    getFractionBorderColor() {
        return rgbToRgba(this.getFractionColor(), fractionToRGB(0.5));
    }
}
