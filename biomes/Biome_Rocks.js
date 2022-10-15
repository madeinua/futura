class Biome_Rocks extends Biome {

    static NAME = 'rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor(config.BIOME_COLORS.Biome_Rocks, (this.altitude - 0.5) * 250);
    }

    /**
     * @returns {DisplayCell}
     */
    getImage() {
        return new DisplayCell(
            this.getHexColor(),
            createImage(config.BIOME_ROCKS_IMAGE)
        );
    }
}