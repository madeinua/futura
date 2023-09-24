import {RGBa} from "../helpers.js";

export default class DisplayArea {

    readonly color: RGBa;

    constructor(color: RGBa) {
        this.color = color;
    }

    getColor(): RGBa {
        return this.color;
    }
}