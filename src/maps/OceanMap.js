import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class OceanMap extends BinaryMatrix {
    constructor(altitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.includeAllWaterCellsAround = function (startX, startY) {
            const _this = this, activeCells = [];
            _this.fill(startX, startY);
            activeCells.push([startX, startY]);
            while (activeCells.length) {
                let cell = activeCells.pop();
                _this.altitudeMap.foreachAroundRadius(cell[0], cell[1], 1, function (x, y) {
                    const altitude = _this.altitudeMap.getCell(x, y);
                    if (_this.altitudeMap.isWater(altitude) && !_this.filled(x, y)) {
                        _this.fill(x, y);
                        activeCells.push([x, y]);
                    }
                });
            }
        };
        this.bigLakesToSeas = function () {
            const _this = this, tempMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
            _this.altitudeMap.foreachValues(function (altitude, x, y) {
                if (_this.altitudeMap.isWater(altitude)
                    && !_this.filled(x, y)) {
                    tempMap.fill(x, y);
                }
            });
            tempMap.foreachFilled(function (x, y) {
                if (!_this.filled(x, y)
                    && tempMap.getSizeFromPoint(x, y) > Config.WORLD_SIZE) {
                    _this.includeAllWaterCellsAround(x, y);
                }
            });
        };
        this.generateMap = function () {
            const _this = this, startX = 0, startY = 0;
            if (!_this.altitudeMap.isWater(_this.altitudeMap.getCell(startX, startY))) {
                return _this;
            }
            _this.includeAllWaterCellsAround(startX, startY);
            _this.bigLakesToSeas();
            return _this;
        };
        this.getNotOceanMap = function () {
            const _this = this, notOceanMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
            _this.foreachUnfilled(function (x, y) {
                notOceanMap.fill(x, y);
            });
            return notOceanMap;
        };
        this.altitudeMap = altitudeMap;
    }
}
