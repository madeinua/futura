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
/**
 * Linearly interpolates between two colors.
 *
 * @param color1 - The start color as [R, G, B]
 * @param color2 - The end color as [R, G, B]
 * @param factor - A number between 0 and 1 representing the interpolation factor.
 * @returns The interpolated color as [R, G, B].
 */
function interpolateColor(color1, color2, factor) {
    return [
        Math.round(color1[0] + factor * (color2[0] - color1[0])),
        Math.round(color1[1] + factor * (color2[1] - color1[1])),
        Math.round(color1[2] + factor * (color2[2] - color1[2])),
    ];
}
/**
 * Draws a colored map onto a canvas by mapping each cell’s value (assumed to be between 0 and 255)
 * to a color determined by linear interpolation between the provided start and end colors.
 *
 * @param id - The id of the canvas element.
 * @param map - The NumericMatrix to draw.
 * @param startColor - The color representing the lowest values (e.g. blue for cold areas).
 * @param endColor - The color representing the highest values (e.g. orange for hot areas).
 */
function drawColoredMap(id, map, startColor, endColor) {
    const canvas = document.getElementById(id);
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    const image = ctx.createImageData(canvas.width, canvas.height);
    // For each cell, compute its color based on the normalized value.
    map.foreach((x, y) => {
        const gray = map.getGrayscale(x, y);
        const factor = gray / 255; // Normalize to [0, 1]
        // Interpolate between the two provided colors.
        const color = interpolateColor(startColor, endColor, factor);
        // Compute the pixel's starting index in the ImageData array.
        const point = (x + y * canvas.width) * 4;
        // Set the pixel color.
        image.data[point] = color[0]; // Red
        image.data[point + 1] = color[1]; // Green
        image.data[point + 2] = color[2]; // Blue
        image.data[point + 3] = 255; // Alpha
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
            drawColoredMap('altitudeMapCanvas', map, [34, 139, 34], [255, 255, 255]);
            document.getElementById('altitudeCellsCount').innerHTML = map.getLandCellsCount().toString();
            return map;
        });
        Filters.add('temperatureMap', (map) => {
            drawColoredMap('temperatureMapCanvas', map, [50, 50, 255], [255, 69, 0]);
            return map;
        });
        Filters.add('oceanMap', (map) => {
            drawColoredMap('oceanMapCanvas', map, [255, 255, 255], [0, 105, 148]);
            return map;
        });
        Filters.add('coastMap', (map) => {
            drawColoredMap('coastMapCanvas', map, [255, 255, 255], [205, 133, 63]);
            return map;
        });
        Filters.add('lakesMap', (map) => {
            drawColoredMap('lakesMapCanvas', map, [255, 255, 255], [0, 105, 148]);
            return map;
        });
        Filters.add('riversMap', (map) => {
            drawColoredMap('riversMapCanvas', map, [255, 255, 255], [0, 105, 148]);
            return map;
        });
        Filters.add('humidityMap', (map) => {
            drawColoredMap('humidityMapCanvas', map, [210, 180, 140], [34, 139, 34]);
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
            drawColoredMap('forestMapCanvas', map, [255, 255, 255], [34, 139, 34]);
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
    Filters.add('factionsUpdated', (factions) => {
        document.getElementById('factionsList').innerHTML = factions.map((faction) => {
            return '<li>' + faction.getName() + ': <span style="background-color:' + rgbToHex(faction.getFactionColor()) + '"></span> (' + faction.getSize() + ' cells)</li>';
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
    document.getElementById('generateFactions').addEventListener("click", () => {
        world.generateFactions();
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
