export default class DisplayCell {
    constructor(color, image, withBackground, miniMapSettings = null) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
        this.withBg = withBackground;
        this.miniMapSettings = miniMapSettings;
    }
    getColor() {
        return this.color;
    }
    getImage() {
        return this.image;
    }
    hasImage() {
        return this.image instanceof HTMLImageElement;
    }
    drawBackground() {
        return this.withBg || !this.hasImage();
    }
    getMiniMapColor() {
        return this.miniMapSettings === null
            ? this.color
            : this.miniMapSettings.color;
    }
}
