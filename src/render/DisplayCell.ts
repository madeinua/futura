import {RGBa} from "../helpers.js";

export default class DisplayCell {

    readonly color: RGBa;
    readonly image: null | string;
    readonly withBg: boolean;

    constructor(color: RGBa, image: null | string, withBackground: boolean) {
        this.color = color;
        this.image = image;
        this.withBg = withBackground;
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

    // @TODO Add logic to display image + bg for the same cell
    drawBackground(): boolean {
        return this.withBg || !this.hasImage();
    }
}