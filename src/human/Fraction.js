import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Config from "../../config.js";
import { fractionToRGB, hexToRgb, rgbToRgba } from "../helpers.js";
class Fraction {
    constructor(startPointX, startPointY, fractionSettings) {
        this.id = this.generateId();
        this.fractionName = fractionSettings.name;
        this.fractionColor = hexToRgb(fractionSettings.color);
        this.startPosition = [startPointX, startPointY];
        this.territory = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.borders = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.influenceTerritory = new NumericMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
    }
    generateId() {
        return `${this.constructor.name}-${Fraction.incrementId()}`;
    }
    static incrementId() {
        return ++this.latestId;
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
    getName() {
        return this.fractionName;
    }
    getSize() {
        return this.territory.getFilledCells().length;
    }
}
Fraction.latestId = 0;
export default Fraction;
