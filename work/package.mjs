import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),stage=path.resolve('work/site-package');
if(!stage.startsWith(root+path.sep))throw Error('Unsafe staging path');
fs.mkdirSync(stage,{recursive:true});
// Run the Sites packager's shared build validation and staging helper; Windows tar replaces its Bash wrapper.
execFileSync(process.execPath,['C:/Users/admin/.codex/.tmp/bundled-marketplaces/openai-bundled/plugins/sites/skills/sites-hosting/scripts/prepare-site-build.cjs',root,path.join(stage,'dist')],{stdio:'inherit'});
const archive=path.resolve('work/xunti-site.tar.gz');
execFileSync('C:/Windows/System32/tar.exe',['-C',stage,'-czf',archive,'dist']);
const entries=execFileSync('C:/Windows/System32/tar.exe',['-tzf',archive],{encoding:'utf8'});
for(const required of ['dist/index.html','dist/.openai/hosting.json','dist/app.js'])if(!entries.split(/\r?\n/).includes(required))throw Error('Archive missing '+required);
console.log(JSON.stringify({archive,bytes:fs.statSync(archive).size,validated:true}));
