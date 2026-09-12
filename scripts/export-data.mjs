import fs from 'node:fs';
import vm from 'node:vm';
const sourceFiles=['data.js','chapter1a.js','chapter1b.js','chapter1c.js','chapter1d.js','chapter2.js','chapter3.js','chapter4.js','chapter5.js','chapter6.js','reviews.js','diagrams.js'];
const context=vm.createContext({});
for(const file of sourceFiles)vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
const {curriculum,topics}=vm.runInContext('({curriculum,topics})',context);
const snapshot={schemaVersion:1,description:'鲁教版五四制七年级上册数学；首批原创题库；来源为当前 dist 数据文件',curriculum,topics};
fs.mkdirSync('data',{recursive:true});fs.mkdirSync('database',{recursive:true});
fs.writeFileSync('data/question-bank.json',JSON.stringify(snapshot,null,2)+'\n');
const str=value=>value==null?'NULL':"'"+String(value).replace(/'/g,"''")+"'";
const json=value=>str(JSON.stringify(value??null));
let sql=`-- Generated from application question bank. Not a live backend database.\nPRAGMA foreign_keys = ON;\nBEGIN TRANSACTION;\nCREATE TABLE chapters (id INTEGER PRIMARY KEY, name TEXT NOT NULL);\nCREATE TABLE sections (id TEXT PRIMARY KEY, chapter_id INTEGER NOT NULL REFERENCES chapters(id), section_no INTEGER NOT NULL, name TEXT NOT NULL, is_review INTEGER NOT NULL CHECK(is_review IN (0,1)));\nCREATE TABLE topics (id TEXT PRIMARY KEY, section_id TEXT NOT NULL REFERENCES sections(id), name TEXT NOT NULL, rule TEXT NOT NULL, method TEXT NOT NULL, pitfall TEXT NOT NULL);\nCREATE TABLE questions (id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topics(id), role TEXT NOT NULL CHECK(role IN ('example','practice')), difficulty TEXT CHECK(difficulty IN ('基础题','提高题','压轴题')), question_type TEXT NOT NULL, question_text TEXT NOT NULL, answer TEXT NOT NULL, steps_json TEXT NOT NULL, options_json TEXT NOT NULL, diagram_json TEXT);\n`;
for(const [index,chapter] of curriculum.entries()){const id=index+1;sql+=`INSERT INTO chapters VALUES (${id},${str(chapter.name)});\n`;for(const [j,name] of [...chapter.sections,'单元复习'].entries()){const n=j===chapter.sections.length?0:j+1;sql+=`INSERT INTO sections VALUES (${str(id+'.'+n)},${id},${n},${str(name)},${n===0?1:0});\n`;}}
for(const t of topics){sql+=`INSERT INTO topics VALUES (${str(t.id)},${str(t.section)},${str(t.name)},${str(t.rule)},${str(t.method)},${str(t.pitfall)});\n`;for(const [i,q] of [t.example,...t.questions].entries()){sql+=`INSERT INTO questions VALUES (${str(i?q.id:t.id+'-example')},${str(t.id)},${str(i?'practice':'example')},${str(i?q.difficulty:null)},${str(q.type)},${str(q.text)},${str(q.answer)},${json(q.steps)},${json(q.options||[])},${q.diagram?json(q.diagram):'NULL'});\n`;}}
sql+='CREATE INDEX questions_by_topic ON questions(topic_id);\nCREATE INDEX questions_by_difficulty_type ON questions(difficulty,question_type);\nCOMMIT;\n';
fs.writeFileSync('database/question-bank.sql',sql);
console.log(JSON.stringify({chapters:curriculum.length,topics:topics.length,examples:topics.length,practice:topics.reduce((n,t)=>n+t.questions.length,0)}));
