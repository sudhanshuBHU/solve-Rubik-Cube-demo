
class Cube {
    constructor() {
        this.faces = {
            U: Array(9).fill('w'),
            D: Array(9).fill('y'),
            F: Array(9).fill('g'),
            B: Array(9).fill('b'),
            L: Array(9).fill('o'),
            R: Array(9).fill('r'),
        };
        this.scrambleMoves = [];
        this.edgeMap = {
            F: [['U', [6, 7, 8]], ['R', [0, 3, 6]], ['D', [2, 1, 0]], ['L', [8, 5, 2]]],
            B: [['U', [2, 1, 0]], ['L', [0, 3, 6]], ['D', [6, 7, 8]], ['R', [8, 5, 2]]],
            U: [['B', [2, 1, 0]], ['R', [2, 1, 0]], ['F', [2, 1, 0]], ['L', [2, 1, 0]]],
            D: [['F', [6, 7, 8]], ['R', [6, 7, 8]], ['B', [6, 7, 8]], ['L', [6, 7, 8]]],
            L: [['U', [0, 3, 6]], ['F', [0, 3, 6]], ['D', [0, 3, 6]], ['B', [8, 5, 2]]],
            R: [['U', [8, 5, 2]], ['B', [0, 3, 6]], ['D', [8, 5, 2]], ['F', [8, 5, 2]]],
        };

        this.displayLog('Cube initialized with default colors.');
    }

    rotateFace(face, clockwise = true) {
        const f = this.faces[face];
        const copy = [...f];
        if (clockwise) {
            this.faces[face] = [
                copy[6], copy[3], copy[0],
                copy[7], copy[4], copy[1],
                copy[8], copy[5], copy[2],
            ];
        } else {
            this.faces[face] = [
                copy[2], copy[5], copy[8],
                copy[1], copy[4], copy[7],
                copy[0], copy[3], copy[6],
            ];
        }
    }

    rotate(face, direction = 'clockwise') {
        const clockwise = direction === 'clockwise';
        this.rotateFace(face, clockwise);

        const edges = this.edgeMap[face];
        const values = edges.map(([f, idxs]) => idxs.map(i => this.faces[f][i]));

        const shift = clockwise ? -1 : 1;
        const rotated = [...values.slice(shift), ...values.slice(0, shift)];

        for (let i = 0; i < 4; i++) {
            const [f, idxs] = edges[i];
            idxs.forEach((idx, j) => {
                this.faces[f][idx] = rotated[i][j];
            });
        }

        this.scrambleMoves.push({ face, direction });
    }

    scramble(moves = 5) {
        const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
        const dirs = ['clockwise', 'counterclockwise'];
        for (let i = 0; i < moves; i++) {
            const face = faces[Math.floor(Math.random() * 6)];
            const dir = dirs[Math.floor(Math.random() * 2)];
            this.rotate(face, dir);
        }
    }

    solve() {
        this.displayLog('Solving the cube...');
        for (let i = this.scrambleMoves.length - 1; i >= 0; i--) {
            const { face, direction } = this.scrambleMoves[i];
            const opposite = direction === 'clockwise' ? 'counterclockwise' : 'clockwise';
            this.rotate(face, opposite);
            this.display(`${face} ${direction}`);
        }
        this.displayLog('Cube solved!');
    }

    display(stepLabel = '') {
        const order = ['U', 'R', 'F', 'D', 'L', 'B'];
        const colorString = order.map(f => this.faces[f].join('')).join('');
        const svg = getCubeSvg(colorString);
        const div = document.createElement('div');
        div.innerHTML = `<b>${stepLabel}</b>${svg}<hr/>`;
        document.getElementById('output').appendChild(div);
    }

    displayLog(log) {
        const logDiv = document.getElementById('logs');
        let msg = logDiv.innerHTML;
        msg += `<hr/><b>${log}</b>`;
        logDiv.innerHTML = msg;
    }
}

function getCubeSvg(colors) {
    // Very simple color-to-box mapping
    const colorMap = {
        r: '🔴', g: '🟢', b: '🔵',
        w: '⬜', y: '🟡', o: '🟠'
    };

    const renderFace = (faceStr) =>
        faceStr.split('').map(c => colorMap[c] || '?').join('');

    let output = '';
    const faces = colors.match(/.{9}/g); // U, R, F, D, L, B
    // console.log(faces);  // array of strings
    
    const [U, R, F, D, L, B] = faces;

    // Display layout
    output += `<pre>
      ${renderFace(U.slice(0, 3))}
      ${renderFace(U.slice(3, 6))}
      ${renderFace(U.slice(6, 9))}

${renderFace(L.slice(0, 3))} ${renderFace(F.slice(0, 3))} ${renderFace(R.slice(0, 3))} ${renderFace(B.slice(0, 3))}
${renderFace(L.slice(3, 6))} ${renderFace(F.slice(3, 6))} ${renderFace(R.slice(3, 6))} ${renderFace(B.slice(3, 6))}
${renderFace(L.slice(6, 9))} ${renderFace(F.slice(6, 9))} ${renderFace(R.slice(6, 9))} ${renderFace(B.slice(6, 9))}

      ${renderFace(D.slice(0, 3))}
      ${renderFace(D.slice(3, 6))}
      ${renderFace(D.slice(6, 9))}
</pre>`;
    return output;
}
