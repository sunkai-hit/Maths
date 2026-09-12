/* 第一章题库依据用户提供的《鲁教七上数学（1三角形）》整理。
 * 保留材料的知识点、训练题与专题逻辑；对少量依赖原图/OCR错位的题干，
 * 仅做数字化表述和符号统一，不改变原材料的答案与主要解题思路。
 * t01~t07 保留原项目核心题型 ID；新增第一章题型使用 c1-*，
 * 后续章节仍从 t08 开始，避免旧浏览器草稿中的后续章节题号整体漂移。
 */
const curriculum=[
 {name:'三角形',sections:['认识三角形','图形的全等','探索三角形全等的条件','三角形的尺规作图','利用三角形全等测距离']},
 {name:'轴对称',sections:['轴对称现象','探索轴对称的性质','简单的轴对称图形','利用轴对称进行设计']},
 {name:'勾股定理',sections:['探索勾股定理','一定是直角三角形吗','勾股定理的应用举例']},
 {name:'实数',sections:['无理数','平方根','立方根','估算','用计算器开方','实数']},
 {name:'位置与坐标',sections:['确定位置','平面直角坐标系','轴对称与坐标变化']},
 {name:'一次函数',sections:['函数','一次函数','一次函数的图象','确定一次函数的表达式','一次函数的应用']}
];
const topics=[];
const Q=(type,text,answer,steps,options=[],diagram=null)=>({type,text,answer,steps,options,diagram});
function addTopic(id,section,name,rule,method,pitfall,example,basic,improve,challenge){
 const [chapter,part]=section.split('.').map(Number);
 const questions=[basic,improve,challenge].map((q,i)=>({...q,id:id+'-'+(i+1),difficulty:['基础题','提高题','压轴题'][i],topicId:id,chapter,section}));
 topics.push({id,section,chapter,part,name,rule,method,pitfall,example,questions});
}
const TID=(id,section,name,rule,method,pitfall,example,basic,improve,challenge)=>addTopic(id,section,name,rule,method,pitfall,example,basic,improve,challenge);
let topicSerial=7;
function T(section,name,rule,method,pitfall,example,basic,improve,challenge){
 const id='t'+String(++topicSerial).padStart(2,'0');
 addTopic(id,section,name,rule,method,pitfall,example,basic,improve,challenge);
}
