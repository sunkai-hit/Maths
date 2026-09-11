import fs from 'node:fs';
let html=fs.readFileSync('dist/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync('dist/style.css','utf8')+'</style>');
html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,f)=>'<script>\n'+fs.readFileSync('dist/'+f,'utf8').replace(/<\/script/gi,'<\\/script')+'\n</script>');
fs.mkdirSync('outputs',{recursive:true});fs.writeFileSync('outputs/循题-七上数学家长组卷.html',html);
console.log('Offline application exported.');
