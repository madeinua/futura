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
        return -30;
    }
    getMountainsBoostColor() {
        return -60;
    }
    getColor() {
        const { min, max } = this.getColorsMinMax();
        const colors = Config.BIOME_COLORS[this.getName()];
        let sliceIndex = 0;
        if (this.altitude >= max) {
            sliceIndex = colors.length - 1;
        }
        else if (this.altitude > min) {
            sliceIndex = Math.floor(((this.altitude - min) / (max - min)) * colors.length);
        }
        let color = colors[sliceIndex];
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
    getImage() {
        if (this.isMountains) {
            return Config.BIOME_IMAGES.Rocks[0];
        }
        return null;
    }
    getBackground() {
        return null;
    }
    getDisplayCell() {
        return new DisplayCell(this.getHexColor(), [this.getBackground(), this.getImage()]);
    }
    getDistanceToWater() {
        return this.distanceToWater;
    }
}
