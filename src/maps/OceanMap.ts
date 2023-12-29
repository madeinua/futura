import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";

export default class OceanMap extends BinaryMatrix {

    readonly altitudeMap: AltitudeMap;

    constructor(altitudeMap: AltitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.altitudeMap = altitudeMap;
    }

    private includeAllWaterCellsAround = function (startX: number, startY: number): void {

        const _this: OceanMap = this,
            activeCells = [];

        _this.fill(startX, startY);

        activeCells.push([startX, startY]);

        while (activeCells.length) {
            let cell = activeCells.pop();

            _this.altitudeMap.foreachAroundRadius(cell[0], cell[1], 1, function (x: number, y: number): void {
                const altitude = _this.altitudeMap.getCell(x, y);

                if (_this.altitudeMap.isWater(altitude) && !_this.filled(x, y)) {
                    _this.fill(x, y);
                    activeCells.push([x, y]);
                }
            });
        }
    }

    private bigLakesToSeas = function (): void {

        const _this: OceanMap = this,
            tempMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        _this.altitudeMap.foreachValues(function (altitude: number, x: number, y: number): void {
            if (
                _this.altitudeMap.isWater(altitude)
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
                _this.includeAllWaterCellsAround(x, y);
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

        _this.includeAllWaterCellsAround(startX, startY);
        _this.bigLakesToSeas();

        return _this;
    }

    getNotOceanMap = function (): BinaryMatrix {
        const _this: OceanMap = this,
            notOceanMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        _this.foreachUnfilled(function (x: number, y: number): void {
            notOceanMap.fill(x, y);
        });

        return notOceanMap;
    }
}