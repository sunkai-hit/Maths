/* Offline A4 PDF exporter. Raster pages preserve CJK and mathematical glyphs without external fonts.
   PDF image streams: ISO 32000 image XObject /DCTDecode; see https://pdfa.org/wp-content/uploads/2017/07/PDFraster10.pdf */
const PaperPDF = (() => {
  const W = 595.28, H = 841.89, M = 43, BOTTOM = H - 48, SCALE = 3;
  const FONT = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif';
  const encoder = new TextEncoder();
  const join = chunks => { const bytes = new Uint8Array(chunks.reduce((n,b)=>n+b.length,0)); let at=0; for(const b of chunks){bytes.set(b,at);at+=b.length;} return bytes; };
  function decode(data){const raw=atob(data.split(',').pop()),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes;}
  function buildPDF(images){
    if(!images.length)throw Error('没有可导出的页面');
    const objects=[null];
    objects[1]=encoder.encode('<< /Type /Catalog /Pages 2 0 R >>');
    objects[2]=encoder.encode(`<< /Type /Pages /Count ${images.length} /Kids [${images.map((_,i)=>(3+i*3)+' 0 R').join(' ')}] >>`);
    images.forEach((image,i)=>{const n=3+i*3,bytes=decode(image.data),paint=encoder.encode(`q\n${W} 0 0 ${H} 0 0 cm\n/Im0 Do\nQ\n`);
      objects[n]=encoder.encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${n+1} 0 R >> >> /Contents ${n+2} 0 R >>`);
      objects[n+1]=join([encoder.encode(`<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`),bytes,encoder.encode('\nendstream')]);
      objects[n+2]=join([encoder.encode(`<< /Length ${paint.length} >>\nstream\n`),paint,encoder.encode('endstream')]);
    });
    const chunks=[encoder.encode('%PDF-1.4\n%Xunti\n')],offsets=[0];let position=chunks[0].length;
    for(let i=1;i<objects.length;i++){offsets.push(position);const object=join([encoder.encode(`${i} 0 obj\n`),objects[i],encoder.encode('\nendobj\n')]);chunks.push(object);position+=object.length;}
    const xref=position;chunks.push(encoder.encode(`xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));return join(chunks);
  }
  function layout(paper,measure){
    const pages=[[]];let page=pages[0],y=M;
    const next=()=>{page=[];pages.push(page);y=M;};
    function paragraph(text,size=11,bold=false,align='left',gap=6){
      const rows=[];for(const raw of String(text).split('\n')){let row='';for(const char of raw){if(row&&measure(row+char,size,bold)>W-M*2){rows.push(row);row=char;}else row+=char;}rows.push(row);}
      const lines=rows.map(text=>({kind:'text',text,size,bold,align,height:size*1.85}));if(gap)lines.push({kind:'space',height:gap});return lines;
    }
    function place(block){const total=block.reduce((n,u)=>n+u.height,0);if(total<=BOTTOM-M&&y+total>BOTTOM&&page.length)next();for(const unit of block){if(y+unit.height>BOTTOM&&page.length)next();if(unit.kind!=='space')page.push({...unit,x:M,y});y+=unit.height;}}
    function question(q,label,answer){let block=[...paragraph(label+q.text)];
      if(q.diagram)block.push({kind:'diagram',diagram:q.diagram,height:155});
      if(q.options?.length)for(let i=0;i<q.options.length;i++)block.push(...paragraph('ABCD'[i]+'.  '+q.options[i],11,false,'left',2));
      if(answer){block.push(...paragraph('答案：'+q.answer,11,true));q.steps.forEach((step,i)=>block.push(...paragraph((i+1)+'. '+step,10.5)));}
      else block.push({kind:'space',height:['选择题','填空题'].includes(q.type)?16:({compact:50,normal:90,large:140}[paper.space]||90)});
      block.push({kind:'space',height:14});return block;
    }
    place(paragraph(paper.title,17,true,'center',8));
    place(paragraph(`鲁教版五四制 · 七年级上册数学　共 ${paper.questions.length} 题`,10,false,'center',10));
    if(!paper.answer)place(paragraph('姓名：________________　日期：________________',11,false,'center',22));
    if(paper.examples){place(paragraph('例题讲解',14,true));for(const topic of paper.lessons){place([...paragraph(topic.name,12,true),...paragraph(topic.rule,10.5),...question(topic.example,'例题：',true)]);}if(page.length)next();place(paragraph(paper.answer?'练习答案':'同类题练习',14,true));}
    paper.questions.forEach((q,i)=>place(question(q,(i+1)+'.  ',paper.answer)));
    place(paragraph(paper.answer?'— 答案解析结束 —':'— 练习卷结束 —',10,false,'center',0));
    return pages;
  }
  function diagram(ctx,d,x,y){
    ctx.textAlign='left';
    const w=225,h=142,pad=18,points=d.points||{},bounds=d.bounds||[-1,9,-1,7];const [xmin,xmax,ymin,ymax]=bounds;
    const scale=Math.min((w-2*pad)/(xmax-xmin),(h-2*pad)/(ymax-ymin)),ox=x+(w-scale*(xmax-xmin))/2,oy=y+(h-scale*(ymax-ymin))/2;
    const xy=p=>[ox+(p[0]-xmin)*scale,y+h-(oy-y)-(p[1]-ymin)*scale];
    function line(a,b,color='#111',width=.9){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(...xy(a));ctx.lineTo(...xy(b));ctx.stroke();}
    if(d.axes){for(let a=Math.ceil(xmin);a<=xmax;a++)line([a,ymin],[a,ymax],'#dddddd',.4);for(let b=Math.ceil(ymin);b<=ymax;b++)line([xmin,b],[xmax,b],'#dddddd',.4);line([xmin,0],[xmax,0],'#777',.7);line([0,ymin],[0,ymax],'#777',.7);ctx.font='9px '+FONT;ctx.fillStyle='#111';const a=xy([xmax,0]),b=xy([0,ymax]);ctx.fillText('x',a[0]-5,a[1]-12);ctx.fillText('y',b[0]+6,b[1]);}
    for(const [a,b] of d.lines||[])line(points[a],points[b]);
    for(const g of d.graph||[])line([g[2],g[0]*g[2]+g[1]],[g[3],g[0]*g[3]+g[1]],'#111',1.2);
    ctx.font='10px '+FONT;ctx.fillStyle='#111';for(const [name,p] of Object.entries(points)){const [px,py]=xy(p);ctx.beginPath();ctx.arc(px,py,1.8,0,Math.PI*2);ctx.fill();ctx.fillText(name,px+(p[2]||7)*.7,py+(p[3]||-9)*.7-5);}
    ctx.font='7px '+FONT;ctx.fillStyle='#555';ctx.fillText(d.axes?'每小格 1 个单位':'示意图，长度以题目条件为准',x,y+h+2);
  }
  async function create(paper,onProgress=()=>{}){
    if(!paper.questions?.length)throw Error('请先勾选题目');
    if(document.fonts?.ready)await document.fonts.ready;
    const canvas=document.createElement('canvas');canvas.width=Math.round(W*SCALE);canvas.height=Math.round(H*SCALE);const ctx=canvas.getContext('2d');if(!ctx)throw Error('当前浏览器无法生成 PDF');
    const measure=(s,size,bold)=>{ctx.font=(bold?'bold ':'')+size+'px '+FONT;return ctx.measureText(s).width;};
    const pages=layout(paper,measure),images=[];
    for(let i=0;i<pages.length;i++){
      ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.scale(SCALE,SCALE);ctx.textBaseline='top';ctx.textAlign='left';
      for(const command of pages[i]){if(command.kind==='diagram'){diagram(ctx,command.diagram,command.x,command.y);continue;}ctx.font=(command.bold?'bold ':'')+command.size+'px '+FONT;ctx.fillStyle='#111';ctx.textAlign=command.align;ctx.fillText(command.text,command.align==='center'?W/2:command.x,command.y+2);}
      ctx.textAlign='center';ctx.font='9px '+FONT;ctx.fillStyle='#666';ctx.fillText(`第 ${i+1} 页 / 共 ${pages.length} 页`,W/2,H-30);
      images.push({data:canvas.toDataURL('image/jpeg',.97),width:canvas.width,height:canvas.height});onProgress(i+1,pages.length);await new Promise(resolve=>setTimeout(resolve,0));
    }
    canvas.width=canvas.height=1;
    const bytes=buildPDF(images),blob=new Blob([bytes],{type:'application/pdf'});
    const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('PDF 文件生成失败'));reader.readAsDataURL(blob);});
    return {dataUrl,images,pages:pages.length,bytes:bytes.length};
  }
  return {create,layout,buildPDF};
})();
