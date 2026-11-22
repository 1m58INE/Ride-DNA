'use strict';
/* RIDE DNA v1.9.0 — Local, deterministic collector-card rendering.
 * Rendering depends only on sanitized summary, authorized local axes and known glyph paths.
 * No network, fonts, images or untrusted markup. Three independent art directions.
 */
(function(){
 const W=1080;
 const PAL={
  velocity:{bg:'#080a0f',ink:'#f5f4f3',weak:'#c8aab1',accent:'#f24058',second:'#ff8b95',line:'#702d40'},
  noir:{bg:'#0b0e13',ink:'#f2f0ed',weak:'#c5c7cb',accent:'#d8b6a7',second:'#f0ded1',line:'#545861'},
  signature:{bg:'#070e18',ink:'#ebfaff',weak:'#98bbc8',accent:'#f05268',second:'#67e2e8',line:'#2b6576'}
 };
 const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
 const XY=(x,y)=>[x,y];
 const pt=(ctx,p)=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
 function poly(ctx,points,fill,stroke,width=1){pt(ctx,points);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
 function line(ctx,x,y,x2,y2,color,width=1){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function rect(ctx,x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);}
 function rounded(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();const rr=Math.min(r,w/2,h/2);ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
 function font(px,weight=700,family='system-ui, "Noto Sans CJK KR", sans-serif'){return `${weight} ${px}px ${family}`;}
 function text(ctx,str,x,y,size=32,color='#fff',weight=700,align='left',maxWidth=undefined){
  ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillStyle=color;ctx.font=font(size,weight);
  if(maxWidth)ctx.fillText(String(str),x,y,maxWidth);else ctx.fillText(String(str),x,y);
 }
 function fit(ctx,str,x,y,maxW,base=72,min=24,color='#fff',weight=800){
  let size=base;ctx.font=font(size,weight);while(size>min&&ctx.measureText(str).width>maxW){size-=2;ctx.font=font(size,weight);}
  text(ctx,str,x,y,size,color,weight,'left',maxW);return size;
 }
 function wide(ctx,str,x,y,size,color,spacing=8,weight=700){
  ctx.font=font(size,weight);ctx.fillStyle=color;ctx.textAlign='left';ctx.textBaseline='alphabetic';let dx=x;
  for(const ch of String(str)){ctx.fillText(ch,dx,y);dx+=ctx.measureText(ch).width+spacing;}
 }
 function base(ctx,h,start,end){const g=ctx.createLinearGradient(0,0,W,h);g.addColorStop(0,start);g.addColorStop(1,end);rect(ctx,0,0,W,h,g);}
 function tick(ctx,x,y,color){line(ctx,x-9,y,x+9,y,color,3);line(ctx,x,y-9,x,y+9,color,3);}
 function corners(ctx,h,color){const m=33,l=28;[[m,m,1,1],[W-m,m,-1,1],[m,h-m,1,-1],[W-m,h-m,-1,-1]].forEach(([x,y,sx,sy])=>{line(ctx,x,y,x+sx*l,y,color,3);line(ctx,x,y,x,y+sy*l,color,3);});}
 function fade(ctx,x,y,r,alphaColor){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,alphaColor);g.addColorStop(1,'transparent');rect(ctx,0,0,W,ctx.canvas.height,g);}
 function standardHeader(ctx,d,h,edition,p){
   const serial=String(d.type+1).padStart(2,'0');
   wide(ctx,'RIDE DNA',70,115,36,p.ink,4,850);
   text(ctx,'RIDER ID  /  '+edition,72,162,19,p.weak,650);
   text(ctx,'NO. '+serial+' / 16',W-76,119,29,p.second,850,'right');
   line(ctx,70,194,W-70,194,p.line,2);
 }
 function footer(ctx,h,p,edition){
   line(ctx,70,h-99,W-70,h-99,p.line,2);
   text(ctx,'RIDE DNA   /   YOUR RIDE. YOUR IDENTITY.',74,h-56,18,p.weak,680);
   text(ctx,edition.toUpperCase()+'  ·  2026',W-74,h-56,16,p.second,740,'right');
 }
 function badge(ctx,d,cx,cy,size,style){
  const {p,metal=false,cut=false}=style;const i=clamp(d.type|0,0,15);
  ctx.save();ctx.translate(cx,cy);ctx.scale(size/360,size/360);ctx.translate(-180,-180);
  const structural=[
   [[180,7],[318,69],[319,244],[180,351],[41,244],[42,69]],
   [[180,8],[328,100],[284,274],[180,350],[76,274],[32,100]],
   [[180,12],[307,68],[342,182],[300,293],[180,348],[60,293],[18,182],[53,68]],
   [[180,0],[340,113],[310,245],[180,356],[50,245],[20,113]]
  ][i%4];
  // Mechanical wings respond to type family and retain a recognizable silhouette at 80px.
  const g=ctx.createLinearGradient(40,0,316,360);
  if(metal){g.addColorStop(0,'#252a31');g.addColorStop(.42,'#12151b');g.addColorStop(.77,'#6b6561');g.addColorStop(1,'#171c23');}
  else {g.addColorStop(0,cut?'#102431':'#421322');g.addColorStop(.55,'#0c1018');g.addColorStop(1,cut?'#123444':'#3e111e');}
  ctx.shadowColor=metal?'rgba(224,188,159,.33)':'rgba(241,45,74,.42)';ctx.shadowBlur=18;
  poly(ctx,structural,g,metal?'#e8d4c6':cut?'#6fdbe7':'#ff8792',5);
  ctx.shadowBlur=0;
  ctx.save();ctx.translate(180,180);ctx.scale(.855,.855);ctx.translate(-180,-180);
  poly(ctx,structural,'rgba(7,11,17,.8)',metal?'#8c898a':cut?'#24768a':'#a84656',2);
  ctx.restore();
  for(let side of [-1,1]){
   const x=180+side*155;
   const wing=side===1?[[319,120],[359,153],[335,176],[359,205],[313,242]]:[[41,120],[1,153],[25,176],[1,205],[47,242]];
   poly(ctx,wing,metal?'#77706d':cut?'#256f7d':'#96253f',null);
   line(ctx,x,108,x,255,metal?'#a8abae':cut?'#67c5d5':'#e96273',2);
  }
  const glyph=d.glyph||[];
  if(glyph.length===2){
   const sx=360/320;ctx.save();ctx.translate(0,0);ctx.scale(sx,sx);
   // The historic 16 hand-authored marks remain individually distinct; layered strokes gain depth.
   const main=new Path2D(glyph[0]),second=new Path2D(glyph[1]);
   ctx.lineJoin='miter';ctx.lineCap='square';ctx.strokeStyle='rgba(1,6,12,.9)';ctx.lineWidth=20;ctx.stroke(main);
   ctx.strokeStyle=metal?'#ead8ca':cut?'#d2faff':'#fff3f1';ctx.lineWidth=11;ctx.stroke(main);
   ctx.strokeStyle=metal?'#9b8580':cut?'#67e7ec':'#ff5670';ctx.lineWidth=4;ctx.stroke(second);
   ctx.restore();
  }
  for(const [x,y] of [[180,27],[180,330]]){ctx.fillStyle=metal?'#efdecf':cut?'#92f5f5':'#ff778a';ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();}
  ctx.restore();
 }
 function modeMark(ctx,d,h,p){text(ctx,d.mode==='deep'?'DEEP TEST':'QUICK TEST',72,h-122,17,p.weak,700);}
 function velocityFront(ctx,d,h,p){
  base(ctx,h,'#151018','#06070c');
  const g=ctx.createLinearGradient(1080,0,120,h);g.addColorStop(0,'#8c0e29');g.addColorStop(.45,'#4d101f');g.addColorStop(1,'#160d16');
  poly(ctx,[[742,0],[1080,0],[1080,h*.56],[360,h*.70]],g);
  poly(ctx,[[1080,h*.18],[1080,h*.22],[0,h*.92],[0,h*.86]],'rgba(242,59,82,.28)');
  poly(ctx,[[770,-60],[805,-60],[76,h*.75],[28,h*.75]],'#f33b53');
  poly(ctx,[[0,h*.54],[W,h*.16],[W,h*.205],[0,h*.60]],'rgba(255,255,255,.025)');
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,h);ctx.clip();
  for(let i=0;i<17;i++)line(ctx,-250+i*91,h*.71,-40+i*91,h*.46,i%4===0?'rgba(255,135,150,.2)':'rgba(249,210,217,.09)',i%4===0?9:2);
  ctx.restore();
  const cy=Math.min(h*.425,h-650),size=h<1200?540:h>1700?760:650;
  text(ctx,String(d.type+1).padStart(2,'0'),W-64,cy+size*.32,250,'rgba(247,162,172,.10)',900,'right');
  badge(ctx,d,552,cy,size,{p});
  const compact=h<=1080,s=compact?.82:1,panelY=h-(compact?440:520);
  poly(ctx,[[0,panelY+38],[1000,panelY-18],[1080,panelY+38],[1080,h],[0,h]],'#0a0e16');
  poly(ctx,[[0,panelY+40],[980,panelY-14],[1080,panelY-14],[1080,panelY+5],[0,panelY+69]],'#ed3f57');
  wide(ctx,'YOUR RIDER TYPE',76,panelY+115*s,22,'#f07383',3.5,850);
  fit(ctx,d.name,72,panelY+224*s,930,h<1200?79:90,48,'#fbf9f7',900);
  fit(ctx,d.english,76,panelY+272*s,915,27,17,'#bac4cc',680);
  line(ctx,76,panelY+297*s,1000,panelY+297*s,'#5d343e',2);
  text(ctx,'01',77,panelY+364*s,39,'#ff687c',900);
  fit(ctx,d.first,150,panelY+365*s,560,49,31,'#f8f9fb',750);
  text(ctx,'02  '+d.second,W-77,panelY+366,24,'#bac5cd',650,'right',330);
  standardHeader(ctx,d,h,'VELOCITY',p);footer(ctx,h,p,'Velocity');
 }
 function noirFront(ctx,d,h,p){
  base(ctx,h,'#1c2229','#080a0f');
  // Fine brushed-metal crossgrain, low-opacity etching instead of cyberpunk neon.
  for(let y=0;y<h;y+=13)line(ctx,0,y,W,y,y%52===0?'rgba(237,217,204,.055)':'rgba(237,217,204,.018)');
  const g=ctx.createLinearGradient(0,0,W,h);g.addColorStop(0,'rgba(241,211,183,.14)');g.addColorStop(.35,'rgba(250,249,244,.02)');g.addColorStop(.78,'rgba(217,181,158,.09)');g.addColorStop(1,'rgba(0,0,0,0)');rect(ctx,0,0,W,h,g);
  const cy=Math.min(h*.43,h-640),size=h<1200?500:h>1700?710:630;
  // Polished steel exhibition plate with chamfered corners.
  const top=cy-size*.52,btm=cy+size*.53,plate=[[122,top+41],[182,top],[889,top],[953,top+58],[953,btm-38],[892,btm],[182,btm],[122,btm-52]];
  const pg=ctx.createLinearGradient(120,top,960,btm);pg.addColorStop(0,'#383e45');pg.addColorStop(.13,'#181c23');pg.addColorStop(.58,'#10141b');pg.addColorStop(.81,'#33383b');pg.addColorStop(1,'#111218');
  poly(ctx,plate,pg,'rgba(232,215,196,.55)',3);
  poly(ctx,[[149,top+55],[197,top+24],[873,top+24],[925,top+69],[925,btm-57],[877,btm-24],[195,btm-24],[149,btm-60]],null,'rgba(239,215,197,.23)',2);
  // Engraved rivets and machine-precise fine strokes.
  [[177,top+78],[893,top+78],[177,btm-80],[893,btm-80]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fillStyle='#bca89b';ctx.fill();});
  for(let i=0;i<5;i++){line(ctx,142+i*31,btm-6,162+i*31,btm-6,'#967d73',3);line(ctx,826+i*20,top+7,834+i*20,top+7,'#967d73',2);}
  badge(ctx,d,536,cy,size*.77,{p,metal:true});
  const compact=h<=1080,s=compact?.82:1,panel=h-(compact?440:520);
  text(ctx,'C O L L E C T O R  /  N O . '+String(d.type+1).padStart(2,'0'),78,panel+35*s,20,'#d7b5a3',770);
  line(ctx,76,panel+62*s,1004,panel+62*s,'#8e8983',2);
  fit(ctx,d.name,75,panel+155*s,930,h<1200?76:84,42,p.ink,800);
  fit(ctx,d.english,78,panel+212*s,930,27,18,'#b0b3bc',670);
  rect(ctx,76,panel+247*s,6,92,'#d9b69c');
  text(ctx,'MOTORCYCLE',103,panel+279*s,21,'#bfafa9',700);
  fit(ctx,d.first,102,panel+339*s,600,47,28,'#f3f0eb',760);
  text(ctx,'SECOND  ·  '+d.second,1000,panel+338*s,23,'#c5b8b1',630,'right',315);
  standardHeader(ctx,d,h,'NOIR PREMIUM',p);footer(ctx,h,p,'Noir Premium');
 }
 function getPoints(axes,cx,cy,r){return ['city','touring','agility','comfort','versatility','expression','practicality','sportiness'].map((key,i)=>{const t=(Math.PI*2*i/8)-Math.PI/2;return XY(cx+Math.cos(t)*r*(.27+.73*clamp(Number(axes[key])||0,0,100)/100),cy+Math.sin(t)*r*(.27+.73*clamp(Number(axes[key])||0,0,100)/100));});}
 function forgeField(ctx,d,h,p,cx,cy,r){
  ctx.save();const a=d.axes||null;
  for(let ring=1;ring<=5;ring++){
   const pts=Array.from({length:8},(_,i)=>{const th=i*Math.PI/4-Math.PI/2;return XY(cx+Math.cos(th)*r*ring/5,cy+Math.sin(th)*r*ring/5);});
   poly(ctx,pts,null,ring===5?'rgba(98,230,243,.42)':'rgba(111,201,218,.18)',ring===5?3:1);
  }
  for(let j=0;j<8;j++){const th=j*Math.PI/4-Math.PI/2;line(ctx,cx,cy,cx+Math.cos(th)*r*1.1,cy+Math.sin(th)*r*1.1,'rgba(105,197,223,.24)',1.5);}
  const vals=a?Object.fromEntries(Object.entries(a)):null;
  if(vals){const pts=getPoints(vals,cx,cy,r);
   poly(ctx,pts,'rgba(255,74,103,.19)','#ef526b',5);
   pts.forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fillStyle='#8cfcfb';ctx.fill();});
  }else{
   // Shared summaries contain no 8-axis data: leave the scaffold decorative, not a fabricated score.
   line(ctx,cx-r*.45,cy+r*.32,cx+r*.45,cy-r*.32,'rgba(111,239,247,.35)',3);
  }
  ctx.restore();
 }
 function forgeFront(ctx,d,h,p){
  base(ctx,h,'#0c1c29','#070912');
  for(let x=0;x<W;x+=54)line(ctx,x,0,x,h,'rgba(101,203,222,.055)');
  for(let y=0;y<h;y+=54)line(ctx,0,y,W,y,'rgba(101,203,222,.055)');
  poly(ctx,[[0,0],[420,0],[0,h*.43]],'rgba(242,61,92,.13)');
  poly(ctx,[[W,0],[W,h*.54],[520,h*.70]],'rgba(37,134,161,.18)');
  const cy=Math.min(h*.43,h-650),r=h<1200?270:h>1700?390:320;
  forgeField(ctx,d,h,p,540,cy,r);
  badge(ctx,d,540,cy,r*.95,{p,cut:true});
  const compact=h<=1080,s=compact?.8:1,panelY=h-(compact?460:540);
  poly(ctx,[[0,panelY+12],[1080,panelY-38],[1080,h],[0,h]],'#08121c');
  line(ctx,68,panelY+74*s,1012,panelY+74*s,'#286475',3);
  rect(ctx,74,panelY+55*s,132,7,'#f14a68');
  text(ctx,d.axes?'8-AXIS  /  SIGNATURE DATA':'RIDER ID  /  SUMMARY ONLY',76,panelY+120*s,20,'#74cedf',760);
  fit(ctx,d.name,72,panelY+220*s,930,90,48,'#f2faff',900);
  fit(ctx,d.english,75,panelY+268*s,920,27,18,'#86bccb',620);
  line(ctx,75,panelY+295*s,1005,panelY+295*s,'#236073',2);
  text(ctx,'MATCH 01',74,panelY+348*s,22,'#79cbdd',740);
  fit(ctx,d.first,258,panelY+349*s,660,48,29,'#f9faff',800);
  text(ctx,'02   '+d.second,1003,panelY+394*s,23,'#9db9c3',620,'right',730);
  standardHeader(ctx,d,h,'DNA FORGE',p);footer(ctx,h,p,'DNA Forge');
 }
 function backBackground(ctx,d,h,p,theme){
  if(theme==='velocity'){
    base(ctx,h,'#19111a','#070b12');
    poly(ctx,[[730,0],[1080,0],[1080,h*.66],[240,h*.86]],'rgba(182,37,68,.29)');
    poly(ctx,[[0,h*.20],[1080,0],[1080,90],[0,h*.26]],'#be2c49');
    for(let i=0;i<11;i++)line(ctx,850+i*32,190,300+i*40,h*.76,'rgba(238,84,104,.13)',3);
  }else if(theme==='noir'){
    base(ctx,h,'#21282e','#080b10');
    for(let y=0;y<h;y+=12)line(ctx,0,y,W,y,'rgba(241,231,217,.025)');
    rounded(ctx,49,215,982,h-345,24,'rgba(7,9,13,.50)','rgba(213,191,170,.20)');
  }else{
    base(ctx,h,'#0c2230','#050c14');
    for(let x=0;x<W;x+=48)line(ctx,x,0,x,h,'rgba(102,195,210,.06)');
    for(let y=0;y<h;y+=48)line(ctx,0,y,W,y,'rgba(102,195,210,.06)');
    poly(ctx,[[1080,0],[1080,h*.38],[450,h*.62]],'rgba(40,114,142,.20)');
  }
 }
 function back(ctx,d,h,p,theme){
  backBackground(ctx,d,h,p,theme);
  standardHeader(ctx,d,h,theme==='velocity'?'DATA / VELOCITY':theme==='noir'?'DATA / NOIR':'DATA / FORGE',p);
  if(theme==='velocity'){poly(ctx,[[62,239],[472,239],[493,307],[62,307]],'#0b0d14');rect(ctx,62,239,6,68,p.accent);}
  wide(ctx,'RIDER ANALYSIS',74,278,25,p.second,4,850);
  fit(ctx,d.first,74,386,920,h<1200?70:82,32,p.ink,850);
  line(ctx,74,413,1004,413,p.line,2);
  text(ctx,'SECONDARY MATCH',77,466,20,p.weak,670);
  fit(ctx,d.second,365,470,620,42,27,p.ink,770);
  const analyticsY=h<=1080?574:h<=1350?675:885;
  if(d.axes){
   text(ctx,'YOUR RIDING PROFILE',75,analyticsY-36,25,p.second,800);
   // Eight familiar preference dimensions, 2-col by 4-row grid (never a fabricated %).
   const keys=['city','touring','agility','comfort','versatility','expression','practicality','sportiness'];
   const titles=['도심 활용','여행 지향','조작의 재미','편안함','다양한 길','디자인·감성','실용성','스포티함'];
   const step=h<=1080?87:h<=1350?105:174;
   keys.forEach((key,i)=>{
    const col=i%2,row=Math.floor(i/2),x=77+col*500,y=analyticsY+row*step;
    const val=clamp(Math.round(d.axes[key]??0),0,100);
    text(ctx,titles[i],x,y+5,25,p.ink,660);
    text(ctx,String(val),x+420,y+5,24,p.second,760,'right');
    rect(ctx,x,y+25,423,8,theme==='noir'?'#333943':'#192f3c');
    const g=ctx.createLinearGradient(x,0,x+423,0);g.addColorStop(0,p.accent);g.addColorStop(1,p.second);
    rect(ctx,x,y+25,423*val/100,8,g);
    line(ctx,x+423,y+18,x+423,y+39,p.line,1.5);
   });
   if(h>1650){forgeField(ctx,d,h,p,540,h-378,120);}
   text(ctx,'점수는 라이딩 선호를 표현하며, 운전 능력이나 안전성을 측정하지 않아요.',77,h-160,19,p.weak,520,'left',940);
  }else{
   rounded(ctx,71,analyticsY-60,938,h<=1080?315:405,12,'rgba(15,29,39,.85)',p.line);
   text(ctx,'SUMMARY PREVIEW',105,analyticsY+14,25,p.second,770);
   text(ctx,'공유 링크에는 상세 취향 점수가 포함되지 않아요.',106,analyticsY+98,31,p.ink,660,'left',870);
   text(ctx,'원본 검사 결과에서 전체 취향 분석을 볼 수 있어요.',105,analyticsY+160,23,p.weak,520,'left',865);
   badge(ctx,d,830,analyticsY+240,178,{p,metal:theme==='noir',cut:theme==='signature'});
  }
  footer(ctx,h,p,'Analysis / '+theme);
 }
 function draw(canvas,options){
  if(!(canvas instanceof HTMLCanvasElement))throw new TypeError('canvas required');
  const h=clamp(Math.round(options.h)||1350,1080,1920),w=1080;
  if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw new Error('2D Canvas unavailable');
  const theme=['velocity','noir','signature'].includes(options.theme)?options.theme:'velocity';
  const p=PAL[theme];const d={...options,type:clamp(options.type|0,0,15),name:String(options.name||'—'),english:String(options.english||''),first:String(options.first||'—'),second:String(options.second||'—')};
  if(d.face==='back')back(ctx,d,h,p,theme);else if(theme==='noir')noirFront(ctx,d,h,p);else if(theme==='signature')forgeFront(ctx,d,h,p);else velocityFront(ctx,d,h,p);
  corners(ctx,h,p.line);
 }
 window.RideCardRenderer=Object.freeze({draw});
})();
