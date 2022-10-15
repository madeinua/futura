class Biome {

    static NAME = '';

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
        throwError('Unknown biome color', 1, true);
        return '#ffffff';
    }

    /**
     * @return {Array}
     */
    getHexColor() {
        return hexToRgb(this.getColor());
    }

    /**
     * @returns {DisplayCell}
     */
    getImage() {
        return new DisplayCell(
            this.getHexColor(),
            null
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