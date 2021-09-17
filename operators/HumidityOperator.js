class HumidityOperator {

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @return {HumidityMap}
     */
    generateHumidityMap = function(altitudeMap, riversMap, lakesMap) {

        let humidityMap = new HumidityMap(altitudeMap, riversMap, lakesMap),
            storage = config.STORE_DATA ? localStorage.getItem('humidityMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            humidityMap.fromString(storage);
        } else {

            humidityMap.generateMap();

            if (config.STORE_DATA) {
                localStorage.setItem('humidityMap', humidityMap.toString());
            }
        }

        humidityMap = Filters.apply('humidityMap', humidityMap);

        if (config.LOGS) {
            logTimeEvent('Humidity map created. Min: ' + humidityMap.getMin() + ' Max: ' + humidityMap.getMax() + ' Avg: ' + humidityMap.getAvgValue());
        }

        return humidityMap;
    };
}