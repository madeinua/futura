import Config from './config.js';
import {Filters, fillCanvasPixel, rgbToHex} from "./src/helpers.js";
import World from './src/World.js';
import {Cell} from "./src/structures/Cells.js";
import Matrix from "./src/structures/Matrix.js";
import NumericMatrix from "./src/structures/NumericMatrix.js";
import AltitudeMap from "./src/maps/AltitudeMap.js";
import TemperatureMap from "./src/maps/TemperatureMap.js";
import HumidityMap from "./src/maps/HumidityMap.js";
import OceanMap from "./src/maps/OceanMap.js";
import CoastMap from "./src/maps/CoastMap.js";
import LakesMap from "./src/maps/LakesMap.js";
import RiversMap from "./src/maps/RiversMap.js";
import ForestMap from "./src/maps/ForestMap.js";
import Animal from "./src/animals/Animal.js";
import Biome from "./src/biomes/Biome.js";
import Fraction from "./src/human/Fraction.js";

const coordinatesField = document.getElementById('coordinates') as HTMLInputElement,
    displayMapVisibleRange = document.getElementById('displayMapVisibleRange') as HTMLInputElement,
    displayMapWrapper = document.getElementById('displayMapWrapper') as HTMLDivElement,
    displayMap = document.getElementById('displayMap') as HTMLCanvasElement,
    miniMapCanvas = document.getElementById('miniMap') as HTMLCanvasElement,
    technicalMaps = document.getElementById('technicalMaps') as HTMLDivElement;

const world = new World(
    displayMap,
    displayMapWrapper.offsetWidth,
    displayMapWrapper.offsetHeight,
    miniMapCanvas,
    getCenteredCameraPosition()
);

function drawColorMap(id: string, map: Matrix) {

    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();

    const ctx = canvas.getContext('2d'),
        image = ctx.createImageData(canvas.width, canvas.height);

    for (let x = 0; x < map.getWidth(); x++) {
        for (let y = 0; y < map.getHeight(); y++) {
            fillCanvasPixel(
                image,
                (x + y * canvas.width) * 4,
                map.getCell(x, y).getHexColor()
            );
        }
    }

    ctx.putImageData(image, 0, 0);
}

function drawInfoMap(id: string, map: NumericMatrix, reverse: boolean) {

    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();

    const ctx = canvas.getContext('2d'),
        image = ctx.createImageData(canvas.width, canvas.height);

    map.foreach(function (x: number, y: number) {

        let point = (x + y * canvas.width) * 4,
            gray = reverse ? 255 - map.getGrayscale(x, y) : map.getGrayscale(x, y);

        fillCanvasPixel(image, point, [gray, gray, gray]);
    });

    ctx.putImageData(image, 0, 0);
}

function getCameraPosition(): Cell {

    let point = coordinatesField.value.split(','),
        x = 0,
        y = 0;

    if (point.length === 2) {
        x = parseInt(point[0], 10);
        y = parseInt(point[1], 10);
    }

    return [x, y];
}

function centerCameraPoint(point: Cell): Cell {

    const cw = Math.floor(Config.VISIBLE_COLS / 2),
        ch = Math.floor(Config.VISIBLE_ROWS / 2);

    return [
        Math.max(0, point[0] - cw),
        Math.max(0, point[1] - ch)
    ];
}

function getCenteredCameraPosition(): Cell {
    return centerCameraPoint(
        getCameraPosition()
    );
}

function centeredCameraPointToXY(point: Cell): Cell {

    const cw = Math.floor(Config.VISIBLE_COLS / 2),
        ch = Math.floor(Config.VISIBLE_ROWS / 2);

    return [
        Math.max(0, point[0] + cw),
        Math.max(0, point[1] + ch)
    ];
}

function scrollIntoToView() {
    displayMapWrapper.scrollLeft = world.cameraPosLeft * world.cellWidth;
    displayMapWrapper.scrollTop = world.cameraPosTop * world.cellHeight;
}

