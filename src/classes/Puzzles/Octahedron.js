// Definition of octahedron shaped puzzles
// Grid : surface of the regular octahedron
// Faces : 8 equilateral triangles
// Cycles : (4 * size) number of cycles consisting of 1 sub cycle for the slice & possibly others for attached face
class Octahedron extends Puzzle {
    constructor(size = 3, fullSpan = 200) {
        const alphaM = 2 * Math.PI / 3;
        const animationSteps = 10;
        const animationConfig = {
            steps: animationSteps,
            dAlpha: alphaM / animationSteps
        };
        const grid = {};
        const stickerMap = {};
        const faces = [];
        const cycles = [];
        const rootPoints = [
            new Point('', 0, 0, -fullSpan),
            new Point('', fullSpan, 0, 0),
            new Point('', 0, fullSpan, 0),
            new Point('', -fullSpan, 0, 0),
            new Point('', 0, -fullSpan, 0),
            new Point('', 0, 0, fullSpan)
        ];
        const faceConfig = [
            { 'points': [rootPoints[0], rootPoints[2], rootPoints[1]], 'color': 'white' },
            { 'points': [rootPoints[0], rootPoints[1], rootPoints[4]], 'color': 'blue' },
            { 'points': [rootPoints[0], rootPoints[4], rootPoints[3]], 'color': 'lawngreen' },
            { 'points': [rootPoints[0], rootPoints[3], rootPoints[2]], 'color': 'skyblue' },
            { 'points': [rootPoints[5], rootPoints[1], rootPoints[2]], 'color': 'red' },
            { 'points': [rootPoints[5], rootPoints[2], rootPoints[3]], 'color': 'darkorange' },
            { 'points': [rootPoints[5], rootPoints[3], rootPoints[4]], 'color': 'purple' },
            { 'points': [rootPoints[5], rootPoints[4], rootPoints[1]], 'color': 'yellow' }
        ];
        let cycleFamilyConfig = [{
            'slices': [
                { fIndex: 4, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: () => [0, -1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 7, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: (_row, col) => [col % 2 ? 0 : 1, col % 2 ? -1 : 1], limJ: row => 1 + 2 * row },
                { fIndex: 1, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, col % 2 ? -1 : 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 2, sIJ: row => [row, 0], dIJ: () => [0, 1], limJ: row => 1 + 2 * row },
                { fIndex: 3, sIJ: row => [row, 0], dIJ: (_row, col) => [col % 2 ? 0 : 1, 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 5, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, -1], limJ: row => 1 + 2 * row }
            ],
            'attachedFaces': [
                { fIndex: 0, steps: [() => [1, 0], () => [0, 2], () => [-1, -2]] },
                { fIndex: 6, steps: [() => [1, 2], () => [0, -2], () => [-1, 0]] }
            ],
            'unitVector': new Vector(new Point('', 0, 0, 0), new Point('', 1, 1, -1)).unit()
        }, {
            'slices': [
                { fIndex: 0, sIJ: row => [row, 0], dIJ: (_row, col) => [col % 2 ? 0 : 1, 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 4, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, -1], limJ: row => 1 + 2 * row },
                { fIndex: 7, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: () => [0, -1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 6, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: (_row, col) => [col % 2 ? 0 : 1, col % 2 ? -1 : 1], limJ: row => 1 + 2 * row },
                { fIndex: 2, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, col % 2 ? -1 : 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 3, sIJ: row => [row, 0], dIJ: () => [0, 1], limJ: row => 1 + 2 * row }
            ],
            'attachedFaces': [
                { fIndex: 1, steps: [() => [1, 0], () => [0, 2], () => [-1, -2]] },
                { fIndex: 5, steps: [() => [1, 2], () => [0, -2], () => [-1, 0]] }
            ],
            'unitVector': new Vector(new Point('', 0, 0, 0), new Point('', 1, -1, -1)).unit()
        }, {
            'slices': [
                { fIndex: 1, sIJ: row => [row, 0], dIJ: (_row, col) => [col % 2 ? 0 : 1, 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 7, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, -1], limJ: row => 1 + 2 * row },
                { fIndex: 6, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: () => [0, -1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 5, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: (_row, col) => [col % 2 ? 0 : 1, col % 2 ? -1 : 1], limJ: row => 1 + 2 * row },
                { fIndex: 3, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, col % 2 ? -1 : 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 0, sIJ: row => [row, 0], dIJ: () => [0, 1], limJ: row => 1 + 2 * row }
            ],
            'attachedFaces': [
                { fIndex: 2, steps: [() => [1, 0], () => [0, 2], () => [-1, -2]] },
                { fIndex: 4, steps: [() => [1, 2], () => [0, -2], () => [-1, 0]] }
            ],
            'unitVector': new Vector(new Point('', 0, 0, 0), new Point('', -1, -1, -1)).unit()
        }, {
            'slices': [
                { fIndex: 2, sIJ: row => [row, 0], dIJ: (_row, col) => [col % 2 ? 0 : 1, 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 6, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, -1], limJ: row => 1 + 2 * row },
                { fIndex: 5, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: () => [0, -1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 4, sIJ: row => [size - row - 1, 2 * (size - row - 1)], dIJ: (_row, col) => [col % 2 ? 0 : 1, col % 2 ? -1 : 1], limJ: row => 1 + 2 * row },
                { fIndex: 0, sIJ: row => [size - 1, 2 * row], dIJ: (_row, col) => [col % 2 ? -1 : 0, col % 2 ? -1 : 1], limJ: row => 1 + 2 * (size - row - 1) },
                { fIndex: 1, sIJ: row => [row, 0], dIJ: () => [0, 1], limJ: row => 1 + 2 * row }
            ],
            'attachedFaces': [
                { fIndex: 3, steps: [() => [1, 0], () => [0, 2], () => [-1, -2]] },
                { fIndex: 7, steps: [() => [1, 2], () => [0, -2], () => [-1, 0]] }
            ],
            'unitVector': new Vector(new Point('', 0, 0, 0), new Point('', -1, 1, -1)).unit()
        }];


        faceConfig.forEach((config, f) => {
            let stickers = [];
            let preArr = [config.points[0].clone()], nxtArr, p, q, r, s;
            let vI = new Vector(config.points[0], config.points[1]).multiply(1 / size);
            let vJ = new Vector(config.points[1], config.points[2]).multiply(1 / size);
            let vC;
            for (let i = 0; i < size; i++) {
                nxtArr = [];
                vC = vI.add(preArr[0]);
                nxtArr.push(new Point('', vC.x, vC.y, vC.z));
                for (let j = 0; j <= i; j++) {
                    vC = vJ.add(vC);
                    nxtArr.push(new Point('', vC.x, vC.y, vC.z));
                }
                preArr.forEach((point, j) => {
                    p = point.clone();
                    q = nxtArr[j].clone();
                    r = nxtArr[j + 1].clone();
                    p.id = `p-${f}-${i}-${j}`;
                    while (grid[p.id]) p.id += '-n';
                    q.id = `p-${f}-${i + 1}-${j}`;
                    while (grid[q.id]) q.id += '-n';
                    r.id = `p-${f}-${i + 1}-${j + 1}`;
                    while (grid[r.id]) r.id += '-n';
                    grid[p.id] = p.clone();
                    grid[q.id] = q.clone();
                    grid[r.id] = r.clone();
                    stickers.push(new Sticker(`s-${f}-${i}-${2 * j}`, config.color, [p, q, r]));
                    stickerMap[stickers[stickers.length - 1].id] = stickers[stickers.length - 1];
                    if (j < preArr.length - 1) {
                        p = p.clone();
                        while (grid[p.id]) p.id += '-n';
                        r = r.clone();
                        while (grid[r.id]) r.id += '-n';
                        s = preArr[j + 1].clone();
                        s.id = `q-${f}-${i}-${j + 1}`;
                        while (grid[s.id]) s.id += '-n';
                        grid[p.id] = p.clone();
                        grid[r.id] = r.clone();
                        grid[s.id] = s.clone();
                        stickers.push(new Sticker(`s-${f}-${i}-${2 * j + 1}`, config.color, [p, r, s]));
                        stickerMap[stickers[stickers.length - 1].id] = stickers[stickers.length - 1];
                    }
                });
                preArr = nxtArr;
            }
            faces.push(new Face(stickers));
        });
        let cycle, aFace, stickerCollection, sI, sJ, dI, dJ, lJ;
        cycleFamilyConfig.forEach(config => {
            for (let c = 0; c < size; c++) {
                cycle = new Cycle([], 3, config.unitVector, animationConfig);
                stickerCollection = [];
                config.slices.forEach((slice) => {
                    [sI, sJ] = slice.sIJ(c);
                    lJ = slice.limJ(c);
                    for (let s = 0; s < lJ; s++) {
                        [dI, dJ] = slice.dIJ(c, s);
                        stickerCollection.push(stickerMap[`s-${slice.fIndex}-${sI}-${sJ}`]);
                        sI += dI;
                        sJ += dJ;
                    }
                });
                cycle.stickerCollections.push(stickerCollection);
                cycles.push(cycle);
                cycle.update();
            }
            config.attachedFaces.forEach((faceCycleConfig, fci) => {
                cycle = fci ? cycles[cycles.length - 1] : cycles[cycles.length - size];
                aFace = faceCycleConfig.fIndex;
                let l = size - 1;
                let d = 1;
                let s = 0, t, i, j;
                while (l > 0) {
                    i = j = s;
                    stickerCollection = [];
                    faceCycleConfig.steps.forEach(stepConfigGetter => {
                        t = 0;
                        for (let x = 0; x < l; x++) {
                            let [stepI, stepJ] = stepConfigGetter(s, t);
                            stickerCollection.push(stickerMap[`s-${aFace}-${i}-${j}`]);
                            i += stepI;
                            j += stepJ;
                            t += 1;
                        }
                    });
                    cycle.stickerCollections.push(stickerCollection);
                    s += 1;
                    l -= d;
                    d = d === 2 ? 1 : 2;
                }
                if (stickerMap[`s-${aFace}-${s}-${s}`]) {
                    cycle.stickerCollections.push([stickerMap[`s-${aFace}-${s}-${s}`]]);
                }
                cycle.update();
            })
        });
        super(grid, faces, cycles, { theta: - Math.PI / 3, phi: 0 });
    }
}

