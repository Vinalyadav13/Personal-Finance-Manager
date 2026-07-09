const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndReplace(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:5000')) {
        content = content.replace(/http:\/\/localhost:5000/g, '');
        fs.writeFileSync(fullPath, content);
        console.log('Replaced in ' + fullPath);
      }
    }
  }
}

findAndReplace(directory);
console.log('Done!');
