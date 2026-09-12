import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const files=[
  'data.js',
  'chapter1-figures.js','chapter1-figures-1.js','chapter1-figures-2.js','chapter1-figures-3.js','chapter1-figures-4.js','chapter1-figures-5.js','chapter1-figures-6.js','chapter1-figures-7.js',
  'chapter1-bank-1.js','chapter1-bank-2.js','chapter1-bank-3.js','chapter1-bank-4.js','chapter1-bank-5.js','chapter1-bank-6.js',
  'chapter2.js','chapter3.js','chapter4.js','chapter5.js','chapter6.js','reviews.js','diagrams.js','pdf-export.js'
];
const context=vm.createContext({TextEncoder,atob,encodeURIComponent});
for(const file of files)vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
const {PaperPDF,topics}=vm.runInContext('({PaperPDF,topics})',context);
const questions=topics.flatMap(t=>t.questions);
const measure=(text,size)=>Array.from(text).reduce((n,c)=>n+size*(c.charCodeAt(0)<128?.6:1),0);
function checkBounds(pages){
  assert(pages.length>0);
  for(const page of pages){
    assert(page.length>0,'No empty pages');
    let bottom=0;
    for(const item of page){
      assert(item.y>=43&&item.y+item.height<=793.89+1e-6,'Content stays inside printable A4 area');
      assert(item.y>=bottom-1e-6,'Content does not overlap');
      bottom=item.y+item.height;
      if(item.kind==='text')assert(measure(item.text,item.size)<=509.28+1e-6,'Text wraps inside margins');
    }
  }
}
let cases=0;
for(const answer of [false,true])for(const examples of [false,true])for(const space of ['compact','normal','large']){
  const pages=PaperPDF.layout({title:'全册数学练习卷',answer,examples,space,questions,lessons:topics},measure);
  checkBounds(pages);
  const items=pages.flat(),text=items.filter(i=>i.kind==='text').map(i=>i.text);
  questions.forEach((q,i)=>assert.equal(text.filter(t=>t.startsWith((i+1)+'.  ')).length,1,`Question ${i+1} appears once`));
  assert.equal(text.filter(t=>t.startsWith('答案：')).length,(answer?questions.length:0)+(examples?topics.length:0),'Student and answer outputs remain separate');
  const expectedVisuals=questions.filter(q=>q.figure||q.diagram).length+(examples?topics.filter(t=>t.example.figure||t.example.diagram).length:0);
  assert.equal(items.filter(i=>i.kind==='diagram'||i.kind==='figure').length,expectedVisuals,'Figures and diagrams are retained');
  cases++;
}
const longQuestion={text:'很长的题目 √2 x² ∠ABC：'.repeat(100),type:'解答题',answer:'测试答案',steps:['完整解题步骤。'.repeat(100)],options:[]};
checkBounds(PaperPDF.layout({title:'长标题'.repeat(26),answer:true,examples:false,questions:[longQuestion],lessons:[]},measure));
assert.throws(()=>PaperPDF.buildPDF([]));
const data='data:image/jpeg;base64,'+Buffer.from([255,216,0,128,255,217]).toString('base64');
const bytes=Buffer.from(PaperPDF.buildPDF([{data,width:2,height:2},{data,width:2,height:2}]));
const source=bytes.toString('latin1'),xref=Number(source.match(/startxref\n(\d+)/)[1]);
assert.equal(source.slice(xref,xref+4),'xref');
const entries=source.slice(xref).split('\n');
assert.equal(entries[1],'0 9');
for(let i=1;i<9;i++)assert(source.slice(Number(entries[i+2].slice(0,10))).startsWith(i+' 0 obj\n'));
assert(source.includes('/Count 2'));
for(const match of source.matchAll(/\/Length (\d+) >>\nstream\n/g)){
  const end=match.index+match[0].length+Number(match[1]);
  assert(/^\n?endstream/.test(source.slice(end)),'Stream byte length is exact');
}
console.log(JSON.stringify({pdfLayoutCases:cases+1,selectableQuestions:questions.length,bounds:'passed',answers:'passed',figures:'passed',pdfByteOffsets:'passed'}));
