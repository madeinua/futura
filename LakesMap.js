class LakesMap extends BinaryMatrix {

    altitudeMap;
    oceanMap;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {Object} config
     * @return {LakesMap}
     */
    constructor(altitudeMap, oceanMap, config) {

        super(config.worldSize, config.worldSize);

        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;

        return this;
    };

    /**
     * @return {LakesMap}
     */
    generateMap = function() {

        let _this = this;

        // @TODO Lake size should not be larger than X. otherwise make it smaller

        _this.altitudeMap.foreach(function(x, y) {
            if (_this.altitudeMap.isWater(
                _this.altitudeMap.getTile(x, y))
                && !_this.oceanMap.filled(x, y)
            ) {
                _this.fill(x, y);
            }
        });

        return _this;
    };

    polygonArea(coords) {

        let area = 0;

        for (let i = 0; i < coords.length; i++) {
            let j = (i + 1) % coords.length;
            area += coords[i][0] * coords[j][1];
            area -= coords[j][0] * coords[i][1];
        }

        return area / 2;
    };

    /**
     * @param {number} startX
     * @param {number} startY
     * @return {number}
     */
    getLakeSizeFromPoint = function(startX, startY) {

        if (!this.filled(startX, startY)) {
            return 0;
        }

        let sx,
            sy,
            coords = [];

        for (let d = 0; d < 4; d++) {

            sx = startX;
            sy = startY;

            while(true) {

                if (d === 0) {
                    sx++;
                } else if (d === 1) {
                    sy++;
                } else if (d === 2) {
                    sx--;
                } else if (d === 3) {
                    sy--;
                }

                if (!this.filled(sx, sy)) {
                    coords.push([sx, sy]);
                    break;
                }
            }
        }

        return Math.abs(
            this.polygonArea(coords)
        );
    };
}