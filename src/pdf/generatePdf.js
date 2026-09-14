import { jsPDF } from "jspdf";

const PAGE_W=210, PAGE_H=297, M=16, CONTENT_W=PAGE_W-(M*2), BLACK=[22,22,22], GREY=[92,92,92], YELLOW=[255,220,0], LIGHT=[244,244,244];

// jsPDF's built-in Helvetica font is WinAnsi based and does not reliably
// render every Unicode glyph. Normalise only glyphs that are known to break
// in the generated PDF while preserving German umlauts and punctuation.
function pdfSafe(v="") {
  return String(v)
    .replace(/\u00ad/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/[‐‑‒]/g, "-");
}

const clean=(v="")=>pdfSafe(v).replace(/[\t ]+/g," ").trim();
const cleanMultiline=(v="")=>pdfSafe(v)
  .split(/\r?\n/)
  .map(line=>line.replace(/[\t ]+/g," ").trim())
  .join("\n")
  .trim();

async function assetToDataUrl(path){if(!path)return null;try{const r=await fetch(path);if(!r.ok)throw new Error(path);const b=await r.blob();return await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(b);});}catch(e){console.warn("PDF asset skipped",path,e);return null;}}
function setText(doc,size=10,style="normal",color=BLACK){doc.setFont("helvetica",style);doc.setFontSize(size);doc.setTextColor(...color);}
function header(doc,state,logo,label){doc.setFillColor(...YELLOW);doc.rect(0,0,PAGE_W,4,"F");if(logo)try{doc.addImage(logo,undefined,M,9,18,18,undefined,"FAST");}catch{}setText(doc,7.8,"bold",GREY);doc.text(clean(label||"MED.I.SCROLL").toUpperCase(),M+24,16);setText(doc,7.4,"normal",GREY);doc.text(String(state.pageNo).padStart(2,"0"),PAGE_W-M,16,{align:"right"});}
function addPage(doc,state,logo,label){if(state.started)doc.addPage();else state.started=true;state.pageNo+=1;header(doc,state,logo,label);return 36;}
function ensure(doc,state,y,needed,logo,label){if(y+needed>PAGE_H-18){return addPage(doc,state,logo,label);}return y;}

function wrappedLines(doc,text,width){
  const source=cleanMultiline(text);
  if(!source)return [];
  const lines=[];
  source.split("\n").forEach((paragraph,index)=>{
    if(paragraph){
      const wrapped=doc.splitTextToSize(paragraph,width);
      lines.push(...wrapped);
    }
    if(index<source.split("\n").length-1)lines.push("");
  });
  return lines;
}

function paragraph(doc,state,text,y,logo,label,opts={}){
  if(!text)return y;
  const size=opts.size??10.2,lineHeight=opts.lineHeight??5.1,indent=opts.indent??0,width=opts.width??CONTENT_W-indent,style=opts.style??"normal",color=opts.color??BLACK;
  y+=opts.before??0;
  setText(doc,size,style,color);
  for(const line of wrappedLines(doc,text,width)){
    if(line===""){
      y=ensure(doc,state,y,lineHeight+1,logo,label);
      y+=lineHeight*.7;
      continue;
    }
    y=ensure(doc,state,y,lineHeight+1,logo,label);
    doc.text(line,M+indent,y);
    y+=lineHeight;
  }
  return y+(opts.after??3.2);
}

function linkParagraph(doc,state,text,url,y,logo,label,opts={}){
  if(!text)return y;
  const size=opts.size??7.4,lineHeight=opts.lineHeight??3.9,indent=opts.indent??4,width=opts.width??CONTENT_W-indent,color=opts.color??[60,90,140];
  y+=opts.before??0;
  setText(doc,size,"normal",color);
  const lines=wrappedLines(doc,text,width);
  for(const line of lines){
    if(!line)continue;
    y=ensure(doc,state,y,lineHeight+1,logo,label);
    try{
      doc.textWithLink(line,M+indent,y,{url});
    }catch{
      doc.text(line,M+indent,y);
      try{doc.link(M+indent,y-lineHeight*.8,Math.min(doc.getTextWidth(line),width),lineHeight,{url});}catch{}
    }
    y+=lineHeight;
  }
  return y+(opts.after??2);
}

