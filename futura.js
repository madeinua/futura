import Config from './config.js';
import { Filters, fillCanvasPixel, rgbToHex } from "./src/helpers.js";
import World from './src/World.js';
const coordinatesField = document.getElementById('coordinates'), displayMapVisibleRange = document.getElementById('displayMapVisibleRange'), displayMapWrapper = document.getElementById('displayMapWrapper'), displayMap = document.getElementById('displayMap'), miniMapCanvas = document.getElementById('miniMap'), technicalMaps = document.getElementById('technicalMaps');
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
    map.foreach((x, y) => {
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
new World(displayMap, displayMapWrapper.offsetWidth, displayMapWrapper.offsetHeight, miniMapCanvas, getCameraPosition(), (world) => {
    function getCameraPointByStartPoint(point) {
        const cw = Math.floor(world.visibleCellCols / 2), ch = Math.floor(world.visibleCellRows / 2);
        return [
            Math.max(0, point[0] + cw),
            Math.max(0, point[1] + ch)
        ];
    }
    function scrollIntoToView() {
        displayMapWrapper.scrollLeft = world.cameraPos[0] * Config.CELL_SIZE;
        displayMapWrapper.scrollTop = world.cameraPos[1] * Config.CELL_SIZE;
    }
    function pauseTimer() {
        return world.timer.isTimerPaused()
            ? world.timer.unpauseTimer()
            : world.timer.pauseTimer();
    }
    Filters.add('mapMoved', (point) => {
        point = getCameraPointByStartPoint(point);
        coordinatesField.value = point[0] + ',' + point[1];
        displayMapVisibleRange.innerHTML = '[' + world.cameraPos[0] + '-' + (world.cameraPos[1] + world.visibleCellCols) + ' | ' + world.cameraPos[1] + '-' + (world.cameraPos[1] + world.visibleCellRows) + ']';
    });
    if (Config.DRAW_TECHNICAL_MAPS) {
        Filters.add('altitudeMap', (map) => {
            drawInfoMap('altitudeMapCanvas', map, false);
            return map;
        });
        Filters.add('temperatureMap', (map) => {
            drawInfoMap('temperatureMapCanvas', map, false);
            return map;
        });
        Filters.add('humidityMap', (map) => {
            drawInfoMap('humidityMapCanvas', map, true);
            return map;
        });
        Filters.add('oceanMap', (map) => {
            drawInfoMap('oceanMapCanvas', map, true);
            return map;
        });
        Filters.add('coastMap', (map) => {
            drawInfoMap('coastMapCanvas', map, true);
            return map;
        });
        Filters.add('lakesMap', (map) => {
            drawInfoMap('lakesMapCanvas', map, true);
            return map;
        });
        Filters.add('riversMap', (map) => {
            drawInfoMap('riversMapCanvas', map, false);
            return map;
        });
        Filters.add('biomes', (biomes) => {
            drawColorMap('biomesCanvas', biomes);
            let biomesTypesCounter = {};
            biomes.foreachValues((biome) => {
                if (typeof biomesTypesCounter[biome.getName()] === 'undefined') {
                    biomesTypesCounter[biome.getName()] = 0;
                }
                biomesTypesCounter[biome.getName()]++;
            });
            // Sort by value
            biomesTypesCounter = Object.keys(biomesTypesCounter).sort((a, b) => {
                return biomesTypesCounter[b] - biomesTypesCounter[a];
            }).reduce((result, key) => {
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
        Filters.add('forestMap', (map) => {
            drawInfoMap('forestMapCanvas', map, true);
            document.getElementById('forestCounter').innerHTML = map.countFilled().toString();
            return map;
        });
        Filters.add('animalsSteps', (animals) => {
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
    Filters.add('fractionsUpdated', (fractions) => {
        document.getElementById('fractionsList').innerHTML = fractions.map((fraction) => {
            return '<li>' + fraction.getName() + ': <span style="background-color:' + rgbToHex(fraction.getFractionColor()) + '"></span> (' + fraction.getSize() + ' cells)</li>';
        }).join('');
    });
    coordinatesField.addEventListener("change", () => {
        world.moveMapTo(getCameraPosition());
        scrollIntoToView();
    });
    miniMapCanvas.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect(), scale = Config.WORLD_SIZE / miniMapCanvas.offsetWidth;
        world.moveMapTo([
            Math.floor(e.clientX - rect.left * scale),
            Math.floor(e.clientY - rect.top * scale)
        ]);
        scrollIntoToView();
    });
    document.getElementById('pauseSteps').addEventListener("click", () => {
        pauseTimer();
    });
    world.timer.addStepsHandler((step) => {
        document.getElementById('stepsCounter').innerHTML = String(step);
    });
    document.getElementById('generateFractions').addEventListener("click", () => {
        world.generateFractions();
    });
    // Timeout is needed to wait for the map to be generated (the process resizes the canvas and triggers scroll event)
    setTimeout(() => {
        displayMapWrapper.addEventListener("scroll", () => {
            world.moveMapTo(getCameraPointByStartPoint([
                Math.floor(displayMapWrapper.scrollLeft / Config.CELL_SIZE),
                Math.floor(displayMapWrapper.scrollTop / Config.CELL_SIZE)
            ]));
        });
    }, 1000);
    world.create();
});
