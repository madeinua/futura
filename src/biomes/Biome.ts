import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js"
import {RGB, hexToRgb, LightenDarkenColor} from "../helpers.js";

export type BiomeArgs = {
    altitude: number;
    temperature: number;
    humidity: number;
    distanceToWater: number;
    isHills: boolean,
    isMountains: boolean,
}

export type ColorsMinMax = {
    min: number;
    max: number;
}

export default class Biome {

    readonly x: number;
    readonly y: number;
    readonly altitude: number;
    readonly temperature: number;
    readonly humidity: number;
    readonly distanceToWater: number;
    readonly isHills: boolean;
    readonly isMountains: boolean;

    constructor(x: number, y: number, args: BiomeArgs) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
        this.isHills = args.isHills;
        this.isMountains = args.isMountains;
    }

    getName(): string {
        return this.constructor.name;
    }

    protected getColorsMinMax(): ColorsMinMax {
        return {
            min: Config.MIN_LEVEL,
            max: Config.MAX_LEVEL,
        }
    }

    protected getHillsBoostColor(): number {
        return -30;
    }

    protected getMountainsBoostColor(): number {
        return -60;
    }

    getColor(): string {
        const minmax = this.getColorsMinMax(),
            colors = Config.BIOME_COLORS[this.getName()];
        let slice = 0;

        if (this.altitude >= minmax.max) {
            slice = colors.length - 1;
        } else if (this.altitude > minmax.min) {
            slice = Math.floor((this.altitude - minmax.min) / (minmax.max - minmax.min) * colors.length);
        }

        let color = colors[slice];

        if (this.isHills) {
            color = LightenDarkenColor(color, this.getHillsBoostColor());
        } else if (this.isMountains) {
            color = LightenDarkenColor(color, this.getMountainsBoostColor());
        }

        return color;
    }

    getHexColor(): RGB {
        return hexToRgb(this.getColor());
    }

    getImage(): null | string {

        if (this.isMountains) {
            return Config.BIOME_IMAGES.Rocks[0];
        }

        return null;
    }

    getBackground(): string | null {
        return null;
    }

    getDisplayCell(): DisplayCell {
        return new DisplayCell(
            this.getHexColor(),
            [this.getBackground(), this.getImage()],
        );
    }

    getDistanceToWater(): number {
        return this.distanceToWater;
    }
}