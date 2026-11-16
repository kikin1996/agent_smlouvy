const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function normalize(s){return s.replace(/\uFEFF/g,'').replace(/\r/g,'').replaceAll('\u00a0',' ').split('\n').map(l=>l.replace(/[\t ]+/g,' ').trim()).join('\n').replace(/\n{3,}/g,'\n\n').trim();}
function htmlText(s){s=s.slice(s.indexOf('<body>'));return normalize(s.replace(/<span class="article-no">([^<]*)<\/span>/g,'$1\n').replace(/<\/(?:h1|h2|p|div|li|section)>/g,'\n').replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'"));}
const version='v19';
const privateSourcesPresent=fs.existsSync(path.join(root,'Vzory smluv/najemni_vzor_extrakce.txt'))&&fs.existsSync(path.join(root,'Bohumín byt/04_Navrhy_smluv/Najemni_smlouva_Bohumin_'+version+'.html'))&&fs.existsSync(path.join(root,'Vzory smluv/rezervacni_vzor_extrakce.txt'))&&fs.existsSync(path.join(root,'Bohumín byt/04_Navrhy_smluv/Rezervacni_smlouva_Bohumin_'+version+'.html'));
const data=privateSourcesPresent?{}:JSON.parse(read('ui/demo.json'));
if(privateSourcesPresent)
for(const [key,kind,title,original]of [['rent','Najemni','Nájemní smlouva','Nájemní smlouva.doc'],['reservation','Rezervacni','Rezervační smlouva','rezervační smlouva.docx']]){
 const oldTxt=key==='rent'?'najemni_vzor_extrakce.txt':'rezervacni_vzor_extrakce.txt';
 const newStem=kind+'_smlouva_Bohumin_'+version;
 data[key]={title,originalName:original,proposalName:newStem+'.pdf',original:normalize(read('Vzory smluv/'+oldTxt)),proposal:htmlText(read('Bohumín byt/04_Navrhy_smluv/'+newStem+'.html')),originalFile:encodeURI('../Vzory smluv/'+original),proposalFile:encodeURI('../Bohumín byt/04_Navrhy_smluv/'+newStem+'.pdf')};
 if(!data[key].proposal.trim())throw Error('Missing proposal data');
}
data.version=privateSourcesPresent?version:'ukázka';
data.documents=[];
const profilePath='Bohumín byt/01_Byt/Souhrn_bytu_a_najmu_v03.json';
data.profile=privateSourcesPresent&&fs.existsSync(path.join(root,profilePath))?JSON.parse(read(profilePath)):null;
if(privateSourcesPresent)for(const [title,file,detail]of [
 ['Souhrn bytu a nájmu','01_Byt/Souhrn_bytu_a_najmu_v03.pdf','Byt, nájemce, pronajímatelé, inzerát a aktuální podmínky'],
 ['Nájemní smlouva','04_Navrhy_smluv/Najemni_smlouva_Bohumin_'+version+'.pdf','Aktuální návrh · bez předávacího protokolu'],
 ['Rezervační smlouva','04_Navrhy_smluv/Rezervacni_smlouva_Bohumin_'+version+'.pdf','Aktuální návrh'],
 ['Předávací protokol','04_Navrhy_smluv/Predavaci_protokol_Bohumin_'+version+'.pdf','Samostatný formulář · místo pro ruční zápisy'],
 ['List vlastnictví','01_Byt/LV_1731.pdf','Dodaný výpis ke dni 3. 8. 2026'],
 ['Evidenční list a služby','01_Byt/domsys_Evidencni_list_516_17_2026-08-07.pdf','Dodaný předpis ke dni 7. 8. 2026']
]){const relative='Bohumín byt/'+file;if(fs.existsSync(path.join(root,relative)))data.documents.push({title,detail,url:encodeURI('../'+relative),previewUrl:title==='Souhrn bytu a nájmu'?encodeURI('../'+relative.replace(/\.pdf$/,'.html')):undefined,filename:path.basename(file)});}
const html=read('ui/template.html').replaceAll('v10',privateSourcesPresent?version:'ukázka').replace('/* APP_STYLES */',read('ui/style.css')+'\n'+read('ui/mobile.css')+'\n'+read('ui/documents.css')).replace('/* CONTRACT_DATA */',JSON.stringify(data).replaceAll('<','\\u003c')).replace('/* APP_SCRIPT */',()=>read('ui/app.js'));
fs.writeFileSync(path.join(__dirname,'index.html'),html);
console.log(privateSourcesPresent?'Built local comparison from private documents.':'Built comparison with anonymous demonstration data.');
