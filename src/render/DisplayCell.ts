import {RGBa} from "../helpers.js";

type DisplayCellMiniMap = {
    color: RGBa
}

export default class DisplayCell {

    readonly color: RGBa;
    readonly image: null | HTMLImageElement;
    readonly withBg: boolean;
    readonly miniMapSettings: null | DisplayCellMiniMap;

    constructor(color: RGBa, image: null | HTMLImageElement, withBackground: boolean, miniMapSettings: DisplayCellMiniMap = null) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
        this.withBg = withBackground;
        this.miniMapSettings = miniMapSettings;
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

    getMiniMapColor(): RGBa {
        return this.miniMapSettings === null
            ? this.color
            : this.miniMapSettings.color;
    }
}