function heading(doc,state,text,y,logo,label,level=3){if(!text)return y;const size=level===2?14:11.4;y=ensure(doc,state,y,12,logo,label);setText(doc,size,"bold",BLACK);const lines=doc.splitTextToSize(clean(text),CONTENT_W);doc.text(lines,M,y);return y+lines.length*(level===2?6.4:5.3)+2.5;}
function bulletList(doc,state,items=[],y,logo,label,numbered=false){items.forEach((item,index)=>{const prefix=numbered?`${index+1}.`:"•",lines=doc.splitTextToSize(clean(item),CONTENT_W-10);y=ensure(doc,state,y,Math.max(8,lines.length*5+3),logo,label);setText(doc,10.1,numbered?"bold":"normal",numbered?YELLOW:BLACK);doc.text(prefix,M,y);setText(doc,10.1,"normal",BLACK);doc.text(lines,M+8,y);y+=lines.length*5.05+3.3;});return y;}
function quoteBox(doc,state,text,y,logo,label,attribution){if(!text)return y;const lines=doc.splitTextToSize(clean(text),CONTENT_W-14),h=Math.max(20,lines.length*5+(attribution?12:8));y=ensure(doc,state,y,h+5,logo,label);doc.setFillColor(...LIGHT);doc.roundedRect(M,y,CONTENT_W,h,3,3,"F");doc.setFillColor(...YELLOW);doc.rect(M,y,2.5,h,"F");setText(doc,9.8,"normal",BLACK);doc.text(lines,M+7,y+7);if(attribution){setText(doc,8.6,"bold",GREY);doc.text(`– ${clean(attribution)}`,M+7,y+h-5);}return y+h+5;}
function noteBox(doc,state,text,y,logo,label){if(!text)return y;const lines=doc.splitTextToSize(clean(text),CONTENT_W-12),h=Math.max(17,lines.length*4.8+9);y=ensure(doc,state,y,h+4,logo,label);doc.setFillColor(255,249,215);doc.roundedRect(M,y,CONTENT_W,h,3,3,"F");setText(doc,9.4,"normal",BLACK);doc.text(lines,M+6,y+6.5);return y+h+4;}
function chapterTitle(doc,page,y){setText(doc,8.5,"bold",YELLOW);doc.text(clean(`${page.number||""}  ${page.kicker||page.nav||""}`).toUpperCase(),M,y);y+=8;setText(doc,page.kind==="hero"?28:22,"bold",BLACK);const lines=doc.splitTextToSize(clean(page.title||page.nav),CONTENT_W);doc.text(lines,M,y);y+=lines.length*(page.kind==="hero"?11:8.6)+3;if(page.subtitle){setText(doc,11.5,"normal",GREY);const sub=doc.splitTextToSize(clean(page.subtitle),CONTENT_W);doc.text(sub,M,y);y+=sub.length*5.8+4;}return y;}
function addImage(doc,data,y,maxH=68){if(!data)return y;try{const props=doc.getImageProperties(data),ratio=props.width/props.height;let w=CONTENT_W,h=w/ratio;if(h>maxH){h=maxH;w=h*ratio;}doc.addImage(data,props.fileType||undefined,M+(CONTENT_W-w)/2,y,w,h,undefined,"FAST");return y+h+7;}catch{return y;}}

function estimateTextHeight(doc,text,size=10.1,width=CONTENT_W-10,lineHeight=5.05){
  setText(doc,size,"normal",BLACK);
  return doc.splitTextToSize(clean(text),width).length*lineHeight;
}

