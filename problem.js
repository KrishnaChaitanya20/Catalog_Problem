const { log } = require('console');
const fs = require('fs');

function parseRoots(roots) {
    const decimalRoots = {};
    for (const key in roots) {
        const base = parseInt(roots[key].base, 10);
        const value = parseInt(roots[key].value, base);
        decimalRoots[parseInt(key, 10)] = value;
    }
    // log(decimalRoots);
    return decimalRoots;
}

function lagrangeInterpolationConstantTerm(roots, k) {
    const xVals = Object.keys(roots).map(Number).slice(0, k);
    const yVals = Object.values(roots).slice(0, k);

    let constantTerm = 0;
    for (let i = 0; i < k; i++) {
        let term = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= -xVals[j] / (xVals[i] - xVals[j]);
            }
        }
        constantTerm += term * yVals[i];
    }
    return Math.round(constantTerm * 100) / 100;
}

function findConstantTerm(inputData) {
    const n = inputData.keys.n;
    const k = inputData.keys.k;

    const roots = parseRoots(
        Object.fromEntries(
            Object.entries(inputData).filter(([key]) => !isNaN(key))
        )
    );

    return lagrangeInterpolationConstantTerm(roots, k);
}

function solve(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file`);
            return;
        }
        try {
            const inputData = JSON.parse(data);
            const result = findConstantTerm(inputData);
            console.log(`Constant Term for ${filePath}:`, result);
        } catch (err) {
            console.error(`Error parsing JSON`);
        }
    });
}

solve("test1.json");
solve("test2.json");