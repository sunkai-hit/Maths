import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const text=fs.readFileSync('outputs/循题-七上数学家长组卷.html','utf8');
assert(!/<script\s+src=/.test(text));assert(!/rel="stylesheet"/.test(text));
let n=0;for(const match of text.matchAll(/<script>([\s\S]*?)<\/script>/g)){new vm.Script(match[1]);n++;}
assert.equal(n,9);assert(text.includes('@media print'));assert(text.includes('window.print()'));
console.log(JSON.stringify({offlineScripts:n,syntax:'passed',externalDependencies:0,bytes:Buffer.byteLength(text)}));
