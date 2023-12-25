import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Config from "../../config.js";
import {Cell} from "../structures/Cells.js";
import {fractionToRGB, hexToRgb, RGB, RGBa, rgbToRgba} from "../helpers.js";

export interface FractionSettings {
    name: string;
    color: string;
}

export default class Fraction {

    id: string;
    fractionName: string;
    fractionColor: RGB;
    startPosition: Cell;
    territory: BinaryMatrix;
    borders: BinaryMatrix;
    influenceTerritory: NumericMatrix;

    static latestId: number;

    constructor(startPointX: number, startPointY: number, fractionSettings: FractionSettings) {
        this.id = this.constructor.name + '-' + Fraction.incrementId();
        this.fractionName = fractionSettings.name;
        this.fractionColor = hexToRgb(fractionSettings.color);
        this.startPosition = [startPointX, startPointY];
        this.territory = (new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0)).fill(startPointX, startPointY);
        this.borders = (new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0)).fill(startPointX, startPointY);
        this.influenceTerritory = new NumericMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        } else {
            this.latestId++;
        }

        return this.latestId;
    }

    getFractionColor(): RGB {
        return this.fractionColor;
    }

    getFractionTerritoryColor(): RGBa {
        return rgbToRgba(
            this.getFractionColor(),
            fractionToRGB(0.5)
        );
    }

    getFractionBorderColor(): RGBa {
        return rgbToRgba(
            this.getFractionColor(),
            fractionToRGB(0.5)
        );
    }

    getName(): string {
        return this.fractionName;
    }

    getSize(): number {
        return this.territory.getFilledCells().length;
    }
}