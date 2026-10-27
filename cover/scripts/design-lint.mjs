// The design Never list as a check (see the Design rules section of ../README.md). Scans src for the patterns
// that make a UI read as generated. Exit 1 on any hit.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(process.cwd(), 'src');

const RULES = {
  radius:
    /\brounded(?:-(?:[trbl]|tl|tr|bl|br|s|e|ss|se|es|ee))?(?:-(?:xs|sm|md|lg|xl|2xl|3xl|4xl))?(?=[\s'"`}])|\brounded(?:-(?:[trbl]|tl|tr|bl|br|s|e|ss|se|es|ee))?-\[(?!(?:0|0px|1px|2px)(?:_(?:0|0px|1px|2px))*\])[^\]]*\]/,
  'hover-motion':
    /\btransition(?:-(?:colors|all|shadow|opacity|transform))?(?=[\s'"`}])|\bhover:(?:-?translate|scale|rotate)|\bgroup-hover:(?:-?translate|scale)|\bduration-\d+|\banimate-(?:pulse|spin|ping|bounce)\b/,
  'soft-shadow':
    /\bshadow-(?:2xs|xs|sm|md|lg|xl|2xl)\b|\bdrop-shadow|shadow-\[(?:[^\]]*?,)?(?:inset_)?(?:-?\d+px|0)_(?:-?\d+px|0)_[1-9]\d*px/,
  glass: /\bbackdrop-blur/,
  gradient: /\bbg-(?:gradient-to-|linear-|radial-|conic-)|linear-gradient\(/,
  'left-stripe': /\bborder-l-(?:2|4|8|\[)/,
  emoji: new RegExp('[' + String.fromCharCode(0xd83c) + '-' + String.fromCharCode(0xd83e) + '][' + String.fromCharCode(0xdc00) + '-' + String.fromCharCode(0xdfff) + ']|[' + String.fromCharCode(0x2600) + '-' + String.fromCharCode(0x27bf) + ']'),
  // Em dashes anywhere; en dashes only between digits (time and date ranges).
  dash: new RegExp(String.fromCharCode(0x2014) + '|(?<!\\d)' + String.fromCharCode(0x2013) + '|' + String.fromCharCode(0x2013) + '(?!\\d)'),
};

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(abs);
    if (!/\.(tsx?|css)$/.test(entry.name) || /\.test\./.test(entry.name)) return [];
    return [abs];
  });
}

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

let hits = 0;
for (const file of listFiles(SRC)) {
  const lines = stripComments(fs.readFileSync(file, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    for (const [rule, re] of Object.entries(RULES)) {
      if (re.test(line)) {
        hits += 1;
        console.log(`${path.relative(process.cwd(), file)}:${i + 1} ${rule}: ${line.trim().slice(0, 100)}`);
      }
    }
  });
}
if (hits) {
  console.error(`\ndesign-lint: ${hits} violation${hits === 1 ? '' : 's'}`);
  process.exit(1);
}
console.log('design-lint: clean');
