import DisplayCell from "../render/DisplayCell.js";
import { hexToRgb } from "../helpers.js";
import Config from "../../config.js";
export default class Biome {
    constructor(x, y, args) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
    }
    getName() {
        return this.constructor.name;
    }
    getColor() {
        return typeof Config.BIOME_COLORS[this.getName()] === 'undefined'
            ? '#FFFFFF'
            : Config.BIOME_COLORS[this.getName()];
    }
    getHexColor() {
        return hexToRgb(this.getColor());
    }
    displayCellWithBackground() {
        return false;
    }
    getImage() {
        return typeof Config.BIOME_IMAGES[this.getName()] === 'undefined'
            ? null
            : Config.BIOME_IMAGES[this.getName()];
    }
    getDisplayCell() {
        return new DisplayCell(this.getHexColor(), this.getImage(), this.displayCellWithBackground());
    }
    getDistanceToWater() {
        return this.distanceToWater;
    }
}
