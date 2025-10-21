import Config from '../config';
import {drawColoredMap, drawColorMap, Filters, getCameraPosition, rgbToHex} from "./helpers";
import World from './World';
import {Cell} from "./structures/Cells";
import Matrix from "./structures/Matrix";
import AltitudeMap from "./maps/AltitudeMap";
import TemperatureMap from "./maps/TemperatureMap";
import HumidityMap from "./maps/HumidityMap";
import OceanMap from "./maps/OceanMap";
import CoastMap from "./maps/CoastMap";
import LakesMap from "./maps/LakesMap";
import RiversMap from "./maps/RiversMap";
import ForestMap from "./maps/ForestMap";
import Animal from "./animals/Animal";
import Biome from "./biomes/Biome";
import Faction from "./human/Faction";
import Timer from "./services/Timer";

const coordinatesField = document.getElementById('coordinates') as HTMLInputElement,
    displayMapVisibleRange = document.getElementById('displayMapVisibleRange') as HTMLInputElement,
    displayMapWrapper = document.getElementById('displayMapWrapper') as HTMLDivElement,
    displayMap = document.getElementById('displayMap') as HTMLCanvasElement,
    miniMapCanvas = document.getElementById('miniMap') as HTMLCanvasElement,
    technicalMaps = document.getElementById('technicalMaps') as HTMLDivElement;

new World(
    displayMap,
    displayMapWrapper.offsetWidth,
    displayMapWrapper.offsetHeight,
    miniMapCanvas,
    getCameraPosition(coordinatesField),
    (world: World) => {

        function getCameraPointByStartPoint(point: Cell): Cell {

            const cw = Math.floor(world.visibleCellCols / 2),
                ch = Math.floor(world.visibleCellRows / 2);

            return [
                Math.max(0, point[0] + cw),
                Math.max(0, point[1] + ch)
            ];
        }

        function scrollIntoToView() {
            displayMapWrapper.scrollLeft = world.cameraPos[0] * Config.CELL_SIZE;
            displayMapWrapper.scrollTop = world.cameraPos[1] * Config.CELL_SIZE;
        }

        function pauseTimer(): boolean {
            return world.timer.isTimerPaused()
                ? world.timer.unpauseTimer()
                : world.timer.pauseTimer();
        }

        Filters.add('mapMoved', (point: Cell) => {
            point = getCameraPointByStartPoint(point);
            coordinatesField.value = point[0] + ',' + point[1];
            displayMapVisibleRange.innerHTML = '[' + world.cameraPos[0] + '-' + (world.cameraPos[1] + world.visibleCellCols) + ' | ' + world.cameraPos[1] + '-' + (world.cameraPos[1] + world.visibleCellRows) + ']';
            return point;
        });

        if (Config.DRAW_TECHNICAL_MAPS) {

            Filters.add('altitudeMap', (map: AltitudeMap) => {
                drawColoredMap('altitudeMapCanvas', map, [34, 139, 34], [255, 255, 255]);
                document.getElementById('altitudeCellsCount')!.innerHTML = map.getLandCellsCount().toString();
                return map;
            });

            Filters.add('temperatureMap', (map: TemperatureMap) => {
                drawColoredMap('temperatureMapCanvas', map, [50, 50, 255], [255, 69, 0]);
                return map;
            });

            Filters.add('oceanMap', (map: OceanMap) => {
                drawColoredMap('oceanMapCanvas', map, [255, 255, 255], [0, 105, 148]);
                return map;
            });

            Filters.add('coastMap', (map: CoastMap) => {
                drawColoredMap('coastMapCanvas', map, [255, 255, 255], [205, 133, 63]);
                return map;
            });

            Filters.add('lakesMap', (map: LakesMap) => {
                drawColoredMap('lakesMapCanvas', map, [255, 255, 255], [0, 105, 148]);
                return map;
            });

            Filters.add('riversMap', (map: RiversMap) => {
                drawColoredMap('riversMapCanvas', map, [255, 255, 255], [0, 105, 148]);
                return map;
            });

            Filters.add('humidityMap', (map: HumidityMap) => {
                drawColoredMap('humidityMapCanvas', map, [210, 180, 140], [34, 139, 34]);
                return map;
            });

            Filters.add('biomes', (biomes: Matrix) => {
                drawColorMap('biomesCanvas', biomes);

                let biomesTypesCounter: Record<string, number> = {};

                biomes.foreachValues((biome: Biome) => {
                    const name = biome.getName();
                    biomesTypesCounter[name] = (biomesTypesCounter[name] ?? 0) + 1;
                });

                biomesTypesCounter = Object.fromEntries(
                    Object.entries(biomesTypesCounter).sort(([, a], [, b]) => b - a)
                ) as Record<string, number>;

                // Add counters as list to <ul> element
                const list = document.getElementById('biomesTypesCounter');
                if (list) {
                    for (const i in biomesTypesCounter) {
                        const item = document.createElement('li');
                        item.innerHTML = i.substring(6) + ': ' + biomesTypesCounter[i];
                        list.appendChild(item);
                    }
                }

                return biomes;
            });

            Filters.add('forestMap', (map: ForestMap) => {
                drawColoredMap('forestMapCanvas', map, [255, 255, 255], [34, 139, 34]);
                document.getElementById('forestCounter')!.innerHTML = map.countFilled().toString();
                return map;
            });

            Filters.add('animalsSteps', (val) => {
                const animals = val as Animal[];

                const groups: Record<string, number> = {};
                for (const a of animals) {
                    const name = a.getName();
                    groups[name] = (groups[name] ?? 0) + 1;
                }

                (document.getElementById('animalsList') as HTMLElement)!.innerHTML = Object.entries(groups)
                    .map(([name, count]) => `${name}: ${count}`)
                    .join('<br />');
                (document.getElementById('animalsCounter') as HTMLElement)!.textContent = String(animals.length);

                return animals;
            });


            technicalMaps.style.display = 'block';
        }

        Filters.add('factionsUpdated', (factions: Faction[]) => {
            document.getElementById('factionsList')!.innerHTML = factions.map((faction: Faction) => {
                return '<li>' + faction.getName() + ': <span style="background-color:' + rgbToHex(faction.getFactionColor()) + '"></span> (' + faction.getSize() + ' cells)</li>';
            }).join('');
        });

        coordinatesField.addEventListener("change", () => {
            world.moveMapTo(getCameraPosition(coordinatesField));
            scrollIntoToView()
        });

        miniMapCanvas.addEventListener("click", function (e) {
            const rect = this.getBoundingClientRect(),
                scale = Config.WORLD_SIZE / miniMapCanvas.offsetWidth;

            world.moveMapTo(
                [
                    Math.floor(e.clientX - rect.left * scale),
                    Math.floor(e.clientY - rect.top * scale)
                ]
            );

            scrollIntoToView();
        });

        (document.getElementById('pauseSteps') as HTMLButtonElement).innerText = world.timer.isTimerPaused() ? 'Pause' : 'Start';
        document.getElementById('pauseSteps')!.addEventListener("click", () => {
            pauseTimer();
            (document.getElementById('pauseSteps') as HTMLButtonElement).innerText = world.timer.isTimerPaused() ? 'Resume' : 'Pause';
        });

        world.timer.addStepsHandler((step: number): void => {
            document.getElementById('stepsCounter')!.innerHTML = String(step);
        });

        Filters.add('timer', (timer: Timer) => {
            document.getElementById('timerFps')!.innerHTML = timer.getFps().toString();
        });

        document.getElementById('generateFactions')!.addEventListener("click", () => {
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
    }
);