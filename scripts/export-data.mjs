import fs from 'node:fs';
import vm from 'node:vm';

const sourceFiles=[
  'data.js',
  'chapter1-figures.js','chapter1-figures-1.js','chapter1-figures-2.js','chapter1-figures-3.js','chapter1-figures-4.js','chapter1-figures-5.js','chapter1-figures-6.js','chapter1-figures-7.js',
  'chapter1-bank-1.js','chapter1-bank-2.js','chapter1-bank-3.js','chapter1-bank-4.js','chapter1-bank-5.js','chapter1-bank-6.js',
  'chapter2.js','chapter3.js','chapter4.js','chapter5.js','chapter6.js','reviews.js','diagrams.js'
];
const context=vm.createContext({encodeURIComponent});
for(const file of sourceFiles)vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
const {curriculum,topics}=vm.runInContext('({curriculum,topics})',context);
const snapshot={
  schemaVersion:2,
  description:'鲁教版五四制七年级上册数学题库；第一章按用户提供完整材料全量整理并保留原题图；来源为当前 dist 数据文件',
  curriculum,
  topics
};
fs.mkdirSync('data',{recursive:true});
fs.mkdirSync('database',{recursive:true});
fs.writeFileSync('data/question-bank.json',JSON.stringify(snapshot,null,2)+'\n');

const str=value=>value==null?'NULL':"'"+String(value).replace(/'/g,"''")+"'";
const json=value=>str(JSON.stringify(value??null));
let sql=`-- Generated from application question bank. Not a live backend database.\nPRAGMA foreign_keys = ON;\nBEGIN TRANSACTION;\nCREATE TABLE chapters (id INTEGER PRIMARY KEY, name TEXT NOT NULL);\nCREATE TABLE sections (id TEXT PRIMARY KEY, chapter_id INTEGER NOT NULL REFERENCES chapters(id), section_no INTEGER NOT NULL, name TEXT NOT NULL, is_review INTEGER NOT NULL CHECK(is_review IN (0,1)));\nCREATE TABLE topics (id TEXT PRIMARY KEY, section_id TEXT NOT NULL REFERENCES sections(id), name TEXT NOT NULL, rule TEXT NOT NULL, method TEXT NOT NULL, pitfall TEXT NOT NULL);\nCREATE TABLE questions (id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topics(id), role TEXT NOT NULL CHECK(role IN ('example','practice')), source TEXT, question_type TEXT NOT NULL, question_text TEXT NOT NULL, answer TEXT NOT NULL, steps_json TEXT NOT NULL, options_json TEXT NOT NULL, figure_id TEXT, figure_json TEXT, diagram_json TEXT);\n`;
for(const [index,chapter] of curriculum.entries()){
  const id=index+1;
  sql+=`INSERT INTO chapters VALUES (${id},${str(chapter.name)});\n`;
  for(const [j,name] of [...chapter.sections,'单元复习'].entries()){
    const n=j===chapter.sections.length?0:j+1;
    sql+=`INSERT INTO sections VALUES (${str(id+'.'+n)},${id},${n},${str(name)},${n===0?1:0});\n`;
  }
}
for(const t of topics){
  sql+=`INSERT INTO topics VALUES (${str(t.id)},${str(t.section)},${str(t.name)},${str(t.rule)},${str(t.method)},${str(t.pitfall)});\n`;
  const rows=[['example',t.example],...t.questions.map(q=>['practice',q])];
  for(const [role,q] of rows){
    sql+=`INSERT INTO questions VALUES (${str(q.id)},${str(t.id)},${str(role)},${str(q.source||null)},${str(q.type)},${str(q.text)},${str(q.answer)},${json(q.steps)},${json(q.options||[])},${str(q.figureId||null)},${q.figure?json(q.figure):'NULL'},${q.diagram?json(q.diagram):'NULL'});\n`;
  }
}
sql+='CREATE INDEX questions_by_topic ON questions(topic_id);\nCREATE INDEX questions_by_type ON questions(question_type);\nCREATE INDEX questions_by_source ON questions(source);\nCOMMIT;\n';
fs.writeFileSync('database/question-bank.sql',sql);
const practice=topics.reduce((n,t)=>n+t.questions.length,0);
const chapter1Practice=topics.filter(t=>t.chapter===1).reduce((n,t)=>n+t.questions.length,0);
console.log(JSON.stringify({chapters:curriculum.length,topics:topics.length,examples:topics.length,practice,chapter1Practice,questionsWithFigures:topics.flatMap(t=>t.questions).filter(q=>q.figure).length}));
