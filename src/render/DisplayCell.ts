import {RGB} from "../helpers.js";

export default class DisplayCell {

    color: RGB;
    image: null | HTMLImageElement;
    withBg: boolean;

    constructor(color: RGB, image: null | HTMLImageElement, withBackground: boolean) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
        this.withBg = withBackground;
    }

    getColor(): RGB {
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