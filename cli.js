
const { Command } = require('commander');

const path = require('path');
const { globSync } = require('glob');

let program = new Command();

const { name, description = 'Default description', version } = require('./package.json');


const fallbackPatterns = ['**/*.[oO]utline.yaml', '__outlines__/**/*.yaml'];
program
    .name(name)
    .description(description)
    .version(version)

program
    .command('build', { isDefault: true })
    .alias('b')
    .description('build doc files and sidebars file')
    .argument('[patterns...]', 'Glob patterns to match files', [])
    .option('-d, --docs <path>', 'path where markdown files are generated into', './docs')
    .option('-s, --sidebars <filepath>', 'path where sidebars file is generated into', './sidebars.js')
    .option('-t, --templates <path>', 'path to templates', path.join(__dirname, 'templates'))
    .option('--schema <path>', 'path to schema', path.join(__dirname, 'outline.schema.json'))
    .option('-v, --verbose', 'verbose output')
    .option('--fallback-patterns <patterns...>', 'Glob patterns to match fallback files', fallbackPatterns)

    .action((patterns, options) => {

        console.log("🚀 ~ .action ~ patterns:", patterns)
        const files = getFilesFromPatterns(patterns, options.fallbackPatterns);
        console.log("🚀 ~ .action ~ files:", files)
    });
        

program
    .configureHelp(
        {
            sortOptions: true,
            sortSubcommands: true,
            showGlobalOptions: true,
            helpWidth: 80,
            showDescription: true,

        }
    )

program.parse()



/**
 * Validates whether the provided glob pattern is a non-empty string.
 *
 * @param {string} globPattern - The glob pattern to validate.
 * @returns {boolean} Returns true if the glob pattern is a non-empty string, otherwise false.
 */
function isValidGlobPattern(globPattern) {
    return typeof globPattern === 'string' && globPattern.trim().length > 0;
}

/**
 * Retrieves files matching the specified primary and fallback glob patterns.
 *
 * This function attempts to match files using the provided primary patterns first.
 * If no files are matched with the primary patterns, it falls back to using the fallback patterns.
 *
 * @param {string|string[]} primaryPatterns - The primary glob pattern(s) to match files against.
 * @param {string|string[]} fallbackPatterns - The fallback glob pattern(s) to use if no files are matched with the primary patterns.
 * @returns {string[]} An array of file paths that match the provided patterns.
 * @throws Will throw an error if any of the patterns are invalid.
 */
function getFilesFromPatterns(primaryPatterns, fallbackPatterns) {
    const primaryGlobPatterns = Array.isArray(primaryPatterns)
        ? primaryPatterns
        : [primaryPatterns];
    const fallbackGlobPatterns = Array.isArray(fallbackPatterns)
        ? fallbackPatterns
        : [fallbackPatterns];

    if (
        !primaryGlobPatterns.every(isValidGlobPattern) ||
        !fallbackGlobPatterns.every(isValidGlobPattern)
    ) {
        throw new Error('Invalid glob pattern provided.');
    }

    const globOptions = { ignore: ['**/node_modules/**'] };

    const primaryFiles = globSync(primaryGlobPatterns, globOptions);

    if (primaryFiles.length > 0) {
        return primaryFiles;
    }

    const fallbackFiles = globSync(fallbackGlobPatterns, globOptions);

    return fallbackFiles;
}