function pauseTimer(): boolean {
    return world.timer.isTimerPaused()
        ? world.timer.unpauseTimer()
        : world.timer.pauseTimer();
}

Filters.add('mapMoved', function (point: Cell) {
    point = centeredCameraPointToXY(point);
    coordinatesField.value = point[0] + ',' + point[1];
    displayMapVisibleRange.innerHTML = '[' + world.cameraPosLeft + '-' + (world.cameraPosTop + Config.VISIBLE_COLS) + ' | ' + world.cameraPosTop + '-' + (world.cameraPosTop + Config.VISIBLE_ROWS) + ']';
});

if (Config.DRAW_TECHNICAL_MAPS) {

    Filters.add('altitudeMap', function (map: AltitudeMap) {
        drawInfoMap('altitudeMapCanvas', map, false);
        return map;
    });

    Filters.add('temperatureMap', function (map: TemperatureMap) {
        drawInfoMap('temperatureMapCanvas', map, false);
        return map;
    });

    Filters.add('humidityMap', function (map: HumidityMap) {
        drawInfoMap('humidityMapCanvas', map, true);
        return map;
    });

    Filters.add('oceanMap', function (map: OceanMap) {
        drawInfoMap('oceanMapCanvas', map, true);
        return map;
    });

    Filters.add('coastMap', function (map: CoastMap) {
        drawInfoMap('coastMapCanvas', map, true);
        return map;
    });

    Filters.add('lakesMap', function (map: LakesMap) {
        drawInfoMap('lakesMapCanvas', map, true);
        return map;
    });

    Filters.add('riversMap', function (map: RiversMap) {
        drawInfoMap('riversMapCanvas', map, false);
        return map;
    });

    Filters.add('biomes', function (biomes: Matrix) {
        drawColorMap('biomesCanvas', biomes);

        let biomesTypesCounter: { [key: string]: number } = {};

        biomes.foreachValues(function (biome: Biome) {
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

    Filters.add('forestMap', function (map: ForestMap) {
        drawInfoMap('forestMapCanvas', map, true);
        document.getElementById('forestCounter').innerHTML = map.countFilled().toString();
        return map;
    });

    Filters.add('animalsSteps', function (animals: Animal[]) {

        let text: string = '',
            groups = {};

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

Filters.add('fractionsUpdated', function (fractions: Fraction[]) {
    document.getElementById('fractionsList').innerHTML = fractions.map(function (fraction: Fraction) {
        return '<li>' + fraction.getName() + ': <span style="background-color:' + rgbToHex(fraction.getFractionColor()) + '"></span> (' + fraction.getSize() + ' cells)</li>';
    }).join('');
});

coordinatesField.addEventListener("change", function () {

    world.moveMapTo(
        getCenteredCameraPosition()
    );

    scrollIntoToView()
});

miniMapCanvas.addEventListener("click", function (e) {

    const rect = this.getBoundingClientRect(),
        scale = Config.WORLD_SIZE / miniMapCanvas.offsetWidth;

    world.moveMapTo(
        centerCameraPoint([
            Math.floor(e.clientX - rect.left * scale),
            Math.floor(e.clientY - rect.top * scale)
        ])
    );

    scrollIntoToView();
});

document.getElementById('pauseSteps').addEventListener("click", function () {
    pauseTimer();
});

world.timer.addStepsHandler(function (step: string) {
    document.getElementById('stepsCounter').innerHTML = step;
});

document.getElementById('generateFractions').addEventListener("click", function () {
    world.generateFractions();
});

// Timeout is needed to wait for the map to be generated (the process resizes the canvas and triggers scroll event)
setTimeout(function () {
    displayMapWrapper.addEventListener("scroll", function () {
        world.moveMapTo(
            world.getCellByXY(displayMapWrapper.scrollLeft, displayMapWrapper.scrollTop)
        );
    });
}, 1000);

world.create();