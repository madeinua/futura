import BinaryMatrix from "../structures/BinaryMatrix.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import Config from "../../config.js";
import {Cell} from "../structures/Cells.js";
import {fractionToRGB, hexToRgb, RGB, RGBa, rgbToRgba} from "../helpers.js";

export interface FactionSettings {
    name: string;
    color: string;
}

export default class Faction {

    private static latestId: number = 0;

    public readonly id: string;
    public readonly factionName: string;
    public readonly factionColor: RGB;
    public readonly startPosition: Cell;
    public readonly territory: BinaryMatrix;
    public readonly borders: BinaryMatrix;
    public readonly influenceTerritory: NumericMatrix<number>;

    constructor(startPointX: number, startPointY: number, factionSettings: FactionSettings) {
        this.id = this.generateId();
        this.factionName = factionSettings.name;
        this.factionColor = hexToRgb(factionSettings.color);
        this.startPosition = [startPointX, startPointY];
        this.territory = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.borders = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.influenceTerritory = new NumericMatrix<number>(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
    }

    private generateId(): string {
        return `${this.constructor.name}-${Faction.incrementId()}`;
    }

    private static incrementId(): number {
        return ++this.latestId;
    }

    public getFactionColor(): RGB {
        return this.factionColor;
    }

    public getFactionTerritoryColor(): RGBa {
        return rgbToRgba(this.getFactionColor(), fractionToRGB(0.5));
    }

    public getFactionBorderColor(): RGBa {
        return rgbToRgba(this.getFactionColor(), fractionToRGB(0.5));
    }

    public getName(): string {
        return this.factionName;
    }

    public getSize(): number {
        return this.territory.getFilledCells().length;
    }
}