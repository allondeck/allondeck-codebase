const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) walk(dirPath, callback);
    else callback(dirPath);
  });
}

walk('./src', (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We target standard layout wrappers
  // Replace: max-w-[size] px-X sm:px-Y lg:px-Z
  // With: max-w-[1400px] px-6 lg:px-12
  // We keep max-w-sm, max-w-md, max-w-lg, max-w-xs untouched as they are usually for small cards/forms.
  
  content = content.replace(/max-w-(7xl|6xl|5xl|4xl|3xl|2xl|xl) px-[0-9]+( sm:px-[0-9]+)?( lg:px-[0-9]+)?/g, 'max-w-[1400px] px-6 lg:px-12');
  
  // also catch cases where px is before max-w or missing, actually the most common is `max-w-7xl px-4 sm:px-6 lg:px-8`
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);
  }
});
