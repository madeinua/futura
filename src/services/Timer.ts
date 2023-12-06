import {logTimeEvent} from "../helpers.js";
import Config from "../../config.js";

export default class Timer {

    timerStep: number = 0;
    stepsHandlers: any[] = [];
    timerPaused: boolean = false;

    addStepsHandler(handler: Function): void {
        this.stepsHandlers.push(handler);
    }

    stepsTimer = function (callback: Function): void {

        const _this: Timer = this,
            timerStart = Date.now();

        let minStepInterval = Config.STEPS_MIN_INTERVAL / Config.STEPS_BOOST,
            timerInterval: NodeJS.Timer,
            boosted = false;

        _this.timerStep = 0;

        const makeStep = function (): void {

            if (_this.timerPaused) {
                return;
            }

            for (let i = 0; i < _this.stepsHandlers.length; i++) {
                _this.stepsHandlers[i](_this.timerStep);
            }

            _this.timerStep++;

            callback();

            if (_this.timerStep > Config.STEPS_LIMIT) {

                if (Config.LOGS) {
                    logTimeEvent('Steps running has been ended. Avg. time per step: ' + Math.round((Date.now() - timerStart) / Config.STEPS_LIMIT) + 'ms');
                }

                clearInterval(timerInterval);
                return;
            }

            if (!boosted && _this.timerStep > Config.STEPS_BOOST_STEPS) {
                clearInterval(timerInterval);
                minStepInterval *= Config.STEPS_BOOST;
                timerInterval = setInterval(makeStep, minStepInterval);
                boosted = true;
            }
        }

        timerInterval = setInterval(makeStep, minStepInterval);

        makeStep();
    }

    isTimerPaused = function (): boolean {
        return this.timerPaused;
    }

    pauseTimer = function (): boolean {

        if (this.isTimerPaused()) {
            return false;
        }

        this.timerPaused = true;

        return true;
    }

    unpauseTimer = function (): boolean {

        if (!this.isTimerPaused()) {
            return false;
        }

        this.timerPaused = false;

        return true;
    }
}