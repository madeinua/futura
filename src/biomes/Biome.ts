import DisplayCell from "../render/DisplayCell.js"
import {createImage, RGB, hexToRgb} from "../helpers.js";
import Config from "../../config.js";

type BiomeArgs = {
    altitude: number;
    temperature: number;
    humidity: number;
    distanceToWater: number;
}

export default class Biome {
    static BIOME_NAME = '';

    x: number;
    y: number;
    altitude: number;
    temperature: number;
    humidity: number;
    distanceToWater: number;

    constructor(x: number, y: number, args: BiomeArgs) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
    }

    getName(): string {
        return (this.constructor as typeof Biome).BIOME_NAME;
    }

    getColor(): string {
        return typeof Config.BIOME_COLORS[this.constructor.name] === 'undefined'
            ? '#FFFFFF'
            : Config.BIOME_COLORS[this.constructor.name];
    }

    getHexColor(): RGB {
        return hexToRgb(this.getColor());
    }

    displayCellWithBackground(): boolean {
        return false;
    }

    getImage(): null | HTMLImageElement {
        return typeof Config.BIOME_IMAGES[this.constructor.name] === 'undefined'
            ? null
            : createImage(Config.BIOME_IMAGES[this.constructor.name]);
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