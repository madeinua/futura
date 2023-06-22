import PointMatrix from "../structures/PointMatrix.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap";

export default class TemperatureMap extends PointMatrix {

    altitudeMap: AltitudeMap;

    constructor(altitudeMap: AltitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);

        this.altitudeMap = altitudeMap;
    }

    generateMap = function (): TemperatureMap {

        this.addGradient();
        this.considerAltitude();
        this.normalize();

        return this;
    }

    addGradient = function () {

        const _this = this,
            gradient = [];

        for (let i = 0; i < Config.WORLD_SIZE; i++) {
            gradient[i] = i / Config.WORLD_SIZE;
        }

        _this.foreach(function (x: number, y: number) {
            _this.addToCell(x, y, gradient[y]);
        });
    }

    considerAltitude = function () {
        const _this = this,
            minLevel = Config.MAX_COAST_LEVEL;

        _this.foreach(function (x: number, y: number) {
            let altitude = _this.altitudeMap.getCell(x, y);
            altitude = altitude >= minLevel ? (altitude - minLevel) * (altitude - minLevel) : 0;
            _this.subtractFromCell(x, y, altitude);
        });
    }
}