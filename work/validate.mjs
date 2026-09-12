import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const figureFiles=['chapter1-figures-1.js','chapter1-figures-2.js','chapter1-figures-3.js','chapter1-figures-4.js','chapter1-figures-5.js','chapter1-figures-6.js','chapter1-figures-7.js'];
const files=[
  'data.js','chapter1-figures.js',...figureFiles,
  'chapter1-bank-1.js','chapter1-bank-2.js','chapter1-bank-3.js','chapter1-bank-4.js','chapter1-bank-5.js','chapter1-bank-6.js',
  'chapter2.js','chapter3.js','chapter4.js','chapter5.js','chapter6.js','reviews.js','diagrams.js'
];

/* 先在源码层检查题图键，防止后加载分片静默覆盖前面的正确图片。 */
let figureKeyCount=0;
const figureKeys=new Set();
for(const f of figureFiles){
  const source=fs.readFileSync('dist/'+f,'utf8');
  assert(source.includes('由原 PDF 页面渲染后按题目区域精确裁切'),`${f} 不是页面渲染裁图版本`);
  for(const m of source.matchAll(/"([^"]+)":"data:image\/png;base64,/g)){
    figureKeyCount++;
    assert(!figureKeys.has(m[1]),`Duplicate chapter1 figure key ${m[1]}`);
    figureKeys.add(m[1]);
  }
}
assert.equal(figureKeyCount,75,'第一章页面裁图源码应恰好包含 75 个题图键');
assert.equal(figureKeys.size,75,'第一章页面裁图题图键应全部唯一');

const context=vm.createContext({encodeURIComponent});
for(const f of files)vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),context,{filename:f});
const {topics,curriculum,chapter1FigureVersion}=vm.runInContext('({topics,curriculum,chapter1FigureVersion})',context);
assert.equal(chapter1FigureVersion,'page-render-crops-v2','第一章题图必须使用最终页面渲染裁图版本');

const topicIds=new Set(),questionIds=new Set(),exampleIds=new Set();
let questionCount=0;
for(const t of topics){
  assert(!topicIds.has(t.id),`Duplicate topic ${t.id}`);topicIds.add(t.id);
  assert(t.rule&&t.method&&t.pitfall,t.id);
  assert(t.example&&t.example.text&&t.example.answer&&Array.isArray(t.example.steps)&&t.example.steps.length>0,`${t.id} example`);
  assert(t.questions.length>=1,`${t.id} has no selectable questions`);
  assert(!exampleIds.has(t.example.id),`Duplicate example ${t.example.id}`);exampleIds.add(t.example.id);
  for(const q of [t.example,...t.questions]){
    assert(q.text&&q.answer&&Array.isArray(q.steps)&&q.steps.length>0,q.id||t.id);
    assert(q.steps.every(s=>typeof s==='string'&&s.length>0),q.id||t.id);
    assert(!Object.hasOwn(q,'difficulty'),`${q.id||t.id} still has difficulty`);
    if(q.type==='选择题'){
      assert.equal(q.options.length,4,q.id||t.id);
      assert(/^[ABCD]$/.test(q.answer),q.id||t.id);
      assert.equal(new Set(q.options).size,4,q.id||t.id);
    }
    if(q.diagram)for(const [a,b] of q.diagram.lines||[])assert(q.diagram.points[a]&&q.diagram.points[b],q.id||t.id);
    if(q.figureId){
      assert(q.figure,`${q.id||t.id} missing figure ${q.figureId}`);
      assert(q.figure.src.startsWith('data:image/png;base64,'),`${q.id||t.id} must use rendered PNG crop`);
      assert(figureKeys.has(q.figureId),`${q.id||t.id} figure ${q.figureId} is not in the audited crop set`);
    }
  }
  for(const q of t.questions){
    assert(!questionIds.has(q.id),`Duplicate question ${q.id}`);questionIds.add(q.id);questionCount++;
    if(q.chapter===1){
      assert(q.source,`${q.id} missing source label`);
      if(q.text.includes('如图'))assert(q.figure,`${q.id} says 如图 but has no source figure`);
    }
  }
}

for(const [i,c] of curriculum.entries())for(let j=0;j<=c.sections.length;j++)assert(topics.some(t=>t.section===`${i+1}.${j}`),`Missing ${i+1}.${j}`);
const chapter1Topics=topics.filter(t=>t.chapter===1);
const chapter1Questions=chapter1Topics.flatMap(t=>t.questions);
/* 当前题库：第一章 28 个；第二至六章正文 35 个；第二至六章综合复习 5 个，共 68 个。 */
assert.equal(topics.length,68,'当前全册应有 68 个知识点/专题');
/* 第一章 90 道；其余 40 个题型各 3 道可选题，共 120 道，总计 210 道。 */
assert.equal(questionCount,210,'当前全册应有 210 道可选题目');
assert.equal(chapter1Topics.length,28,'第一章应有 28 个知识点/专题');
assert.equal(chapter1Questions.length,90,'第一章应完整收录 90 道可选原材料题目');
assert.equal(chapter1Questions.filter(q=>q.figure).length,75,'第一章应保留 75 道原材料题图');
assert.equal(new Set(chapter1Questions.filter(q=>q.figure).map(q=>q.figureId)).size,75,'75 道带图题必须一题一图且 figureId 唯一');
assert.equal(questionIds.size,questionCount);
assert.equal(chapter1Questions.find(q=>q.id==='c1-2-8').answer,'8');
assert.equal(chapter1Questions.find(q=>q.id==='c1-12-e2').answer,'△AMC≌△BMD；∠AEB=60°');
assert.equal(chapter1Questions.find(q=>q.id==='c1-13-15').answer,'EF=BE+FD');
assert(chapter1Questions.find(q=>q.id==='c1-13-15').text.includes('1/2∠BAD'));

const html=fs.readFileSync('dist/index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!match[1].startsWith('data:'))assert(fs.existsSync('dist/'+match[1]),match[1]);}
assert(!html.includes('chapter1a.js'),'index still loads legacy chapter1a.js');
assert(html.includes('chapter1-bank-6.js'));

console.log(JSON.stringify({
  chapters:curriculum.length,
  textbookSections:curriculum.reduce((n,c)=>n+c.sections.length,0),
  topics:topics.length,
  examples:topics.length,
  selectableQuestions:questionCount,
  chapter1Topics:chapter1Topics.length,
  chapter1Questions:chapter1Questions.length,
  chapter1Figures:chapter1Questions.filter(q=>q.figure).length,
  chapter1FigureVersion,
  uniqueFigureKeys:figureKeys.size,
  types:[...new Set(topics.flatMap(t=>t.questions.map(q=>q.type)))],
  difficultyLabels:'removed',
  structuralValidation:'passed'
},null,2));
