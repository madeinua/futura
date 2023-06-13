import BinaryMatrix from "../structures/BinaryMatrix.js";

export default class LakesMap extends BinaryMatrix {

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {OceanMap} */
    oceanMap;

    /** @var {Object} */
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {Object} config
     * @return {LakesMap}
     */
    constructor(altitudeMap, oceanMap, config) {
        super(0, config.WORLD_SIZE, config.WORLD_SIZE);

        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
    };

    /**
     * @return {LakesMap}
     */
    generateMap = function() {

        let _this = this;

        _this.altitudeMap.foreach(function(x, y) {
            if (
                _this.altitudeMap.isWater(_this.altitudeMap.getCell(x, y))
                && !_this.oceanMap.filled(x, y)
            ) {
                _this.fill(x, y);
            }
        });

        return _this;
    };
}