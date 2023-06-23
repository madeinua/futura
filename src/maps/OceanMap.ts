import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";

export default class OceanMap extends BinaryMatrix {

    altitudeMap: AltitudeMap;

    constructor(altitudeMap: AltitudeMap) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);

        this.altitudeMap = altitudeMap;
    }

    includeAllWatterCellsAround = function (startX: number, startY: number): void {

        const _this: OceanMap = this,
            activePoints = [];

        _this.fill(startX, startY);

        activePoints.push([startX, startY]);

        while (activePoints.length) {
            let point = activePoints.pop();

            _this.altitudeMap.foreachAroundRadius(point[0], point[1], 1, function (x: number, y: number): void {
                const altitude = _this.altitudeMap.getCell(x, y);

                if (_this.altitudeMap.isWater(altitude)) {
                    if (!_this.filled(x, y)) {
                        _this.fill(x, y);
                        activePoints.push([x, y]);
                    }
                }
            });
        }
    }

    bigLakesToSeas = function (): void {

        const _this: OceanMap = this,
            tempMap = new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE);

        _this.altitudeMap.foreach(function (x: number, y: number): void {
            if (
                _this.altitudeMap.isWater(_this.altitudeMap.getCell(x, y))
                && !_this.filled(x, y)
            ) {
                tempMap.fill(x, y);
            }
        });

        tempMap.foreachFilled(function (x: number, y: number): void {
            if (
                !_this.filled(x, y)
                && tempMap.getSizeFromPoint(x, y) > Config.WORLD_SIZE
            ) {
                _this.includeAllWatterCellsAround(x, y);
            }
        });
    }

    generateMap = function (): OceanMap {

        const _this: OceanMap = this,
            startX = 0,
            startY = 0;

        if (!_this.altitudeMap.isWater(_this.altitudeMap.getCell(startX, startY))) {
            return _this;
        }

        _this.includeAllWatterCellsAround(startX, startY);
        _this.bigLakesToSeas();

        return _this;
    }
}