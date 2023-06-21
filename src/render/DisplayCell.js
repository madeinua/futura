export default class DisplayCell {
    constructor(color, image, withBackground) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
        this.withBg = withBackground;
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
}
