class Biome_Ice_Rocks extends Biome {

    static NAME = 'ice-rocks';

    /**
     * @return {string}
     */
    getColor() {
        return config.BIOME_COLORS.Biome_Ice_Rocks;
    }

    /**
     * @returns {DisplayCell}
     */
    getDisplayCell() {
        return new DisplayCell(
            this.getHexColor(),
            createImage(config.BIOME_IMAGES.Biome_Ice_Rocks),
            true
        );
    }
}