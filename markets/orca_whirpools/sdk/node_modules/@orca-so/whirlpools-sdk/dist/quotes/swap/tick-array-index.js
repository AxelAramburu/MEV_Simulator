"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickArrayIndex = void 0;
const public_1 = require("../../types/public");
class TickArrayIndex {
    static fromTickIndex(index, tickSpacing) {
        const arrayIndex = Math.floor(Math.floor(index / tickSpacing) / public_1.TICK_ARRAY_SIZE);
        let offsetIndex = Math.floor((index % (tickSpacing * public_1.TICK_ARRAY_SIZE)) / tickSpacing);
        if (offsetIndex < 0) {
            offsetIndex = public_1.TICK_ARRAY_SIZE + offsetIndex;
        }
        return new TickArrayIndex(arrayIndex, offsetIndex, tickSpacing);
    }
    constructor(arrayIndex, offsetIndex, tickSpacing) {
        this.arrayIndex = arrayIndex;
        this.offsetIndex = offsetIndex;
        this.tickSpacing = tickSpacing;
        if (offsetIndex >= public_1.TICK_ARRAY_SIZE) {
            throw new Error("Invalid offsetIndex - value has to be smaller than TICK_ARRAY_SIZE");
        }
        if (offsetIndex < 0) {
            throw new Error("Invalid offsetIndex - value is smaller than 0");
        }
        if (tickSpacing < 0) {
            throw new Error("Invalid tickSpacing - value is less than 0");
        }
    }
    toTickIndex() {
        return (this.arrayIndex * public_1.TICK_ARRAY_SIZE * this.tickSpacing + this.offsetIndex * this.tickSpacing);
    }
    toNextInitializableTickIndex() {
        return TickArrayIndex.fromTickIndex(this.toTickIndex() + this.tickSpacing, this.tickSpacing);
    }
    toPrevInitializableTickIndex() {
        return TickArrayIndex.fromTickIndex(this.toTickIndex() - this.tickSpacing, this.tickSpacing);
    }
}
exports.TickArrayIndex = TickArrayIndex;
