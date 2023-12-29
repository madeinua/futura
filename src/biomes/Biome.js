import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js";
import { hexToRgb, LightenDarkenColor } from "../helpers.js";
export default class Biome {
    constructor(x, y, args) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
        this.isHills = args.isHills;
        this.isMountains = args.isMountains;
    }
    getName() {
        return this.constructor.name;
    }
    getColorsMinMax() {
        return {
            min: Config.MIN_LEVEL,
            max: Config.MAX_LEVEL,
        };
    }
    getHillsBoostColor() {
        return -25;
    }
    getMountainsBoostColor() {
        return -50;
    }
    getColor() {
        const minmax = this.getColorsMinMax(), colors = Config.BIOME_COLORS[this.getName()];
        let slice = 0;
        if (this.altitude >= minmax.max) {
            slice = colors.length - 1;
        }
        else if (this.altitude > minmax.min) {
            slice = Math.floor((this.altitude - minmax.min) / (minmax.max - minmax.min) * colors.length);
        }
        let color = colors[slice];
        if (this.isHills) {
            color = LightenDarkenColor(color, this.getHillsBoostColor());
        }
        else if (this.isMountains) {
            color = LightenDarkenColor(color, this.getMountainsBoostColor());
        }
        return color;
    }
    getHexColor() {
        return hexToRgb(this.getColor());
    }
    hasImage() {
        return this.isMountains;
    }
    getImage() {
        if (this.isMountains) {
            return Config.BIOME_IMAGES.Rocks[0];
        }
        return null;
    }
    getDisplayCell() {
        return new DisplayCell(this.getHexColor(), this.getImage());
    }
    getDistanceToWater() {
        return this.distanceToWater;
    }
}
