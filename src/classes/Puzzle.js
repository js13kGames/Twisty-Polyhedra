// Puzzle class abstracts out features common to every twisty polyhedra
// 1) It has a grid which represents static structure of the shape & is in format {...pointId: pointObject...}
// 2) It has faces, which are just collections of stickers
// 3) It has cycles, which represent the twistable slices
class Puzzle {
    constructor(grid, faces, cycles, angles) {
        this.grid = grid;
        this.faces = faces;
        this.cycles = cycles;
        this.baseAngles = this.angles = angles || { 'theta': - Math.PI / 4, 'phi': Math.PI / 8 };

        this.twisting = this.rotating = false;
        this.startEvtCoordinates = {};
        this.twistCounter = 0;
        this.animationState = {
            active: false,
            counter: 0,
            direction: undefined,
            cycle: undefined
        };

        // While animating the cycle twists, convex face structures are temporarily broken, so we operate directly on stickers
        this.stickers = [].concat(...this.faces.map(face => face.stickers));

        this.startTime = undefined;
        this.movesMade = 0;

        this.cycleMap = {};
        this.processCycleMap();
        this.startSticker = undefined;
    }

    isSolved() {
        for (let f = 0; f < this.faces.length; f++)
            for (let s = 0; s < this.faces[f].stickers.length; s++)
                if (this.faces[f].stickers[s].color !== this.faces[f].stickers[0].color) return false;
        return true;
    }

    // For fast lookups of cycles passing through some sticker
    processCycleMap() {
        this.cycles.forEach(cycle => cycle.stickerCollections[0].forEach(sticker => {
            this.cycleMap[sticker.id] = this.cycleMap[sticker.id] || [];
            this.cycleMap[sticker.id].push(cycle);
        })
        );
    }

    // Update works in two modes
    // 1) When a slice twist is animated, covered stickers are rotated around cycle axis & then sorted by depth (slow)
    // 2) When the puzzle is not changing, face orientations are updated & sorted by normal vector values (fast)
    update() {
        if (this.animationState.active && this.animationState.counter < this.animationState.cycle.animationConfig.steps) {
            let alpha = this.animationState.direction * this.animationState.counter * this.animationState.cycle.animationConfig.dAlpha;
            this.stickers.forEach(sticker => {
                sticker.update(
                    this.grid, this.angles.theta, this.angles.phi,
                    ...(this.animationState.cycle.stickerCover[sticker.id] ? [this.animationState.cycle.unitVector, alpha] : []))
            });
            this.stickers.sort((s1, s2) => s2.attractor.z - s1.attractor.z);
            this.animationState.counter++;
        } else {
            if (this.animationState.active) {
                this.animationState.cycle.twist(this.animationState.direction);
                if (this.startTime && this.isSolved()) {
                    this.onFinish && this.onFinish((new Date().getTime() - this.startTime) / 1000);
                    this.startTime = undefined;
                    this.movesMade = 0;
                } else if (this.startTime) {
                    this.movesMade++;
                }
                if (this.animationState.callback) {
                    this.animationState.callback();
                    if (this.animationState.counter < this.animationState.cycle.animationConfig.steps) {
                        return this.update();
                    }
                }
                this.animationState = {
                    active: false,
                    counter: 0,
                    direction: undefined,
                    cycle: undefined
                };
            }
            this.faces.forEach(face => face.update(this.grid, this.angles.theta, this.angles.phi));
            this.faces.sort((f1, f2) => f2.normalVector.z - f1.normalVector.z);
        }
    }

    // Finds reference to the sticker which is on top & coveres coordinates (x, y)
    findTouchedSticker(x, y) {
        let sticker;
        for (let f = this.faces.length - 1; f >= 0; f--) {
            if (this.faces[f].normalVector.z >= 0) {
                return;
            }
            sticker = this.faces[f].stickers.find(sticker => sticker.contains({ x, y, z: 0 }));
            if (sticker) {
                return sticker;
            }
        }
    }

    // Grabs the puzzle for re-orienting / twisting
    grab(x, y, type) {
        this.startEvtCoordinates.x = x;
        this.startEvtCoordinates.y = y;
        if (type == 2) {
            this.rotating = true;
            this.baseAngles = { ...this.angles };
        } else {
            this.startSticker = this.findTouchedSticker(x, y);
            this.twisting = !!this.startSticker;
        }
    }

    // Re-orients / applies the twist
    drag(x, y) {
        if (this.animationState.active) return;
        if (this.rotating) {
            this.angles.theta = this.baseAngles.theta + (x - this.startEvtCoordinates.x) / 100;
            this.angles.phi = this.baseAngles.phi + (y - this.startEvtCoordinates.y) / 100;
        } else if (this.twisting) {
            if (this.twistCounter < 9) {
                this.twistCounter++;
            } else {
                this.detectCycle(x, y);
            }
        }
    }

    // To detect the cycle to twist, we orient all attached cycle vectors to the state of the puzzle.
    // Then we create a vector for mouse movement.
    // The cycle we want to twist passes through the clicked sticker & gives the maximum cross product with cursor vector
    detectCycle(x, y) {
        let v = new Vector(
            new Point('', this.startEvtCoordinates.x, this.startEvtCoordinates.y, 0),
            new Point('', x, y, 0)
        );
        let mxMg = 0, mxCycle, mxDirection;
        this.cycleMap[this.startSticker.id].forEach(cycle => {
            let unitPoint = new Point('', cycle.unitVector.x, cycle.unitVector.y, cycle.unitVector.z);
            unitPoint.update(unitPoint, this.angles.theta, this.angles.phi);
            unitPoint.z = 0;
            let vC = new Vector({ x: 0, y: 0, z: 0 }, unitPoint).unit();
            let product = v.cross(vC);
            if (mxMg < product.magnitude()) {
                mxMg = product.magnitude();
                mxCycle = cycle;
                mxDirection = product.z > 0 ? -1 : 1;
            }
        })
        this.animationState = {
            active: true,
            counter: 0,
            direction: mxDirection,
            cycle: mxCycle
        };
        this.release();
    }

    // release the puzzle
    release() {
        this.twisting = this.rotating = false;
        this.startEvtCoordinates = {};
        this.twistCounter = 0;
        this.startSticker = undefined;
    }

    // Apply random twists
    scramble() {
        const count = this.cycles.length * 3;
        const twists = [];
        for (let c = 0; c < count; c++)
            twists.push({ cycle: this.cycles[Math.floor(Math.random() * this.cycles.length)], direction: Math.random() < 0.5 ? -1 : 1 });
        const animationConfigs = [];
        twists.forEach(({ cycle, direction }, index) => {
            animationConfigs.push({
                active: true, counter: 0, direction, cycle,
                callback: index < count - 1 ? () => this.animationState = animationConfigs[index + 1] : () => this.startTime = new Date().getTime()
            })
        });
        this.animationState = animationConfigs[0];
    }

    // If animating, use depth sorted stickers to render
    // If not animating, use sorted faces to render
    render(ctx, inverted, exploded = true) {
        if (!this.animationState.active) {
            let [start, end, step] = !inverted ? [0, this.faces.length, 1] : [this.faces.length - 1, -1, -1];
            for (var i = start; i !== end; i += step) this.faces[i].render(ctx, inverted, exploded);
        } else {
            let [start, end, step] = !inverted ? [0, this.stickers.length, 1] : [this.stickers.length - 1, -1, -1];
            for (var i = start; i !== end; i += step) this.stickers[i].render(ctx, inverted, exploded);
        }
    }
}

