import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";
import RiversMap from "./RiversMap.js";
import LakesMap from "./LakesMap.js";

export default class HumidityMap extends PointMatrix {

    readonly altitudeMap: AltitudeMap;
    readonly riversMap: RiversMap;
    readonly lakesMap: LakesMap;

    constructor(altitudeMap: AltitudeMap, riversMap: RiversMap, lakesMap: LakesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);

        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
    }

    /**
     * 0 = wet
     * 1 = dry
     */
    generateMap = function (): HumidityMap {
        let _this: HumidityMap = this;

        _this.generateNoiseMap();
        _this.considerAltitude();
        _this.considerRivers();
        _this.considerLakes();
        _this.normalize();

        return _this;
    }

    private generateNoiseMap() {
        this.setAll(
            new NoiseMapGenerator(Config.WORLD_SIZE, 150).generate().getValues()
        );
    }

    private considerAltitude() {
        const _this: HumidityMap = this;

        // higher altitude = lower humidity
        _this.foreachValues(function (altitude: number, x: number, y: number): void {
            _this.addToCell(x, y, -altitude * 0.5);
        });
    }

    private considerRivers() {
        const _this: HumidityMap = this;

        // rivers increase humidity
        _this.riversMap.foreachFilled(function (x: number, y: number): void {

            _this.addToCell(x, y, 0.2);

            _this.foreachAroundRadius(x, y, 5, function (nx: number, ny: number): void {
                if (!_this.riversMap.filled(nx, ny)) {
                    _this.addToCell(nx, ny, 0.02);
                }
            });
        });
    }

    private considerLakes() {
        const _this: HumidityMap = this;

        // lakes increase humidity
        _this.lakesMap.foreachFilled(function (x: number, y: number): void {
            _this.foreachAroundRadius(x, y, 5, function (nx: number, ny: number): void {
                _this.addToCell(nx, ny, 0.015);
            });
        });
    }
}