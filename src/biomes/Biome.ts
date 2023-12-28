import DisplayCell from "../render/DisplayCell.js"
import {RGB, hexToRgb} from "../helpers.js";
import Config from "../../config.js";

export type BiomeArgs = {
    altitude: number;
    temperature: number;
    humidity: number;
    distanceToWater: number;
}

export default class Biome {

    readonly x: number;
    readonly y: number;
    readonly altitude: number;
    readonly temperature: number;
    readonly humidity: number;
    readonly distanceToWater: number;

    constructor(x: number, y: number, args: BiomeArgs) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
    }

    getName(): string {
        return this.constructor.name;
    }

    getColor(): string {
        const color = typeof Config.BIOME_COLORS[this.getName()] === 'undefined'
            ? '#FFFFFF'
            : Config.BIOME_COLORS[this.getName()];

        return Array.isArray(color) ? color[0] : color;
    }

    getHexColor(): RGB {
        return hexToRgb(this.getColor());
    }

    displayCellWithBackground(): boolean {
        return false;
    }

    hasImage(): boolean {
        return typeof Config.BIOME_IMAGES[this.getName()] !== 'undefined';
    }

    getImage(): null | string {
        return typeof Config.BIOME_IMAGES[this.getName()] === 'undefined'
            ? null
            : Config.BIOME_IMAGES[this.getName()];
    }

    getDisplayCell(): DisplayCell {
        return new DisplayCell(
            this.getHexColor(),
            this.getImage(),
            this.displayCellWithBackground()
        );
    }

    getDistanceToWater(): number {
        return this.distanceToWater;
    }
}