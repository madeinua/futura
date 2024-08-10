import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class LakesMap extends BinaryMatrix {
    constructor(altitudeMap, oceanMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
    }
    generateMap() {
        this.altitudeMap.foreachValues((altitude, x, y) => {
            if (this.altitudeMap.isWater(altitude) && !this.oceanMap.filled(x, y)) {
                this.fill(x, y);
            }
        });
        return this;
    }
}
