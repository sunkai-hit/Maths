/* 第一章题图：由用户提供 PDF 的最终页面渲染结果逐题精确裁切。 */
const chapter1FigureVersion='page-render-crops-v2';
const chapter1Figures={};
const F=id=>{
 const f=chapter1Figures[id];
 if(!f)return null;
 if(typeof f==='string')return {src:f,alt:'原材料题图'};
 if(f.kind==='svg')return {src:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(f.data),svg:f.data,alt:f.alt||'原材料题图'};
 return {src:f.data,alt:f.alt||'原材料题图'};
};
