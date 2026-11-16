(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('contract-data').textContent);
  const $ = id => document.getElementById(id);
  const state = {kind:'rent', index:-1, changes:[], cache:{}, query:''};
  const escape = s => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function diff(a,b) {
    const aa=a.match(/\S+\s*/g)||[], bb=b.match(/\S+\s*/g)||[];
    const n=aa.length,m=bb.length, width=m+1;
    const dp=new Uint16Array((n+1)*width);
    for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)
      dp[i*width+j]=aa[i].trim()===bb[j].trim()?dp[(i+1)*width+j+1]+1:Math.max(dp[(i+1)*width+j],dp[i*width+j+1]);
    let i=0,j=0,parts=[];
    const push=(type,left,right)=>{const prev=parts.at(-1);if(prev?.type===type){prev.left+=left;prev.right+=right;}else parts.push({type,left,right});};
    while(i<n||j<m){
      if(i<n&&j<m&&aa[i].trim()===bb[j].trim()){push('same',aa[i++],bb[j++]);}
      else if(i<n&&(j===m||dp[(i+1)*width+j]>=dp[i*width+j+1]))push('change',aa[i++],'');
      else push('change','',bb[j++]);
    }
    return parts;
  }
  function marked(text){
    if(!state.query)return escape(text);
    const needle=state.query.toLocaleLowerCase('cs'), hay=text.toLocaleLowerCase('cs');
    let result='',from=0,at;
    while((at=hay.indexOf(needle,from))>=0){result+=escape(text.slice(from,at))+'<mark class="search-hit">'+escape(text.slice(at,at+state.query.length))+'</mark>';from=at+state.query.length;}
    return result+escape(text.slice(from));
  }
  function render(){
    const item=data[state.kind];
    const parts=state.cache[state.kind] ||= diff(item.original,item.proposal);
    state.changes=[];let left='',right='';
    for(const part of parts){
      if(part.type==='same'){
        const l=$('only-changes').checked&&part.left.length>240?part.left.slice(0,100)+'\n\n··· nezměněný text ···\n\n'+part.left.slice(-100):part.left;
        const r=$('only-changes').checked&&part.right.length>240?part.right.slice(0,100)+'\n\n··· nezměněný text ···\n\n'+part.right.slice(-100):part.right;
        left+='<span class="unchanged">'+marked(l)+'</span>';right+='<span class="unchanged">'+marked(r)+'</span>';
      }else{
        const id=state.changes.length,type=part.left.trim()&&part.right.trim()?'replaced':part.left.trim()?'removed':'added';
        state.changes.push({...part,id,type});
        left+='<span tabindex="-1" data-change="'+id+'" class="diff '+type+'">'+marked(part.left)+'</span>';
        right+='<span tabindex="-1" data-change="'+id+'" class="diff '+type+'">'+marked(part.right)+'</span>';
      }
    }
    $('original-text').innerHTML=left;$('proposal-text').innerHTML=right;
    $('contract-title').textContent=item.title;$('change-total').textContent=state.changes.length;
    $('source-label').textContent=item.originalName;$('proposal-label').textContent=item.proposalName;
    $('original-file').href=item.originalFile;$('proposal-file').href=item.proposalFile;
    $('proposal-download').href=item.proposalFile;$('proposal-download').download=item.proposalName;
    $('change-list').innerHTML=state.changes.map(c=>'<button class="change-item" data-jump="'+c.id+'"><span class="change-number">'+String(c.id+1).padStart(2,'0')+'</span><span><small>'+({replaced:'Upraveno',removed:'Odstraněno',added:'Doplněno'}[c.type])+'</small><span class="snippet">'+escape((c.right.trim()||c.left.trim()).slice(0,95))+'</span></span><span class="change-dot '+c.type+'"></span></button>').join('');
    document.querySelectorAll('[data-kind]').forEach(b=>{b.classList.toggle('selected',b.dataset.kind===state.kind);b.setAttribute('aria-pressed',String(b.dataset.kind===state.kind));});
    state.index=-1;updateNavigation();
    $('empty-search').hidden=!state.query||!!document.querySelector('.search-hit');
    $('original-pane').scrollTop=0;$('proposal-pane').scrollTop=0;
  }
  function updateNavigation(){
    $('position').textContent=state.index<0?'Vyberte změnu':(state.index+1)+' / '+state.changes.length;
    $('previous').disabled=!state.changes.length;$('next').disabled=!state.changes.length;
    document.querySelectorAll('[data-change]').forEach(e=>e.classList.toggle('active',Number(e.dataset.change)===state.index));
    document.querySelectorAll('[data-jump]').forEach(e=>e.classList.toggle('active',Number(e.dataset.jump)===state.index));
  }
  function jump(index){
    if(!state.changes.length)return;
    state.index=(index+state.changes.length)%state.changes.length;updateNavigation();
    for(const id of ['original-pane','proposal-pane']){
      const pane=$(id),target=pane.querySelector('[data-change="'+state.index+'"]');
      if(target)pane.scrollTop+=target.getBoundingClientRect().top-pane.getBoundingClientRect().top-pane.clientHeight*.35;
    }
    $('change-list').querySelector('.active')?.scrollIntoView({block:'nearest'});
  }
  document.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{state.kind=b.dataset.kind;setView('compare');render();});
  $('previous').onclick=()=>jump(state.index<0?state.changes.length-1:state.index-1);
  $('next').onclick=()=>jump(state.index+1);
  $('change-list').onclick=e=>{const b=e.target.closest('[data-jump]');if(b)jump(Number(b.dataset.jump));};
  $('only-changes').onchange=render;
  let timer;$('search').oninput=e=>{clearTimeout(timer);timer=setTimeout(()=>{state.query=e.target.value.trim();render();const hit=$('proposal-pane').querySelector('.search-hit')||$('original-pane').querySelector('.search-hit');hit?.scrollIntoView({block:'center'});},180);};
  $('clear-search').onclick=()=>{clearTimeout(timer);$('search').value='';state.query='';render();$('search').focus();};
  let locked=false;
  for(const [a,b]of [['original-pane','proposal-pane'],['proposal-pane','original-pane']])$(a).addEventListener('scroll',()=>{
    if(locked||!$('sync-scroll').checked)return;locked=true;
    const ratio=$(a).scrollTop/Math.max(1,$(a).scrollHeight-$(a).clientHeight);
    $(b).scrollTop=ratio*($(b).scrollHeight-$(b).clientHeight);requestAnimationFrame(()=>locked=false);
  });
  document.addEventListener('keydown',e=>{if(e.target.matches('input'))return;if(e.key==='ArrowRight'){e.preventDefault();jump(state.index+1);}if(e.key==='ArrowLeft'){e.preventDefault();jump(state.index-1);}});
  let selectedDocument=-1;
  if(data.profile){
    const p=data.profile, money=n=>n.toLocaleString('cs-CZ')+' Kč';
    const card=(label,title,lines)=>'<article class="overview-card"><small>'+escape(label)+'</small><h3>'+escape(title)+'</h3>'+lines.map(l=>'<p>'+escape(l)+'</p>').join('')+'</article>';
    $('property-overview').innerHTML=card('Byt',p.property.address,[p.property.layout+' · '+p.property.floor+' · jednotka '+p.property.unit,p.property.cellar+' · '+p.property.parking,p.property.balcony+' balkon · plochy upřesněny v souhrnu'])+card('Nájemce',p.tenant.name,[p.tenant.address,'Telefon: '+p.tenant.phone,p.tenant.occupancy])+card('Nájem a platby',money(p.finance.total)+' / měsíc',[money(p.finance.rent)+' nájem + '+money(p.finance.services)+' služby',p.term.lease,'Jistota '+money(p.finance.deposit)+' · RK '+money(p.finance.commission)]);
    $('property-overview').hidden=false;
  }
  function selectDocument(index){
    const doc=data.documents?.[index];if(!doc)return;selectedDocument=index;
    $('preview-title').textContent=doc.title;$('preview-open').href=doc.url;
    $('preview-download').href=doc.url;$('preview-download').download=doc.filename;
    $('document-frame').src=doc.previewUrl||doc.url;
    document.querySelectorAll('[data-document]').forEach(el=>el.classList.toggle('active',Number(el.dataset.document)===index));
  }
  function setView(view){
    const library=view==='documents';$('main-content').classList.toggle('documents-mode',library);
    $('document-library').hidden=!library;$('view-compare').classList.toggle('selected',!library);$('view-documents').classList.toggle('selected',library);
    if(library){$('contract-title').textContent='Dokumenty bytu';if(selectedDocument<0&&data.documents?.length)selectDocument(0);}else $('contract-title').textContent=data[state.kind].title;
    const protocolSelected=library&&data.documents?.[selectedDocument]?.title==='Předávací protokol';
    $('sidebar-protocol').classList.toggle('selected',protocolSelected);$('sidebar-protocol').setAttribute('aria-pressed',String(protocolSelected));
    document.querySelectorAll('[data-kind]').forEach(b=>{const selected=!library&&b.dataset.kind===state.kind;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
  }
  $('sidebar-protocol').onclick=()=>{const index=(data.documents||[]).findIndex(d=>d.title==='Předávací protokol');if(index>=0)selectDocument(index);setView('documents');if(index>=0)$('contract-title').textContent='Předávací protokol';};
  $('view-compare').onclick=()=>setView('compare');$('view-documents').onclick=()=>setView('documents');
  $('document-list').innerHTML=(data.documents||[]).map((d,i)=>'<article class="document-card" data-document="'+i+'"><button data-preview="'+i+'">▤ '+escape(d.title)+'</button><p>'+escape(d.detail)+'</p><a href="'+escape(d.url)+'" download="'+escape(d.filename)+'">↓ Stáhnout PDF</a></article>').join('');
  $('document-list').onclick=e=>{const b=e.target.closest('[data-preview]');if(b)selectDocument(Number(b.dataset.preview));};
  $('no-documents').hidden=!!data.documents?.length;if(!data.documents?.length){$('document-frame').hidden=true;$('preview-open').hidden=true;$('preview-download').hidden=true;}
  render();if(location.hash==='#documents')setView('documents');document.documentElement.dataset.ready='true';
  if(location.search.includes('selftest=1')){
    const results=[];const assert=(test,message)=>{if(!test)throw Error(message);results.push(message);};
    try{
      for(const key of ['rent','reservation']){const parts=diff(data[key].original,data[key].proposal);assert(parts.map(p=>p.left).join('')===data[key].original,key+' original reconstruction');assert(parts.map(p=>p.right).join('')===data[key].proposal,key+' proposal reconstruction');}
      assert($('original-text').textContent===data.rent.original,'original displayed intact');
      assert($('proposal-text').textContent===data.rent.proposal,'proposal displayed intact');
      $('next').click();assert(state.index===0&&!!$('proposal-pane').querySelector('.diff.active'),'next change navigation');
      document.querySelector('[data-kind="reservation"]').click();assert(state.kind==='reservation'&&$('contract-title').textContent===data.reservation.title,'document switching');
      $('only-changes').checked=true;$('only-changes').dispatchEvent(new Event('change'));assert($('only-changes').checked&&document.querySelectorAll('.diff').length===state.changes.length*2,'context filter preserves all highlighted changes');
      $('only-changes').checked=false;state.query=data.reservation.proposal.match(/\S+/)[0];render();assert(!!document.querySelector('.search-hit'),'search highlighting');
      state.query='';state.kind='rent';render();
      if(data.documents?.length){$('view-documents').click();assert(!$('document-library').hidden&&$('document-frame').getAttribute('src')===(data.documents[0].previewUrl||data.documents[0].url),'document preview');assert($('preview-download').download===data.documents[0].filename,'download link');selectDocument(data.documents.length-1);assert($('preview-title').textContent===data.documents.at(-1).title,'document selection');$('sidebar-protocol').click();assert($('preview-title').textContent==='Předávací protokol'&&$('sidebar-protocol').classList.contains('selected'),'sidebar protocol navigation');assert($('preview-download').download.startsWith('Predavaci_protokol_'),'protocol download');$('view-compare').click();assert($('document-library').hidden,'return to comparison');}
      if(data.profile){assert($('property-overview').textContent.includes(data.profile.tenant.name),'tenant overview');assert(data.documents.some(d=>d.title==='Souhrn bytu a nájmu'),'consolidated summary document');}
      document.documentElement.dataset.selftest='passed';$('test-output').textContent=JSON.stringify({passed:results});
    }catch(e){document.documentElement.dataset.selftest='failed';$('test-output').textContent=String(e.stack);}
  }
})();
