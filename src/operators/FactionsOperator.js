import FactionGenerator from "../generators/FactionGenerator.js";
import { Filters, logTimeEvent, resetTimeEvent, throwError } from "../helpers.js";
import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
export default class FactionsOperator {
    constructor(args) {
        this.factions = [];
        this.factionsGenerator = new FactionGenerator(args);
        this.forestMap = args.forestMap;
        this.biomesMap = args.biomesMap;
        this.factionsLayer = args.factionsLayer;
        this.factionsBorderLayer = args.factionsBorderLayer;
        this.occupiedTerritories = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        args.timer.addStepsHandler((step) => {
            if (this.factions.length) {
                this.expandFactions();
                Filters.apply('factionsUpdated', this.factions);
            }
            else if (Config.FACTIONS.AUTO_CREATE_ON_STEP === step) {
                this.createFactions(Config.FACTIONS.COUNT);
            }
        });
    }
    createFactions(count) {
        resetTimeEvent();
        this.factions = this.factionsGenerator.generateFactions(count);
        this.factions.forEach(faction => {
            this.occupyCell(faction.startPosition[0], faction.startPosition[1], faction);
            this.fillFactionsStartPosition(faction.startPosition, faction);
        });
        if (Config.LOGS) {
            logTimeEvent('Factions created.');
        }
    }
    canIncreaseCellInfluence(positionX, positionY) {
        return !this.occupiedTerritories.filled(positionX, positionY);
    }
    increaseCellInfluence(positionX, positionY, faction) {
        let influence = 1;
        const influenceOriginal = faction.influenceTerritory.getCell(positionX, positionY);
        const biome = this.biomesMap.getCell(positionX, positionY);
        // Influence depends on the biome
        if (this.forestMap.filled(positionX, positionY)) {
            influence *= Config.FACTIONS.INFLUENCE.FOREST_BOOST;
        }
        else {
            const infName = biome.getName();
            if (typeof Config.FACTIONS.INFLUENCE[infName] === 'undefined') {
                throwError(`Unknown influence name: ${infName}`, 10, true);
            }
            else {
                influence *= Config.FACTIONS.INFLUENCE[infName];
            }
        }
        // Influence depends on the altitude
        if (biome.isHills) {
            influence *= Config.FACTIONS.INFLUENCE.HILLS_BOOST;
        }
        else if (biome.isMountains) {
            influence *= Config.FACTIONS.INFLUENCE.MOUNTAINS_BOOST;
        }
        // 1 is the maximum influence
        influence = Math.min(1, influenceOriginal + influence);
        faction.influenceTerritory.setCell(positionX, positionY, influence);
    }
    occupyCell(positionX, positionY, faction) {
        faction.territory.fill(positionX, positionY);
        faction.influenceTerritory.setCell(positionX, positionY, 1);
        this.occupiedTerritories.fill(positionX, positionY);
    }
    canOccupyCell(positionX, positionY, faction) {
        return !this.occupiedTerritories.filled(positionX, positionY)
            && faction.influenceTerritory.getCell(positionX, positionY) === 1;
    }
    expandFaction(faction) {
        faction.borders.foreachFilledAroundRadiusToAllCells((nx, ny, fromCellX, fromCellY) => {
            if (this.canIncreaseCellInfluence(nx, ny)) {
                this.increaseCellInfluence(nx, ny, faction);
            }
            if (this.canOccupyCell(nx, ny, faction)) {
                this.occupyCell(nx, ny, faction);
                this.fillFactionsLayer([nx, ny], faction);
            }
        }, 1);
    }
    expandFactions() {
        this.factions.forEach(faction => {
            this.expandFaction(faction);
            this.updateFactionBorders(faction);
        });
        this.fillFactionsBorderLayer();
    }
    updateFactionBorders(faction) {
        faction.borders.unfillAll();
        faction.territory.foreachFilled((x, y) => {
            if (faction.territory.hasUnfilledNeighbors(x, y)) {
                faction.borders.fill(x, y);
            }
        });
    }
    fillFactionsStartPosition(position, faction) {
        this.factionsLayer.setCell(position[0], position[1], new DisplayCell(faction.getFactionColor(), null));
    }
    fillFactionsLayer(position, faction) {
        this.factionsLayer.setCell(position[0], position[1], new DisplayCell(faction.getFactionTerritoryColor(), null));
    }
    fillFactionsBorderLayer() {
        this.factionsBorderLayer.unsetAll();
        this.factions.forEach(faction => {
            faction.borders.foreachFilled((x, y) => {
                this.factionsBorderLayer.setCell(x, y, new DisplayCell(faction.getFactionBorderColor(), null));
            });
        });
    }
}
