import Config from './config.js';
import { Filters, fillCanvasPixel } from "./src/helpers.js";
import World from './src/World.js';
const coordinatesField = document.getElementById('coordinates'), displayMapVisibleRange = document.getElementById('displayMapVisibleRange'), displayMapWrapper = document.getElementById('displayMapWrapper'), displayMap = document.getElementById('displayMap'), miniMapCanvas = document.getElementById('miniMap'), technicalMaps = document.getElementById('technicalMaps');
const world = new World(displayMap, displayMapWrapper.offsetWidth, displayMapWrapper.offsetHeight, miniMapCanvas, getCenteredCameraPosition());
function drawColorMap(id, map) {
    const canvas = document.getElementById(id);
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();
    const ctx = canvas.getContext('2d'), image = ctx.createImageData(canvas.width, canvas.height);
    for (let x = 0; x < map.getWidth(); x++) {
        for (let y = 0; y < map.getHeight(); y++) {
            fillCanvasPixel(image, (x + y * canvas.width) * 4, map.getCell(x, y).getHexColor());
        }
    }
    ctx.putImageData(image, 0, 0);
}
function drawInfoMap(id, map, reverse) {
    const canvas = document.getElementById(id);
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();
    const ctx = canvas.getContext('2d'), image = ctx.createImageData(canvas.width, canvas.height);
    map.foreach(function (x, y) {
        let point = (x + y * canvas.width) * 4, gray = reverse ? 255 - map.getGrayscale(x, y) : map.getGrayscale(x, y);
        fillCanvasPixel(image, point, [gray, gray, gray]);
    });
    ctx.putImageData(image, 0, 0);
}
function getCameraPosition() {
    let point = coordinatesField.value.split(','), x = 0, y = 0;
    if (point.length === 2) {
        x = parseInt(point[0], 10);
        y = parseInt(point[1], 10);
    }
    return [x, y];
}
function centerCameraPoint(point) {
    const cw = Math.floor(Config.VISIBLE_COLS / 2), ch = Math.floor(Config.VISIBLE_ROWS / 2);
    return [
        Math.max(0, point[0] - cw),
        Math.max(0, point[1] - ch)
    ];
}
function getCenteredCameraPosition() {
    return centerCameraPoint(getCameraPosition());
}
function centeredCameraPointToXY(point) {
    const cw = Math.floor(Config.VISIBLE_COLS / 2), ch = Math.floor(Config.VISIBLE_ROWS / 2);
    return [
        Math.max(0, point[0] + cw),
        Math.max(0, point[1] + ch)
    ];
}
function scrollIntoToView() {
    displayMapWrapper.scrollLeft = world.cameraPosLeft * world.cellWidth;
    displayMapWrapper.scrollTop = world.cameraPosTop * world.cellHeight;
}
function pauseTimer() {
    return world.timer.isTimerPaused()
        ? world.timer.unpauseTimer()
        : world.timer.pauseTimer();
}
Filters.add('mapMoved', function (point) {
    point = centeredCameraPointToXY(point);
    coordinatesField.value = point[0] + ',' + point[1];
    displayMapVisibleRange.innerHTML = '[' + world.cameraPosLeft + '-' + (world.cameraPosTop + Config.VISIBLE_COLS) + ' | ' + world.cameraPosTop + '-' + (world.cameraPosTop + Config.VISIBLE_ROWS) + ']';
});
if (Config.DRAW_TECHNICAL_MAPS) {
    Filters.add('altitudeMap', function (map) {
        drawInfoMap('altitudeMapCanvas', map, false);
        return map;
    });
    Filters.add('temperatureMap', function (map) {
        drawInfoMap('temperatureMapCanvas', map, false);
        return map;
    });
    Filters.add('humidityMap', function (map) {
        drawInfoMap('humidityMapCanvas', map, true);
        return map;
    });
    Filters.add('oceanMap', function (map) {
        drawInfoMap('oceanMapCanvas', map, true);
        return map;
    });
    Filters.add('coastMap', function (map) {
        drawInfoMap('coastMapCanvas', map, true);
        return map;
    });
    Filters.add('lakesMap', function (map) {
        drawInfoMap('lakesMapCanvas', map, true);
        return map;
    });
    Filters.add('riversMap', function (map) {
        drawInfoMap('riversMapCanvas', map, false);
        return map;
    });
    Filters.add('biomes', function (biomes) {
        drawColorMap('biomesCanvas', biomes);
        let biomesTypesCounter = {};
        biomes.foreachValues(function (biome) {
            if (typeof biomesTypesCounter[biome.getName()] === 'undefined') {
                biomesTypesCounter[biome.getName()] = 0;
            }
            biomesTypesCounter[biome.getName()]++;
        });
        // Sort by value
        biomesTypesCounter = Object.keys(biomesTypesCounter).sort(function (a, b) {
            return biomesTypesCounter[b] - biomesTypesCounter[a];
        }).reduce(function (result, key) {
            result[key] = biomesTypesCounter[key];
            return result;
        }, {});
        // Add counters as list to <ul> element
        let list = document.getElementById('biomesTypesCounter');
        for (let i in biomesTypesCounter) {
            let item = document.createElement('li');
            item.innerHTML = i.substring(6) + ': ' + biomesTypesCounter[i];
            list.appendChild(item);
        }
        return biomes;
    });
    Filters.add('forestMap', function (map) {
        drawInfoMap('forestMapCanvas', map, true);
        document.getElementById('forestCounter').innerHTML = map.countFilled().toString();
        return map;
    });
    Filters.add('animalsSteps', function (animals) {
        let text = '', groups = {};
        for (let i = 0; i < animals.length; i++) {
            if (typeof groups[animals[i].getName()] === 'undefined') {
                groups[animals[i].getName()] = 0;
            }
            groups[animals[i].getName()]++;
        }
        for (let i in groups) {
            text += i + ': ' + groups[i] + '<br />';
        }
        document.getElementById('animalsList').innerHTML = text;
        document.getElementById('animalsCounter').innerHTML = animals.length.toString();
    });
    technicalMaps.style.display = 'block';
}
coordinatesField.addEventListener("change", function () {
    world.moveMapTo(getCenteredCameraPosition());
    scrollIntoToView();
});
miniMapCanvas.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect(), scale = Config.WORLD_SIZE / miniMapCanvas.offsetWidth;
    world.moveMapTo(centerCameraPoint([
        Math.floor(e.clientX - rect.left * scale),
        Math.floor(e.clientY - rect.top * scale)
    ]));
    scrollIntoToView();
});
document.getElementById('pauseSteps').addEventListener("click", function () {
    pauseTimer();
});
world.timer.addStepsHandler(function (step) {
    document.getElementById('stepsCounter').innerHTML = step;
});
document.getElementById('generateFractions').addEventListener("click", function () {
    world.generateFractions();
});
// Timeout is needed to wait for the map to be generated (the process resizes the canvas and triggers scroll event)
setTimeout(function () {
    displayMapWrapper.addEventListener("scroll", function () {
        world.moveMapTo(world.getCellByXY(displayMapWrapper.scrollLeft, displayMapWrapper.scrollTop));
    });
}, 1000);
world.create();
