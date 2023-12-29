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
        const _this = this;
        _this.oceanMap.foreachFilled(function (x, y) {
            if (_this.isCoast(_this.altitudeMap.getCell(x, y))) {
                _this.fill(x, y);
            }
        });
        return _this;
    }
}