function renderAccordionItems(doc,state,page,y,logo,label){
  for(const item of page.accordionItems||[]){
    const teaser=[].concat(item.teaser||[]).filter(Boolean);
    const answers=[].concat(item.answer||[]).filter(Boolean);
    const estimated=12 + teaser.reduce((sum,t)=>sum+estimateTextHeight(doc,t,9.6,CONTENT_W,4.8)+3,0) + answers.reduce((sum,t)=>sum+estimateTextHeight(doc,t,9.6,CONTENT_W,4.8)+3,0) + 12;
    y=ensure(doc,state,y,Math.min(estimated,65),logo,label);
    y=heading(doc,state,item.heading,y,logo,label);
    for(const teaserText of teaser)y=paragraph(doc,state,teaserText,y,logo,label,{size:9.6,lineHeight:4.8,after:2});
    if(answers.length){
      setText(doc,8.8,"bold",YELLOW);
      y=ensure(doc,state,y,7,logo,label);
      doc.text("ANTWORT",M,y);
      y+=5.2;
      for(const answerText of answers)y=paragraph(doc,state,answerText,y,logo,label,{size:9.6,lineHeight:4.8,after:3});
    }
  }
  return y;
}

async function renderChapter(doc,state,page,project,logo,cache){
  let y=addPage(doc,state,logo,project.meta.eyebrow);
  y=chapterTitle(doc,page,y);
  const chapterImage=page.inlineImage||page.poster||page.background;
  if(chapterImage){
    const d=cache.get(chapterImage);
    if(d){
      const maxImageH=page.kind==="stats"?58:(page.zoomable?80:60);
      y=ensure(doc,state,y,maxImageH+5,logo,page.nav);
      y=addImage(doc,d,y,maxImageH);
    }
  }
  const label=page.nav||page.title;

  if(page.kind==="hero"){
    if(page.quote)y=quoteBox(doc,state,page.quote,y,logo,label,page.attribution);
    return;
  }

  if(page.kind==="stats"){
    for(const stat of page.stats||[]){
      y=ensure(doc,state,y,19,logo,label);
      doc.setFillColor(...LIGHT);
      doc.roundedRect(M,y,CONTENT_W,16,3,3,"F");
      setText(doc,16,"bold",BLACK);doc.text(clean(stat.value),M+5,y+7);
      setText(doc,9.2,"normal",GREY);doc.text(doc.splitTextToSize(clean(stat.label),CONTENT_W-45),M+38,y+6.2);
      y+=20;
    }
    if(page.quote)y=quoteBox(doc,state,page.quote,y,logo,label);
    if(page.bullets)y=bulletList(doc,state,page.bullets,y,logo,label);
    return;
  }

  if(page.kind==="steps"){
    if(page.intro)y=paragraph(doc,state,page.intro,y,logo,label);
    for(let index=0;index<(page.steps||[]).length;index++){
      const step=page.steps[index];
      const estimated=12+(step.items||[]).reduce((sum,item)=>sum+estimateTextHeight(doc,item)+4,0)+(step.quote?18:0);
      y=ensure(doc,state,y,Math.min(estimated,55),logo,label);
      y=heading(doc,state,`Schritt ${index+1} · ${step.title}`,y,logo,label);
      if(step.items)y=bulletList(doc,state,step.items,y,logo,label);
      if(step.quote)y=quoteBox(doc,state,step.quote,y,logo,label);
    }
    if(page.quote)y=quoteBox(doc,state,page.quote,y,logo,label);
    return;
  }

  if(page.kind==="sources"){
    project.sources.forEach((s,i)=>{
      y=paragraph(doc,state,`[${i+1}] ${s.text}`,y,logo,label,{size:8.7,lineHeight:4.4,after:2});
      if(s.url)y=linkParagraph(doc,state,s.url,s.url,y,logo,label,{size:7.4,lineHeight:3.9,color:[60,90,140],indent:4,after:2});
    });
    return;
  }

  if(page.kind==="video"){
    if(page.subtitle)y=paragraph(doc,state,page.subtitle,y,logo,label);
    if(page.poster)y=addImage(doc,cache.get(page.poster),y,105);
    return;
  }

  if(page.kind==="imprint"){
    const i=project.imprint;
    if(i.brandHeading)y=heading(doc,state,i.brandHeading,y,logo,label);
    y=heading(doc,state,i.editorialHeading,y,logo,label);
    y=paragraph(doc,state,`${i.editorialRoleLabel||"Redaktion"}:\n${i.editorialName}\n${i.company}\n${i.street}\n${i.city}\n${i.editorialEmail||i.email}`,y,logo,label);
    y=heading(doc,state,"Herausgeber und verantwortlicher Diensteanbieter",y,logo,label);
    y=paragraph(doc,state,`${i.company}\n${i.street}\n${i.city}\nTelefon: ${i.phone}\nE-Mail: ${i.email}`,y,logo,label);
    y=heading(doc,state,"Unternehmensangaben",y,logo,label);
    y=paragraph(doc,state,`Vertreten durch: ${i.representatives}\nHandelsregister: ${i.register}\nUSt-IdNr.: ${i.vatId}`,y,logo,label);
    y=heading(doc,state,"Verantwortlich für journalistisch-redaktionelle Inhalte",y,logo,label);
    y=paragraph(doc,state,`gemäß § 18 Abs. 2 MStV:\n${i.responsibleEditorial}\n${i.company}\n${i.street}\n${i.city}`,y,logo,label);
    if(i.sponsoring){
      y=heading(doc,state,i.sponsoring.heading,y,logo,label);
      y=paragraph(doc,state,i.sponsoring.text,y,logo,label);
      if(i.sponsoring.note)y=paragraph(doc,state,i.sponsoring.note,y,logo,label,{size:8.8,color:GREY});
    }
    y=heading(doc,state,"Bildnachweise",y,logo,label);
    paragraph(doc,state,i.imageCredits.join("\n"),y,logo,label);
    return;
  }

  if(page.kind==="cta"){
    for(const p of page.paragraphs||[])y=paragraph(doc,state,p,y,logo,label);
    if(page.badges?.length)y=bulletList(doc,state,page.badges,y,logo,label);
    if(page.bullets)y=bulletList(doc,state,page.bullets,y,logo,label);
    if(page.primaryCta?.url){
      y=heading(doc,state,page.primaryCta.label,y,logo,label);
      y=linkParagraph(doc,state,page.primaryCta.url,page.primaryCta.url,y,logo,label,{size:8.4,color:[60,90,140],indent:0});
    }
    if(page.note)y=noteBox(doc,state,page.note,y,logo,label);
    return;
  }

  for(const p of page.paragraphs||[])y=paragraph(doc,state,p,y,logo,label);
  if(page.heading)y=heading(doc,state,page.heading,y,logo,label);
  if(page.bullets)y=bulletList(doc,state,page.bullets,y,logo,label);
  if(page.numbered)y=bulletList(doc,state,page.numbered,y,logo,label,true);
  for(const p of page.paragraphsAfter||[])y=paragraph(doc,state,p,y,logo,label);

  if(page.accordionItems?.length){
    y=renderAccordionItems(doc,state,page,y,logo,label);
  }else{
    for(const block of page.blocks||[]){
      y=heading(doc,state,block.heading,y,logo,label);
      if(block.text)y=paragraph(doc,state,block.text,y,logo,label);
    }
  }

  if(page.quote)y=quoteBox(doc,state,page.quote,y,logo,label);
  if(page.note)y=noteBox(doc,state,page.note,y,logo,label);
}

