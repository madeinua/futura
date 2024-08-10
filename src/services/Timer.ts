import {logTimeEvent} from "../helpers.js";
import Config from "../../config.js";

export default class Timer {
    private timerStep: number = 0;
    private stepsHandlers: Array<(step: number) => void> = [];
    private timerPaused: boolean = false;
    private timerInterval: NodeJS.Timer | null = null;

    addStepsHandler(handler: (step: number) => void): void {
        this.stepsHandlers.push(handler);
    }

    stepsTimer(callback: () => void): void {
        const timerStart = Date.now();
        let minStepInterval = Config.STEPS_MIN_INTERVAL / Config.STEPS_BOOST;
        let boosted = false;

        this.timerStep = 0;

        const makeStep = (): void => {
            if (this.timerPaused) {
                return;
            }

            this.stepsHandlers.forEach(handler => handler(this.timerStep));
            this.timerStep++;

            callback();

            if (this.timerStep > Config.STEPS_LIMIT) {
                if (Config.LOGS) {
                    logTimeEvent(`Steps running has ended. Avg. time per step: ${Math.round((Date.now() - timerStart) / Config.STEPS_LIMIT)}ms`);
                }
                this.clearTimerInterval();
                return;
            }

            if (!boosted && this.timerStep > Config.STEPS_BOOST_STEPS) {
                this.clearTimerInterval();
                minStepInterval *= Config.STEPS_BOOST;
                this.timerInterval = setInterval(makeStep, minStepInterval);
                boosted = true;
            }
        };

        this.timerInterval = setInterval(makeStep, minStepInterval);
        makeStep();
    }

    private clearTimerInterval(): void {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    isTimerPaused(): boolean {
        return this.timerPaused;
    }

    pauseTimer(): boolean {
        if (this.isTimerPaused()) {
            return false;
        }
        this.timerPaused = true;
        return true;
    }

    unpauseTimer(): boolean {
        if (!this.isTimerPaused()) {
            return false;
        }
        this.timerPaused = false;
        return true;
    }
}