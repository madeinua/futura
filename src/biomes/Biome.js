import DisplayCell from "../render/DisplayCell.js";
import { createImage, hexToRgb } from "../helpers.js";
import Config from "../../config.js";
class Biome {
    constructor(x, y, args) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
    }
    getName() {
        return this.constructor.BIOME_NAME;
    }
    getColor() {
        return typeof Config.BIOME_COLORS[this.constructor.name] === 'undefined'
            ? '#FFFFFF'
            : Config.BIOME_COLORS[this.constructor.name];
    }
    getHexColor() {
        return hexToRgb(this.getColor());
    }
    displayCellWithBackground() {
        return false;
    }
    getImage() {
        return typeof Config.BIOME_IMAGES[this.constructor.name] === 'undefined'
            ? null
            : createImage(Config.BIOME_IMAGES[this.constructor.name]);
    }
    getDisplayCell() {
        return new DisplayCell(this.getHexColor(), this.getImage(), this.displayCellWithBackground());
    }
    getDistanceToWater() {
        return this.distanceToWater;
    }
}
Biome.BIOME_NAME = '';
export default Biome;
