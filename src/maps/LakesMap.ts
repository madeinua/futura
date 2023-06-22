import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";
import OceanMap from "./OceanMap.js";

export default class LakesMap extends BinaryMatrix {

    altitudeMap: AltitudeMap;
    oceanMap: OceanMap;

    constructor(altitudeMap: AltitudeMap, oceanMap: OceanMap) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);

        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
    }

    generateMap = function (): LakesMap {
        const _this: LakesMap = this;

        _this.altitudeMap.foreach(function (x: number, y: number) {
            if (
                _this.altitudeMap.isWater(_this.altitudeMap.getCell(x, y))
                && !_this.oceanMap.filled(x, y)
            ) {
                _this.fill(x, y);
            }
        });

        return _this;
    }
}