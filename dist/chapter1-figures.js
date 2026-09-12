/* 第一章题图：从用户提供 PDF 的原始矢量/页面裁图复刻。 */
const chapter1Figures={};
const F=id=>{const f=chapter1Figures[id];if(!f)return null;return f.kind==='svg'?{src:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(f.data),svg:f.data,alt:'原材料题图'}:{src:f.data,alt:'原材料题图'};};
