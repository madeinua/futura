class HumidityMap extends PointMatrix {

    altitudeMap;
    beachesMap;
    riversMap;
    lakesMap;
    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {BeachesMap} beachesMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @param {Object} config
     * @return {HumidityMap}
     */
    constructor(altitudeMap, beachesMap, riversMap, lakesMap, config) {

        super(config.worldSize, config.worldSize);

        this.altitudeMap = altitudeMap;
        this.beachesMap = beachesMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
        this.config = config;

        return this;
    };

    /**
     * @return {HumidityMap}
     */
    generateMap = function() {

        let _this = this;

        _this.setAll(
            createNoiseMap(_this.config.worldSize, 90).getAll()
        );

        // @TODO

        /*
                // higher altitude = lower humidity
                humidityMap.map(function(x, y) {
                    return humidityMap.getTile(x, y) - 0.5 + altitudeMap.getTile(x, y) * 0.5;
                });
        */
        // rivers/lakes increase humidity
        /*      riversMap.foreach(function(x ,y) {
                  humidityMap.addToTile(x, y, 0.25);
                  humidityMap.addToNeighborTiles(x, y, 2, 0.1);
              });
      */
        /*

        let lakes = lakesMap.getFilledTiles().makeStep(5), // divider by 5 to increase performance
            rivers = riversMap.getFilledTiles(),
            water = rivers.concat(lakes),
            beaches = beachesMap.getFilledTiles(),
            maxDistance = worldSize / 10;

        // rivers/lakes increase humidity
        humidityMap.map(function(x, y) {

            let distance = water.getClosestDistanceTo(x, y),
                md = Math.sqrt(maxDistance);

            return humidityMap.getTile(x, y) + 0.1 + tval(distance / Math.max(distance, md), -0.2, 0.1);
        });

        // ocean decrease humidity
        humidityMap.map(function(x, y) {

            let distance = beaches.getClosestDistanceTo(x, y);

            return humidityMap.getTile(x, y) - 0.2 + tval(distance / Math.max(distance, maxDistance), 0, 0.4);
        });

         */

        return _this;
    };
}