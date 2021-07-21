class AnimalsOperator {

    animals = [];

    /**
     * @param {AnimalGenerator} animalGenerator
     * @return {Animal}
     */
    createAnimal(animalGenerator) {

        let animal = animalGenerator.create(
            this.getCollisions()
        );

        if (animal) {
            this.animals.push({
                animal: animal,
                generator: animalGenerator
            });
        }

        return animal;
    }

    /**
     * @return {Array}
     */
    getCollisions() {

        let collisions = [];

        for (let i = 0; i < this.animals.length; i++) {
            collisions.push([
                this.animals[i].animal.x,
                this.animals[i].animal.y
            ]);
        }

        return collisions;
    }

    /**
     * @param callback
     */
    moveAnimals(callback) {

        let animal,
            generator;

        for (let i = 0; i < this.animals.length; i++) {

            animal = this.animals[i].animal;
            generator = this.animals[i].generator;

            if (animal.canMove()) {

                let ma = generator.getMovementsArea(
                    this.getCollisions()
                );

                if (!animal.move(ma)) {
                    continue;
                }
            }

            callback(animal);
        }
    }
}