class SurfaceOperator {

    /**
     * @return {AltitudeMap}
     */
    generateAltitudeMap = function() {

        let altitudeMap = new AltitudeMap(),
            storage = config.STORE_DATA ? localStorage.getItem('altitudeMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            altitudeMap.fromString(storage);
        } else {

            altitudeMap.generateMap();

            if (config.STORE_DATA) {
                localStorage.setItem('altitudeMap', altitudeMap.toString());
            }
        }

        altitudeMap = Filters.apply('altitudeMap', altitudeMap);

        if (config.LOGS) {
            logTimeEvent('Altitude map generated. Min: ' + altitudeMap.getMin() + ' Max: ' + altitudeMap.getMax() + ' Avg: ' + altitudeMap.getAvgValue());
        }

        return altitudeMap;
    };
}