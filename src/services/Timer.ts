import {logTimeEvent} from "../helpers.js";
import Config from "../../config.js";

export default class Timer {
    private timerStep = 0;
    private stepsHandlers: Array<(step: number) => void> = [];
    private timerPaused = false;
    private timerInterval: NodeJS.Timer | null = null;

    addStepsHandler(handler: (step: number) => void): void {
        this.stepsHandlers.push(handler);
    }

    stepsTimer(callback: () => void): void {
        const {
            STEPS_MIN_INTERVAL,
            STEPS_BOOST,
            STEPS_LIMIT,
            STEPS_BOOST_STEPS,
            LOGS
        } = Config;

        const timerStart = Date.now();
        let minStepInterval = STEPS_MIN_INTERVAL / STEPS_BOOST;
        let boosted = false;
        this.timerStep = 0;

        const makeStep = (): void => {

            if (this.timerPaused) {
                return;
            }

            // Call all step handlers
            for (const handler of this.stepsHandlers) {
                handler(this.timerStep);
            }

            this.timerStep++;

            // Execute the provided callback each step
            callback();

            // Check if we reached the steps limit
            if (this.timerStep > STEPS_LIMIT) {

                if (LOGS) {
                    const avgTime = Math.round((Date.now() - timerStart) / STEPS_LIMIT);
                    logTimeEvent(`Steps running has ended. Avg. time per step: ${avgTime}ms`);
                }

                this.clearTimerInterval();

                return;
            }

            // Boost the timer interval after a given number of steps
            if (!boosted && this.timerStep > STEPS_BOOST_STEPS) {
                this.clearTimerInterval();
                minStepInterval *= STEPS_BOOST;
                this.timerInterval = setInterval(makeStep, minStepInterval);
                boosted = true;
            }
        };

        this.timerInterval = setInterval(makeStep, minStepInterval);

        // Start immediately.
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

        if (this.timerPaused) {
            return false;
        }

        this.timerPaused = true;

        return true;
    }

    unpauseTimer(): boolean {

        if (!this.timerPaused) {
            return false;
        }

        this.timerPaused = false;

        return true;
    }
}