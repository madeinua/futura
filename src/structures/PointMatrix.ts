import NumericMatrix from './NumericMatrix.js';

export default class PointMatrix extends NumericMatrix {

    normalize(): any {
        this.setRange(0, 1);
        return this;
    }
}