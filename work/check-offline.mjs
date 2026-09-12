import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const text=fs.readFileSync('outputs/循题-七上数学家长组卷.html','utf8');
assert(!/<script\s+src=/.test(text));
assert(!/rel="stylesheet"/.test(text));
let n=0;
for(const match of text.matchAll(/<script>([\s\S]*?)<\/script>/g)){new vm.Script(match[1]);n++;}
assert.equal(n,24,'离线文件尚未同步完整第一章题库，请先运行 npm run build:offline');
assert(text.includes('@media print'));
assert(text.includes('window.print()'));
assert(text.includes('专题三·类型七：半角模型'),'离线版缺少第一章专题题库');
assert(text.includes('chapter1Figures'),'离线版缺少原材料题图');
assert(!text.includes('data-act="difficulty"'),'离线版仍包含难度筛选');
console.log(JSON.stringify({offlineScripts:n,syntax:'passed',externalDependencies:0,chapter1FullBank:'passed',difficultyFilter:'removed',bytes:Buffer.byteLength(text)}));
