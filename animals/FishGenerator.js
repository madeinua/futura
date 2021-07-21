class FishGenerator extends AnimalGenerator {

    /**
     * @return {BinaryMatrix}
     */
    createMovementsArea() {

        let ma = new BinaryMatrix(this.config.width, this.config.height);

        ma.combineWith(this.oceanMap);
        ma.combineWith(this.freshWaterMap);

        return ma;
    }
}