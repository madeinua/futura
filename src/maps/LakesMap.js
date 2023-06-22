import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class LakesMap extends BinaryMatrix {
    constructor(altitudeMap, oceanMap) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.generateMap = function () {
            const _this = this;
            _this.altitudeMap.foreach(function (x, y) {
                if (_this.altitudeMap.isWater(_this.altitudeMap.getCell(x, y))
                    && !_this.oceanMap.filled(x, y)) {
                    _this.fill(x, y);
                }
            });
            return _this;
        };
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
    }
}
