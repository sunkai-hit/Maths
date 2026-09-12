/* 题库基础结构。第一章按用户提供的完整材料全量整理；后续章节继续兼容原 T(...) 写法。 */
const curriculum=[
 {name:'三角形',sections:['认识三角形','图形的全等','探索三角形全等的条件','三角形的尺规作图','利用三角形全等测距离']},
 {name:'轴对称',sections:['轴对称现象','探索轴对称的性质','简单的轴对称图形','利用轴对称进行设计']},
 {name:'勾股定理',sections:['探索勾股定理','一定是直角三角形吗','勾股定理的应用举例']},
 {name:'实数',sections:['无理数','平方根','立方根','估算','用计算器开方','实数']},
 {name:'位置与坐标',sections:['确定位置','平面直角坐标系','轴对称与坐标变化']},
 {name:'一次函数',sections:['函数','一次函数','一次函数的图象','确定一次函数的表达式','一次函数的应用']}
];
const topics=[];
const Q=(type,text,answer,steps,options=[],diagram=null,meta={})=>({type,text,answer,steps,options,diagram,...meta});
const SQ=(qid,source,type,text,answer,steps,options=[],diagram=null,meta={})=>Q(type,text,answer,steps,options,diagram,{qid,source,...meta});
function addTopic(id,section,name,rule,method,pitfall,example,questions){
 const [chapter,part]=section.split('.').map(Number);
 const normalized=questions.map((q,i)=>({...q,id:q.qid||`${id}-${i+1}`,topicId:id,chapter,section}));
 const ex={...example,id:example?.qid||`${id}-example`,topicId:id,chapter,section};
 topics.push({id,section,chapter,part,name,rule,method,pitfall,example:ex,questions:normalized});
}
/* 第一章：例题数量与练习数量不再固定，每个题型可以挂任意数量原材料题目。 */
function TS(id,section,name,rule,method,pitfall,example,...questions){if(example?.alsoQuestion)questions=[example,...questions];addTopic(id,section,name,rule,method,pitfall,example,questions);}
/* 第二章以后沿用旧写法。旧数据中的难度字段只保留为兼容数据，页面已不再展示或筛选难度。 */
let topicSerial=7;
function T(section,name,rule,method,pitfall,example,basic,improve,challenge){
 const id='t'+String(++topicSerial).padStart(2,'0');
 if(section==='1.0') return; // 第一章单元复习已由完整材料专题题库替代；仍递增序号以保持后续旧 ID 稳定。
 const qs=[basic,improve,challenge].map((q,i)=>({...q,difficulty:['基础题','提高题','压轴题'][i]}));
 addTopic(id,section,name,rule,method,pitfall,example,qs);
}
