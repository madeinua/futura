import {RGBa} from "../helpers.js";

export default class DisplayCell {

    readonly color: RGBa;
    readonly image: null | string;

    constructor(color: RGBa, image: null | string) {
        this.color = color;
        this.image = image;
    }

    getColor(): RGBa {
        return this.color;
    }

    hasImage(): boolean {
        return this.image !== null;
    }

    getImage(): null | string {
        return this.image;
    }
}