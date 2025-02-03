import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Config from "../../config.js";
import { fractionToRGB, hexToRgb, rgbToRgba } from "../helpers.js";
class Faction {
    constructor(startPointX, startPointY, factionSettings) {
        this.id = this.generateId();
        this.factionName = factionSettings.name;
        this.factionColor = hexToRgb(factionSettings.color);
        this.startPosition = [startPointX, startPointY];
        this.territory = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.borders = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.influenceTerritory = new NumericMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
    }
    generateId() {
        return `${this.constructor.name}-${Faction.incrementId()}`;
    }
    static incrementId() {
        return ++this.latestId;
    }
    getFactionColor() {
        return this.factionColor;
    }
    getFactionTerritoryColor() {
        return rgbToRgba(this.getFactionColor(), fractionToRGB(0.5));
    }
    getFactionBorderColor() {
        return rgbToRgba(this.getFactionColor(), fractionToRGB(0.5));
    }
    getName() {
        return this.factionName;
    }
    getSize() {
        return this.territory.getFilledCells().length;
    }
}
Faction.latestId = 0;
export default Faction;
