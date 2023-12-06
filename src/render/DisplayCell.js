export default class DisplayCell {
    constructor(color, image, withBackground) {
        this.color = color;
        this.image = image;
        this.withBg = withBackground;
    }
    getColor() {
        return this.color;
    }
    hasImage() {
        return this.image !== null;
    }
    getImage() {
        return this.image;
    }
    // @TODO Add logic to display image + bg for the same cell
    drawBackground() {
        return this.withBg || !this.hasImage();
    }
    getMapColor() {
        return this.color;
    }
}
