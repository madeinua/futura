class Biome_Rocks extends Biome {

    static NAME = 'rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Rocks, -(this.altitude - 0.5) * 200)
    }

    /**
     * @returns {DisplayCell}
     */
    getDisplayCell() {
        return new DisplayCell(
            this.getHexColor(),
            createImage(config.BIOME_IMAGES.Biome_Rocks),
            true
        );
    }
}