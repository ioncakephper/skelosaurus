const fs = require('fs')
const path = require('path')

let sourceFile = path.join('./website', 'docs', 'academy.md')
let source = fs.readFileSync(sourceFile, 'utf8')

let regex = /\<\!\-\- *@part +src *= *"([^"]*)" *\-\-\>(\r\n[a-zA-Z0-9\,\.\(\)\s\-\_\+\*\&\^\%\$\#\@\!\}\]\|\\\{\[\"\:\;\?\/\>\<]*)*\r\n\s*<\!\-\- *@\/part *\-\-\>/gi
// let matches = regex.test(source)
// console.log(matches)
let allMatches = regex.exec(source);
while (allMatches != null) {
    console.log(allMatches)
    let targetPath = allMatches[1];
    let partContent = allMatches[2];

    let relative = path.relative('./website/docs', './website');
    let completePath = path.join(relative, targetPath);
    console.log(completePath);
    allMatches = regex.exec(source)
}

console.log(source)

// \x0a?<\!\-\- *@\/part *\-\-\>