import {RGBa} from "../helpers.js";

type DisplayCellMap = {
    color: RGBa
}

export default class DisplayCell {

    readonly color: RGBa;
    readonly image: null | string;
    readonly withBg: boolean;
    readonly mapSettings: null | DisplayCellMap;

    constructor(color: RGBa, image: null | string, withBackground: boolean, mapSettings: DisplayCellMap = null) {
        this.color = color;
        this.image = image;
        this.withBg = withBackground;
        this.mapSettings = mapSettings;
    }

    getColor(): RGBa {
        return this.color;
    }

    getImage(): null | string {
        return this.image;
    }

    hasImage(): boolean {
        return this.image !== null;
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