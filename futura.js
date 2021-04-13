let coordinatesField = document.getElementById('coordinates'),
    worldWrapper = document.getElementById('worldWrapper'),
    worldCanvas = document.getElementById('world'),
    miniMapCanvas = document.getElementById('miniMap'),
    config = getConfig(),
    cameraPos = getCenteredCameraPosition(config.visibleCols);

config.cameraPosX = cameraPos[0];
config.cameraPosY = cameraPos[1];

let world = new World(config);

/**
 * @param {string} id
 * @param {Matrix} map
 */
function drawColorMap(id, map) {

    let canvas = document.getElementById(id);

    canvas.width = map.getWidth();
    canvas.height = map.getHeight();

    let ctx = canvas.getContext('2d'),
        image = ctx.createImageData(canvas.width, canvas.height),
        x, y;

    for (x = 0; x < map.getWidth(); x++) {
        for (y = 0; y < map.getHeight(); y++) {

            let point = (x + y * canvas.width) * 4,
                color = map.getTile(x, y).getHexColor();

            fillCanvasPixel(image, point, color);
        }
    }

    ctx.putImageData(image, 0, 0);
}

/**
 * @param {string} id
 * @param {NumericMatrix} map
 * @param {boolean} reverse
 */
function drawMap(id, map, reverse) {

    let canvas = document.getElementById(id);

    canvas.width = map.getWidth();
    canvas.height = map.getHeight();

    let ctx = canvas.getContext('2d'),
        image = ctx.createImageData(canvas.width, canvas.height);

    map.foreach(function(x, y) {

        let point = (x + y * canvas.width) * 4,
            gray = reverse ? 255 - map.getGrayscale(x, y) : map.getGrayscale(x, y);

        fillCanvasPixel(image, point, [gray, gray, gray]);
    });

    ctx.putImageData(image, 0, 0);
}

Filters.add('mapMoved', function(point) {
    point = centeredCameraPointToXY(point, config.visibleCols);
    coordinatesField.value = point[0] + ',' + point[1];
});

Filters.add('altitudeMap', function(map) {
    drawMap('altitudeMapCanvas', map, false);
    return map;
});

Filters.add('temperatureMap', function(map) {
    drawMap('temperatureMapCanvas', map, false);
    return map;
});

Filters.add('humidityMap', function(map) {
    drawMap('humidityMapCanvas', map, true);
    return map;
});

Filters.add('oceanMap', function(map) {
    drawMap('oceanMapCanvas', map, true);
    return map;
});

Filters.add('lakesMap', function(map) {
    drawMap('lakesMapCanvas', map, true);
    return map;
});

Filters.add('riversMap', function(map) {
    drawMap('riversMapCanvas', map, false);
    return map;
});

Filters.add('biomes', function(map) {
    drawColorMap('biomesCanvas', map);
    return map;
});

Filters.add('forestMap', function(map) {
    drawMap('forestMapCanvas', map, true);
    return map;
});

world.create();

/**
 * @return {number[]}
 */
function getCameraPosition() {

    let point = coordinatesField.value.split(','),
        x = 0,
        y = 0;

    if (point.length === 2) {
        x = parseInt(point[0], 10);
        y = parseInt(point[1], 10);
    }

    return [x, y];
}

/**
 * @param {[number, number]} point
 * @param {number} size
 * @return {[number, number]}
 */
function centerCameraPoint(point, size) {

    let c = Math.floor(size / 2);

    return [
        Math.max(0, point[0] - c),
        Math.max(0, point[1] - c)
    ];
}

/**
 * @param {number} size
 * @return {number[]}
 */
function getCenteredCameraPosition(size) {
    return centerCameraPoint(
        getCameraPosition(),
        size
    );
}

/**
 * @param {[number, number]} point
 * @param {number} size
 * @return {[number, number]}
 */
function centeredCameraPointToXY(point, size) {

    let c = Math.floor(size / 2);

    return [
        Math.max(0, point[0] + c),
        Math.max(0, point[1] + c)
    ];
}

coordinatesField.addEventListener("change", function() {
    world.moveMapTo(
        getCenteredCameraPosition(config.visibleCols)
    );
});

miniMapCanvas.addEventListener("click", function(e) {

    let rect = this.getBoundingClientRect(),
        scale = config.worldSize / miniMapCanvas.offsetWidth,
        point = [
            Math.floor((e.clientX - rect.left) * scale),
            Math.floor((e.clientY - rect.top) * scale)
        ];

    world.moveMapTo(
        centerCameraPoint(point, config.visibleCols)
    );
});

/**
 * @return {boolean}
 */
function pauseTimer() {
    return world.isTimerPaused()
        ? world.unpauseTimer()
        : world.pauseTimer();
}

document.getElementById('pauseTick').addEventListener("click", function() {
    pauseTimer();
});