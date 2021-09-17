class WeatherOperator {

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {TemperatureMap}
     */
    generateTemperatureMap = function(altitudeMap) {

        let temperatureMap = new TemperatureMap(altitudeMap),
            storage = config.STORE_DATA ? localStorage.getItem('temperatureMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            temperatureMap.fromString(storage);
        } else {

            temperatureMap.generateMap();

            if (config.STORE_DATA) {
                localStorage.setItem('temperatureMap', temperatureMap.toString());
            }
        }

        temperatureMap = Filters.apply('temperatureMap', temperatureMap);

        if (config.LOGS) {
            logTimeEvent('Temperature map created. Min: ' + temperatureMap.getMin() + ' Max: ' + temperatureMap.getMax() + ' Avg.: ' + temperatureMap.getAvgValue());
        }

        return temperatureMap;
    }
}