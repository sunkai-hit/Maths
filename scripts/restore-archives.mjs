import fs from 'node:fs';
import crypto from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync('docs/upload-manifest.json','utf8'));
for(const entry of manifest.binaryArchives){const bytes=Buffer.from(fs.readFileSync(entry.encodedPath,'utf8').trim(),'base64');const actual=crypto.createHash('sha256').update(bytes).digest('hex');if(actual!==entry.originalSha256)throw Error('Archive checksum mismatch: '+entry.encodedPath);if(fs.existsSync(entry.originalPath)){const existing=fs.readFileSync(entry.originalPath);if(!existing.equals(bytes))throw Error('Refusing to overwrite a different existing file: '+entry.originalPath);}else{fs.writeFileSync(entry.originalPath,bytes);}console.log('Verified archive: '+entry.originalPath);}
