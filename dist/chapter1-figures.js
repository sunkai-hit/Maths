/* 第一章题图：从用户提供 PDF 的原始页面/矢量内容提取并保留。 */
const chapter1Figures={};
const F=id=>{
 const f=chapter1Figures[id];
 if(!f)return null;
 if(typeof f==='string')return {src:f,alt:'原材料题图'};
 if(f.kind==='svg')return {src:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(f.data),svg:f.data,alt:f.alt||'原材料题图'};
 return {src:f.data,alt:f.alt||'原材料题图'};
};
