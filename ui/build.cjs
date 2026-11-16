const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function normalize(s){return s.replace(/\uFEFF/g,'').replace(/\r/g,'').replaceAll('\u00a0',' ').split('\n').map(l=>l.replace(/[\t ]+/g,' ').trim()).join('\n').replace(/\n{3,}/g,'\n\n').trim();}
function htmlText(s){s=s.slice(s.indexOf('<body>'));return normalize(s.replace(/<span class="article-no">([^<]*)<\/span>/g,'$1\n').replace(/<\/(?:h1|h2|p|div|li|section)>/g,'\n').replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'"));}
const privateSourcesPresent=fs.existsSync(path.join(root,'Vzory smluv/najemni_vzor_extrakce.txt'))&&fs.existsSync(path.join(root,'Bohumín byt/04_Navrhy_smluv/Najemni_smlouva_Bohumin_v10.html'))&&fs.existsSync(path.join(root,'Vzory smluv/rezervacni_vzor_extrakce.txt'))&&fs.existsSync(path.join(root,'Bohumín byt/04_Navrhy_smluv/Rezervacni_smlouva_Bohumin_v10.html'));
const data=privateSourcesPresent?{}:JSON.parse(read('ui/demo.json'));
if(privateSourcesPresent)
for(const [key,kind,title,original]of [['rent','Najemni','Nájemní smlouva','Nájemní smlouva.doc'],['reservation','Rezervacni','Rezervační smlouva','rezervační smlouva.docx']]){
 const oldTxt=key==='rent'?'najemni_vzor_extrakce.txt':'rezervacni_vzor_extrakce.txt';
 const newStem=kind+'_smlouva_Bohumin_v10';
 data[key]={title,originalName:original,proposalName:newStem+'.pdf',original:normalize(read('Vzory smluv/'+oldTxt)),proposal:htmlText(read('Bohumín byt/04_Navrhy_smluv/'+newStem+'.html')),originalFile:encodeURI('../Vzory smluv/'+original),proposalFile:encodeURI('../Bohumín byt/04_Navrhy_smluv/'+newStem+'.pdf')};
 if(!data[key].proposal.trim())throw Error('Missing proposal data');
}
const html=read('ui/template.html').replace('/* APP_STYLES */',read('ui/style.css')+'\n'+read('ui/mobile.css')).replace('/* CONTRACT_DATA */',JSON.stringify(data).replaceAll('<','\\u003c')).replace('/* APP_SCRIPT */',()=>read('ui/app.js'));
fs.writeFileSync(path.join(__dirname,'index.html'),html);
console.log(privateSourcesPresent?'Built local comparison from private documents.':'Built comparison with anonymous demonstration data.');
