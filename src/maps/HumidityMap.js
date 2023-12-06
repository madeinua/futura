import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";
import { distance } from "../helpers.js";
export default class HumidityMap extends PointMatrix {
    constructor(altitudeMap, riversMap, lakesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
        /**
         * 0 = wet
         * 1 = dry
         */
        this.generateMap = function () {
            let _this = this;
            _this.generateNoiseMap();
            _this.considerAltitude();
            _this.considerRivers();
            _this.considerLakes();
            _this.normalize();
            return _this;
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
        _this.foreachValues(function (altitude, x, y) {
            _this.addToCell(x, y, -altitude * 0.5);
        });
    }
    considerRivers() {
        const _this = this;
        // rivers increase humidity
        _this.riversMap.foreachFilled(function (x, y) {
            _this.foreachAroundRadius(x, y, 4, function (nx, ny) {
                _this.addToCell(nx, ny, 0.015 / distance(x, y, nx, ny));
            });
        });
    }
    considerLakes() {
        const _this = this;
        // lakes increase humidity
        _this.lakesMap.foreachFilled(function (x, y) {
            _this.foreachAroundRadius(x, y, 5, function (nx, ny) {
                _this.addToCell(nx, ny, 0.01 / distance(x, y, nx, ny));
            });
        });
    }
}
