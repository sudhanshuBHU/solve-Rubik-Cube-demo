
const cube = new Cube();

// Initial state
cube.display('Initial Cube');

// Scramble
// cube.scramble(10);
// cube.display('After Scramble');

// Solve (reverse scramble)
// cube.solve();
function reset (){
    cube.faces = {
        U: Array(9).fill('w'),
        D: Array(9).fill('y'),
        F: Array(9).fill('g'),
        B: Array(9).fill('b'),
        L: Array(9).fill('o'),
        R: Array(9).fill('r'),
    };
    cube.scrambleMoves = [];
    cube.displayLog("Cube Reset");
    cube.display("Initial Cube");
}

function scramble (){
    cube.scramble(10);
    cube.display("After Scramble");
    cube.displayLog("Cube Scrambled");
}

function solve (){
    cube.solve();
}

function clearScreen (){
    document.getElementById('output').innerHTML = '';
    document.getElementById('logs').innerHTML = '';
    cube.displayLog("Screen Cleared");
    reset();
}