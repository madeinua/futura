import {RGBa} from "../helpers.js";

export default class DisplayCell {
    readonly color: RGBa;
    readonly images: string[];

    constructor(color: RGBa, image: null | string | string[]) {
        this.color = color;
        this.images = Array.isArray(image)
            ? image.filter((img): img is string => img !== null)
            : (image ? [image] : []);
    }

    getColor(): RGBa {
        return this.color;
    }

    getImages(): string[] {
        return this.images;
    }
}