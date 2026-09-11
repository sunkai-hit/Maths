function drawDiagram(d){
 const w=320,h=220,pad=28,points=d.points||{},lines=d.lines||[],bounds=d.bounds||[-1,9,-1,7];
 const [xmin,xmax,ymin,ymax]=bounds,scale=Math.min((w-2*pad)/(xmax-xmin),(h-2*pad)/(ymax-ymin)),ox=(w-scale*(xmax-xmin))/2,oy=(h-scale*(ymax-ymin))/2;
 const xy=p=>[ox+(p[0]-xmin)*scale,h-oy-(p[1]-ymin)*scale];
 const line=(a,b,cls='')=>{const [x1,y1]=xy(a),[x2,y2]=xy(b);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;};
 let svg='';if(d.axes){for(let x=Math.ceil(xmin);x<=xmax;x++)svg+=line([x,ymin],[x,ymax],'grid');for(let y=Math.ceil(ymin);y<=ymax;y++)svg+=line([xmin,y],[xmax,y],'grid');svg+=line([xmin,0],[xmax,0],'axis')+line([0,ymin],[0,ymax],'axis');const [xx,xyy]=xy([xmax,0]),[yx,yy]=xy([0,ymax]);svg+=`<text x="${xx-6}" y="${xyy-8}">x</text><text x="${yx+8}" y="${yy+5}">y</text>`;}
 for(const [a,b] of lines)svg+=line(points[a],points[b]);
 if(d.graph){for(const g of d.graph){svg+=line([g[2],g[0]*g[2]+g[1]],[g[3],g[0]*g[3]+g[1]],'graph');}}
 for(const [name,p] of Object.entries(points)){const [x,y]=xy(p);svg+=`<circle cx="${x}" cy="${y}" r="3"/><text x="${x+(p[2]||7)}" y="${y+(p[3]||-9)}">${name}</text>`;}
 return `<figure class="math-figure"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${d.label||'题目几何示意图'}">${svg}</svg><figcaption>${d.axes?'每小格 1 个单位':'示意图，长度以题目条件为准'}</figcaption></figure>`;
}
const findTopic=name=>topics.find(t=>t.name===name);
const midTri={points:{A:[4,6],B:[0,0,-16,16],C:[8,0,6,16],D:[4,0,6,16]},lines:[['A','B'],['B','C'],['C','A'],['A','D']],label:'三角形 ABC，D 为底边 BC 的中点'};
findTopic('中线、高与面积分割').example.diagram=midTri;
findTopic('中线、高与面积分割').questions[2].diagram={...midTri,points:{...midTri.points,E:[4,3]},lines:[...midTri.lines,['B','E'],['C','E']]};
findTopic('等腰三角形的性质与分类讨论').questions[2].diagram={...midTri,points:{...midTri.points,E:[4,2]},lines:[...midTri.lines,['B','E'],['C','E']]};
findTopic('ASA、AAS 与直角三角形全等').questions[1].diagram=midTri;
findTopic('三角形单元综合').example.diagram=midTri;
findTopic('三角形单元综合').questions[0].diagram=midTri;
findTopic('轴对称单元综合').example.diagram=midTri;
findTopic('SSS、SAS 与全等条件补充').questions[1].diagram={points:{A:[1,5],B:[7,1],C:[2,0,-15,15],D:[6,6],O:[4,3]},lines:[['A','B'],['C','D'],['A','C'],['B','D']],label:'AB、CD 相交于 O，OA=OB，OC=OD'};
findTopic('勾股定理求边与面积').example.diagram={points:{A:[0,6,-15,-8],B:[8,0,6,16],C:[0,0,-15,16]},lines:[['A','B'],['B','C'],['C','A']],bounds:[-1,9,-1,7],label:'直角三角形 ABC，C 为直角顶点'};
findTopic('坐标中的线段与图形面积').example.diagram={points:{A:[-2,0,-22,19],B:[4,0,5,19],C:[1,3],O:[0,0,5,19]},lines:[['A','B'],['B','C'],['C','A']],bounds:[-3,5,-1,4],axes:true,label:'坐标系中的 A(-2,0)、B(4,0)、C(1,3)'};
findTopic('描点作图与坐标轴交点').example.diagram={points:{A:[2,0,6,19],B:[0,4],O:[0,0,-15,19]},graph:[[-2,4,-0.5,2.5]],bounds:[-1,4,-2,6],axes:true,label:'直线 y=-2x+4，与两坐标轴交于 A(2,0)、B(0,4)'};
findTopic('一次函数与方程、不等式').questions[2].diagram={points:{A:[-2,0,-20,19],B:[4,0,6,19],P:[2,4],O:[0,0,5,19]},lines:[['A','B'],['A','P'],['P','B']],bounds:[-3,5,-1,5],axes:true,label:'两直线交点 P(2,4)，与 x 轴交于 A(-2,0)、B(4,0)'};
