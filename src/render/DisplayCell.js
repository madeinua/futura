export default class DisplayCell {
    constructor(color, image, withBackground, mapSettings = null) {
        this.color = color;
        this.image = image;
        this.withBg = withBackground;
        this.mapSettings = mapSettings;
    }
    getColor() {
        return this.color;
    }
    getImage() {
        return this.image;
    }
    hasImage() {
        return this.image !== null;
    }
    drawBackground() {
        return this.withBg || !this.hasImage();
    }
    getMapColor() {
        return this.mapSettings === null
            ? this.color
            : this.mapSettings.color;
    }
}
