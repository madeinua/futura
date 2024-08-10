import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class CoastMap extends BinaryMatrix {
    constructor(oceanMap, altitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.oceanMap = oceanMap;
        this.altitudeMap = altitudeMap;
    }
    isCoast(altitude) {
        return altitude >= Config.MIN_COAST_LEVEL && altitude <= Config.MIN_GROUND_LEVEL;
    }
    generateMap() {
        this.oceanMap.foreachFilled((x, y) => {
            if (this.isCoast(this.altitudeMap.getCell(x, y))) {
                this.fill(x, y);
            }
        });
        return this;
    }
}
