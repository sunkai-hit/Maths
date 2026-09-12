import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const files=['data.js','chapter1a.js','chapter1b.js','chapter1c.js','chapter1d.js','chapter2.js','chapter3.js','chapter4.js','chapter5.js','chapter6.js','reviews.js','diagrams.js'];
const context=vm.createContext({});
for(const f of files)vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),context,{filename:f});
const {topics,curriculum}=vm.runInContext('({topics,curriculum})',context);
const ids=new Set();let questionCount=0;
for(const t of topics){assert(!ids.has(t.id));ids.add(t.id);assert(t.rule&&t.method&&t.pitfall);assert.equal(t.questions.length,3);for(const [i,q] of [t.example,...t.questions].entries()){assert(q.text&&q.answer&&q.steps.length>0,t.id);assert(q.steps.every(s=>typeof s==='string'&&s.length>0));if(q.type==='选择题'){assert.equal(q.options.length,4,t.id);assert(/^[ABCD]$/.test(q.answer),t.id);assert.equal(new Set(q.options).size,4,t.id);}if(i){assert(!ids.has(q.id));ids.add(q.id);assert.equal(q.difficulty,['基础题','提高题','压轴题'][i-1]);questionCount++;}if(q.diagram){for(const [a,b] of q.diagram.lines||[])assert(q.diagram.points[a]&&q.diagram.points[b],t.id);}}}
for(const [i,c] of curriculum.entries())for(let j=0;j<=c.sections.length;j++)assert(topics.some(t=>t.section===`${i+1}.${j}`),`Missing ${i+1}.${j}`);
assert.equal(topics.find(t=>t.name==='三边关系与第三边范围').questions[2].answer,'8');
assert.equal(topics.find(t=>t.name==='勾股定理中的分类与分割').questions[2].answer,'BD=5，AD=12，面积 84');assert.equal(5**2+12**2,13**2);assert.equal(9**2+12**2,15**2);
for(let x=1;x<=100;x++){const a=.4*x,b=12+.2*Math.max(0,x-20);assert(x<40?a<b:x===40?Math.abs(a-b)<1e-9:a>b);}
const html=fs.readFileSync('dist/index.html','utf8');for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!match[1].startsWith('data:'))assert(fs.existsSync('dist/'+match[1]),match[1]);}
console.log(JSON.stringify({chapters:curriculum.length,textbookSections:curriculum.reduce((n,c)=>n+c.sections.length,0),topics:topics.length,examples:topics.length,practice:questionCount,types:[...new Set(topics.flatMap(t=>t.questions.map(q=>q.type)))],structuralValidation:'passed',numericSpotChecks:'passed'},null,2));
