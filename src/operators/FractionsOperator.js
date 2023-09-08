import FractionGenerator from "../generators/FractionGenerator.js";
import { logTimeEvent } from "../helpers.js";
import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js";
export default class FractionsOperator {
    constructor(timer, fractionsLayer, objects) {
        this.addFractionsToLayer = function (fractions) {
            for (let i = 0; i < fractions.length; i++) {
                this.fractionsLayer.setCell(fractions[i].startPosition[0], fractions[i].startPosition[1], new DisplayCell(fractions[i].getFractionColor(), null, false));
            }
        };
        this.timer = timer;
        this.fractionsLayer = fractionsLayer;
        this.fractionsGenerator = new FractionGenerator(objects);
    }
    createFractions(count) {
        this.addFractionsToLayer(this.fractionsGenerator.generateFractions(count));
        if (Config.LOGS) {
            logTimeEvent('Fractions created.');
        }
        //return this.fractionsGenerator.createOccurrenceProbabilityMap();
    }
}
