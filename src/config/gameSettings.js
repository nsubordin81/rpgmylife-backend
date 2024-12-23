export const gameConfig = {
    levelFormula: (level) => Math.round(300 * Math.pow(level - 1, 1.3) + 900)
};