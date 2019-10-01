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

let worldCanvas = document.getElementById('world'),
    coordinatesField = document.getElementById('coordinates'),
    worldWrapper = document.getElementById('worldWrapper'),
    miniMapCanvas = document.getElementById('miniMap'),
    world = new World();

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
        drawMap('humidityMapCanvas', map, true);
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
    .add('riverSourcesMap', function(map) {
        drawMap('riverSourcesMapCanvas', map, false);
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

world.init(worldCanvas, 250, 250);
world.setMapWrapper(worldWrapper);
world.setMiniMap(miniMapCanvas);
world.create();

coordinatesField.addEventListener("change", function() {

    let point = coordinatesField.value.split(','),
        x = 0,
        y = 0;

    if(point.length === 2) {
        x = parseInt(point[0], 10);
        y = parseInt(point[1], 10);
    }

    world.moveMapTo(x, y);
});