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

    private static latestId: number = 0;

    public readonly id: string;
    public readonly fractionName: string;
    public readonly fractionColor: RGB;
    public readonly startPosition: Cell;
    public readonly territory: BinaryMatrix;
    public readonly borders: BinaryMatrix;
    public readonly influenceTerritory: NumericMatrix<number>;

    constructor(startPointX: number, startPointY: number, fractionSettings: FractionSettings) {
        this.id = this.generateId();
        this.fractionName = fractionSettings.name;
        this.fractionColor = hexToRgb(fractionSettings.color);
        this.startPosition = [startPointX, startPointY];
        this.territory = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.borders = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.influenceTerritory = new NumericMatrix<number>(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
    }

    private generateId(): string {
        return `${this.constructor.name}-${Fraction.incrementId()}`;
    }

    private static incrementId(): number {
        return ++this.latestId;
    }

    public getFractionColor(): RGB {
        return this.fractionColor;
    }

    public getFractionTerritoryColor(): RGBa {
        return rgbToRgba(this.getFractionColor(), fractionToRGB(0.5));
    }

    public getFractionBorderColor(): RGBa {
        return rgbToRgba(this.getFractionColor(), fractionToRGB(0.5));
    }

    public getName(): string {
        return this.fractionName;
    }

    public getSize(): number {
        return this.territory.getFilledCells().length;
    }
}