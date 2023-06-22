import PointMatrix from "../structures/PointMatrix.js";
import Config from "../../config.js";
export default class TemperatureMap extends PointMatrix {
    constructor(altitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.generateMap = function () {
            this.addGradient();
            this.considerAltitude();
            this.normalize();
            return this;
        };
        this.addGradient = function () {
            const _this = this, gradient = [];
            for (let i = 0; i < Config.WORLD_SIZE; i++) {
                gradient[i] = i / Config.WORLD_SIZE;
            }
            _this.foreach(function (x, y) {
                _this.addToCell(x, y, gradient[y]);
            });
        };
        this.considerAltitude = function () {
            const _this = this, minLevel = Config.MAX_COAST_LEVEL;
            _this.foreach(function (x, y) {
                let altitude = _this.altitudeMap.getCell(x, y);
                altitude = altitude >= minLevel ? (altitude - minLevel) * (altitude - minLevel) : 0;
                _this.subtractFromCell(x, y, altitude);
            });
        };
        this.altitudeMap = altitudeMap;
    }
}