function downloadBlob(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;a.rel="noopener";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}

export async function generateProjectPdf({project,onProgress}={}){
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true,putOnlyUsedFonts:true});
  doc.setProperties({title:project.meta.title,subject:project.meta.pdfSubject||project.meta.eyebrow,author:project.meta.pdfAuthor||project.imprint.company,creator:"Gelbe Liste med.i.scroll"});
  onProgress?.(5);
  const logo=await assetToDataUrl(project.meta.logo);
  const paths=[...new Set(project.pages.flatMap(p=>[p.background,p.inlineImage,p.poster].filter(Boolean)))],cache=new Map();
  for(let i=0;i<paths.length;i++){
    cache.set(paths[i],await assetToDataUrl(paths[i]));
    onProgress?.(8+Math.round(((i+1)/Math.max(paths.length,1))*27));
  }
  const state={started:false,pageNo:0};
  for(let i=0;i<project.pages.length;i++){
    await renderChapter(doc,state,project.pages[i],project,logo,cache);
    onProgress?.(35+Math.round(((i+1)/project.pages.length)*55));
  }
  onProgress?.(94);
  const blob=doc.output("blob");
  downloadBlob(blob,project.meta.pdfFileName||"med-i-scroll.pdf");
  onProgress?.(100);
  return{pages:doc.getNumberOfPages(),size:blob.size};
}
