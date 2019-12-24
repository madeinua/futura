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

let coordinatesField = document.getElementById('coordinates'),
    miniMapCanvas = document.getElementById('miniMap');

let world = new World({
    //storeData: false,
    worldSize: 300,
    visibleCols: 30,
    worldCanvas: document.getElementById('world'),
    miniMapCanvas: miniMapCanvas,
    cameraPosX: getCameraPosition()[0],
    cameraPosY: getCameraPosition()[1]
});

Filters
    .add('mapMoved', function(point) {
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
    .add('beachesMap', function(map) {
        drawMap('beachesMapCanvas', map, true);
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

coordinatesField.addEventListener("change", function() {
    world.moveMapTo(
        getCameraPosition(),
        false
    );
});

miniMapCanvas.addEventListener("click", function(e) {

    let pos = getPosition(this),
        point = [
            Math.floor((e.pageX - pos.x) * world.miniMapScale),
            Math.floor((e.pageY - pos.y) * world.miniMapScale)
        ];

    world.moveMapTo(point, true);
});