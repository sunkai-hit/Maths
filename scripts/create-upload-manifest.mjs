import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const hash=(algorithm,data)=>crypto.createHash(algorithm).update(data).digest('hex');
const originalPath='work/xunti-site.tar.gz',encodedPath=originalPath+'.base64';
let original=fs.existsSync(originalPath)?fs.readFileSync(originalPath):Buffer.from(fs.readFileSync(encodedPath,'utf8').trim(),'base64');
fs.writeFileSync(encodedPath,original.toString('base64')+'\n');
const paths=['README.md','package.json','.gitignore','.openai/hosting.json'];
function walk(directory){for(const item of fs.readdirSync(directory,{withFileTypes:true})){const relative=directory+'/'+item.name;if(relative==='work/github-upload'||relative==='docs/upload-manifest.json'||relative===originalPath)continue;if(item.isDirectory())walk(relative);else if(item.isFile())paths.push(relative);}}
for(const dir of ['dist','outputs','docs','scripts','data','database','work'])walk(dir);
const files=paths.sort().map(relative=>{const bytes=fs.readFileSync(relative);const text=bytes.toString('utf8');if(!Buffer.from(text,'utf8').equals(bytes))throw Error('Non-UTF8 file requires encoding: '+relative);if(/\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,}|sk-proj-[A-Za-z0-9_-]{30,})\b/.test(text))throw Error('Potential credential found in '+relative);return {path:relative,bytes:bytes.length,sha256:hash('sha256',bytes),gitBlobSha1:hash('sha1',Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes]))};});
const manifest={schemaVersion:1,repository:'sunkai-hit/Maths',branch:'main',scope:'Application source, offline deliverables, development documents and scripts, complete question-bank data and SQL export, original staging snapshot and encoded binary archive.',exclusions:['Local .git metadata (no successful source commits existed)','Temporary upload transport files in work/github-upload','Account credentials and browser-local worksheet drafts','Original user-supplied reference images outside the workspace (inputs, not generated deliverables)'],files,binaryArchives:[{originalPath,encodedPath,originalBytes:original.length,originalSha256:hash('sha256',original)}]};
fs.writeFileSync('docs/upload-manifest.json',JSON.stringify(manifest,null,2)+'\n');
fs.mkdirSync('work/github-upload',{recursive:true});fs.writeFileSync('work/github-upload/paths.json',JSON.stringify([...files.map(f=>f.path),'docs/upload-manifest.json']));
console.log(JSON.stringify({files:files.length+1,bytes:files.reduce((n,f)=>n+f.bytes,0),largest:files.toSorted((a,b)=>b.bytes-a.bytes).slice(0,3)}));
