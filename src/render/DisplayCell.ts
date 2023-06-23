import {RGBa} from "../helpers.js";

export default class DisplayCell {

    readonly color: RGBa;
    readonly image: null | HTMLImageElement;
    readonly withBg: boolean;

    constructor(color: RGBa, image: null | HTMLImageElement, withBackground: boolean) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
        this.withBg = withBackground;
    }

    getColor(): RGBa {
        return this.color;
    }

    getImage(): null | HTMLImageElement {
        return this.image;
    }

    hasImage(): boolean {
        return this.image instanceof HTMLImageElement;
    }

    drawBackground(): boolean {
        return this.withBg || !this.hasImage();
    }
}