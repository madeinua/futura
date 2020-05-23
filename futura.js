let coordinatesField = document.getElementById('coordinates'),
    worldCanvas = document.getElementById('world'),
    miniMapCanvas = document.getElementById('miniMap');

let config = {
    //storeData: false,
    worldSize: 300,
    visibleCols: 30,
    worldCanvas: worldCanvas,
    miniMapCanvas: miniMapCanvas,
    showCoordinates: true
};

let cameraPos = getCenteredCameraPosition(config.visibleCols);

config.cameraPosX = cameraPos[0];
config.cameraPosY = cameraPos[1];

let world = new World(config);

/**
 * @param {string} id
 * @param {Matrix} map
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

        image.data[point] = gray;
        image.data[point + 1] = gray;
        image.data[point + 2] = gray;
        image.data[point + 3] = 255; // Alpha
    });

    ctx.putImageData(image, 0, 0);
}

Filters
    .add('mapMoved', function(point) {
        point = centeredCameraPointToXY(point, config.visibleCols);
        coordinatesField.value = point[0] + ',' + point[1];
    })
    .add('altitudeMap', function(map) {
        drawMap('altitudeMapCanvas', map, false);
        return map;
    })
    .add('temperatureMap', function(map) {
        drawMap('temperatureMapCanvas', map, false);
        return map;
    })
    .add('humidityMap', function(map) {
        drawMap('humidityMapCanvas', map, false);
        return map;
    })
    .add('oceanMap', function(map) {
        drawMap('oceanMapCanvas', map, true);
        return map;
    })
    .add('lakesMap', function(map) {
        drawMap('lakesMapCanvas', map, true);
        return map;
    })
    .add('riversMap', function(map) {
        drawMap('riversMapCanvas', map, false);
        return map;
    })
    .add('forestMap', function(map) {
        drawMap('forestMapCanvas', map, false);
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

    let pos = getPosition(this),
        scale = config.worldSize / miniMapCanvas.offsetWidth,
        point = [
            Math.floor((e.pageX - pos.x) * scale),
            Math.floor((e.pageY - pos.y) * scale)
        ];

    world.moveMapTo(
        centerCameraPoint(point, config.visibleCols)
    );
});