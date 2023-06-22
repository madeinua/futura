import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";
export default class HumidityMap extends PointMatrix {
    constructor(altitudeMap, riversMap, lakesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
        /**
         * 0 = wet
         * 1 = dry
         */
        this.generateMap = function () {
            this.generateNoiseMap();
            this.considerAltitude();
            this.considerRivers();
            this.considerLakes();
            this.normalize();
            return this;
        };
        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
    }
    generateNoiseMap() {
        this.setAll(new NoiseMapGenerator(Config.WORLD_SIZE, 150).generate().getValues());
    }
    considerAltitude() {
        const _this = this;
        // higher altitude = lower humidity
        _this.foreach(function (x, y) {
            _this.addToCell(x, y, -_this.altitudeMap.getCell(x, y));
        });
    }
    considerRivers() {
        const _this = this;
        // rivers increase humidity
        _this.riversMap.foreachFilled(function (x, y) {
            _this.addToCell(x, y, 0.2);
            _this.foreachAroundRadius(x, y, 5, function (nx, ny) {
                if (!_this.riversMap.filled(nx, ny)) {
                    _this.addToCell(nx, ny, 0.02);
                }
            });
        });
    }
    considerLakes() {
        const _this = this;
        // lakes increase humidity
        _this.lakesMap.foreachFilled(function (x, y) {
            _this.foreachAroundRadius(x, y, 5, function (nx, ny) {
                _this.addToCell(nx, ny, 0.015);
            });
        });
    }
}
