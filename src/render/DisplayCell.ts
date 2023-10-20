import {RGBa} from "../helpers.js";

type DisplayCellMap = {
    color: RGBa
}

export default class DisplayCell {

    readonly color: RGBa;
    readonly image: null | HTMLImageElement;
    readonly withBg: boolean;
    readonly mapSettings: null | DisplayCellMap;

    constructor(color: RGBa, image: null | HTMLImageElement, withBackground: boolean, mapSettings: DisplayCellMap = null) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
        this.withBg = withBackground;
        this.mapSettings = mapSettings;
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

    getMapColor(): RGBa {
        return this.mapSettings === null
            ? this.color
            : this.mapSettings.color;
    }
}