
const { md2outline, markdownToYaml } = require('./lib/skelo-utils/markdown2outline');

// const markdownText = '* @path root\n\n## Heading 1\n\nThis is a paragraph.\n\nThis is a second  paragraph.\n\n* @note Sample\n\n* Item 1\n\n* Item 2\n\n';
// // const markdownText = '## Heading 1\n\nThis is a paragraph.\n\n* Item 1\n* Item 2\n\n## Heading 2\n\nThis is another paragraph.\n\n';

// const expectedOutline = md2outline(markdownText);
// console.log("🚀 ~ expectedOutline:", JSON.stringify(expectedOutline, null, 2));

// markdownToYaml()
markdownToYaml('test');

// const sourceFilename = 'test.md';
// const expectedTargetFilename = 'test.yaml';
// markdownToYaml(sourceFilename);
// markdownToYaml(null)
// markdownToYaml('')
// markdownToYaml('test.md', 'test.yaml');
