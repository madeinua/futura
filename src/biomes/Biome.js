import DisplayCell from "../render/DisplayCell.js"
import {createImage, hexToRgb, throwError} from "../helpers.js";

export default class Biome {

    static NAME = '';

    /** @var {number} */
    x;

    /** @var {number} */
    y;

    /** @var {number} */
    altitude;

    /** @var {number} */
    temperature;

    /** @var {number} */
    humidity;

    /** @var {number} */
    distanceToWater;

    /** @var {string} */
    color;

    /** @var {object} */
    config;

    /**
     * @param {number} x
     * @param {number} y
     * @param {object} args
     */
    constructor(x, y, args) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
        this.config = args.config;
        this.color = args.config.BIOME_COLORS[this.constructor.name];
    }

    /**
     * @return {string}
     */
    getName() {
        return this.constructor.NAME;
    }

    /**
     * @return {string}
     */
    getColor() {

        if (typeof this.color === 'undefined') {
            throwError('Color is not defined for ' + this.getName(), 2, true);
            this.color = '#FFFFFF';
        }

        return this.color;
    }

    /**
     * @return {Array}
     */
    getHexColor() {
        return hexToRgb(this.getColor());
    }

    /**
     * @returns {boolean}
     */
    displayCellWithBackground() {
        return false;
    }

    /**
     * @returns {null|HTMLImageElement}
     */
    getImage() {
        return typeof this.config.BIOME_IMAGES[this.constructor.name] === 'undefined'
            ? null
            : createImage(this.config.BIOME_IMAGES[this.constructor.name]);
    }

    /**
     * @returns {DisplayCell}
     */
    getDisplayCell() {
        return new DisplayCell(
            this.getHexColor(),
            this.getImage(),
            this.displayCellWithBackground()
        );
    }

    /**
     * @return {number}
     */
    getHumidity() {
        return this.humidity;
    }

    /**
     * @return {number}
     */
    getTemperature() {
        return this.temperature;
    }

    /**
     * @return {number}
     */
    getAltitude() {
        return this.altitude;
    }

    /**
     * @return {number}
     */
    getDistanceToWater() {
        return this.distanceToWater;
    }
}