const data = window.SITE_DATA;
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const levelNames = {licence:'Licence',master:'Master',doctorat:'Doctorat'};
const sizeLabel = document => `${document.pages} pages · PDF (${document.size.toLocaleString('fr-FR')} Mo)`;
const pdfIcon = document => {
 const kind=documentKind(document);
 const tone=kind==='examens'?'examens':kind==='td'||/corrig/.test(normalize(document.type+' '+document.title))?'td':'cours';
 return `<span class="pdf-icon" data-tone="${tone}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 12h6M9 16h4"/></svg><span>PDF</span></span>`;
};
function documentKind(document) {
 const type=normalize(document.type+' '+document.title);
 return /examen|controle/.test(type)?'examens':/\btd\b|\btp\b/.test(type)?'td':/diaporama/.test(type)?'diaporama':'cours';
}
function docRow(document) {
 return `<div class="document-row" data-resource="${documentKind(document)}">${pdfIcon(document)}<div class="document-body"><h4>${escapeHTML(document.title)}</h4><p class="document-meta">${escapeHTML(sizeLabel(document))}</p><div class="document-actions"><a href="${document.url}" target="_blank" rel="noopener noreferrer" aria-label="Consulter : ${escapeHTML(document.title)} (nouvel onglet)">Consulter ↗</a><a href="${document.url}" download aria-label="Télécharger : ${escapeHTML(document.title)}">Télécharger ↓</a></div>${document.note?`<p class="document-note">${escapeHTML(document.note)}</p>`:''}</div></div>`;
}
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(){ menu.setAttribute('aria-expanded','false'); nav.classList.remove('open'); }
menu.addEventListener('click',()=>{ const open=menu.getAttribute('aria-expanded')!=='true'; menu.setAttribute('aria-expanded',String(open)); nav.classList.toggle('open',open); });
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.querySelector('#year').textContent=String(new Date().getFullYear());
if(document.body.dataset.page==='accueil'){
 const selections=[[0,0],[0,2],[0,3],[2,0]];
 const labels=['Cours — Probabilités','TD — Probabilités','Examen — Probabilités','Cours — Modélisation'];
 document.querySelector('#featured-documents').innerHTML=selections.map(([moduleIndex,documentIndex],index)=>{
  const module=data.modules[moduleIndex], document=module.documents[documentIndex];
  return `<article class="featured-card"><div class="document-top">${pdfIcon(document)}<div><h3>${escapeHTML(labels[index])}</h3><p class="module-label">${escapeHTML(document.title)}</p></div></div><p class="document-meta"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H5v20h14V7l-5-5Z"/><path d="M14 2v6h5M8 12h8M8 16h6"/></svg> PDF (${document.size.toLocaleString('fr-FR')} Mo)</span><span>${document.pages} pages</span></p><a class="doc-open" href="${document.url}" target="_blank" rel="noopener noreferrer" aria-label="Consulter ${escapeHTML(document.title)} — ${escapeHTML(module.title)} (nouvel onglet)">Consulter le document <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg></a></article>`;
 }).join('');
}
if(document.body.dataset.page==='pedagogie'){
 let level='all';
 const resourceType=new URLSearchParams(location.search).get('type')||'all';
 const resourceMatches=doc=>resourceType==='all'||(resourceType==='cours'&&/Cours|Diaporama/i.test(doc.type))||(resourceType==='td'&&/TD|TP/.test(doc.type))||(resourceType==='examens'&&/Examen/i.test(doc.type))||(resourceType==='solutions'&&/corrig/i.test(doc.type+' '+doc.title));
 const input=document.querySelector('#course-search');
 const typeTitles={cours:'Cours et supports pédagogiques',td:'Travaux dirigés et pratiques',examens:'Examens et contrôles',solutions:'Solutions et corrigés détaillés'};

 nav.querySelectorAll('a').forEach(a=>{if(a.getAttribute('href')==='pedagogie.html'){a.classList.add('active');a.setAttribute('aria-current','page');}});
 const buttons=[...document.querySelectorAll('[data-level]')];
 function render(){
  const query=normalize(input.value.trim());
  const modules=data.modules.map(module=>({...module,documents:module.documents.filter(resourceMatches)})).filter(module=>module.documents.length>0&&(level==='all'||module.level===level)&&normalize([module.title,module.track,module.description,...module.documents.map(document=>document.title+' '+document.type)].join(' ')).includes(query));
  document.querySelector('#course-count').textContent=`${modules.length} module${modules.length>1?'s':''} · ${modules.reduce((count,module)=>count+module.documents.length,0)} documents disponibles`;
  document.querySelector('#courses-empty').hidden=modules.length>0;
  document.querySelector('#course-catalogue').innerHTML=Object.keys(levelNames).map(key=>{
   const group=modules.filter(module=>module.level===key);if(!group.length)return '';
   return `<section class="catalogue-level" id="${key}"><div class="catalogue-level-title"><span aria-hidden="true">${key==='licence'?'L':key==='master'?'M':'D'}</span><h2>${levelNames[key]}<small>${group.length} module${group.length>1?'s':''}</small></h2><svg class="level-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v6c4 3 8 3 12 0v-6M22 9v8"/></svg></div><div class="module-grid">${group.map(module=>`<article class="module-card" id="${module.id}"><div class="module-heading"><p class="module-track">${escapeHTML(module.track)}</p><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.description)}</p></div><div class="module-documents">${module.documents.map(docRow).join('')}</div></article>`).join('')}</div></section>`;
  }).join('');
  buttons.forEach(button=>{const active=button.dataset.level===level;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 }
 buttons.forEach(button=>button.addEventListener('click',()=>{level=button.dataset.level;render();history.replaceState(null,'',level==='all'?location.pathname:'#'+level);}));
 input.addEventListener('input',render);
 document.querySelector('#reset-courses').addEventListener('click',()=>{level='all';input.value='';history.replaceState(null,'',location.pathname);render();input.focus();});
 function applyHash(){const hash=location.hash.slice(1);level=Object.hasOwn(levelNames,hash)?hash:'all';render();}
 window.addEventListener('hashchange',applyHash);applyHash();
}
if(document.body.dataset.page==='recherche'){
 const yearSelect=document.querySelector('#publication-year');
 document.querySelector('#publication-total').textContent=`${data.publications.length} articles`;
 [...new Set(data.publications.map(publication=>publication.year))].sort((a,b)=>b-a).forEach(year=>{const option=document.createElement('option');option.value=String(year);option.textContent=String(year);yearSelect.append(option);});
 const input=document.querySelector('#publication-search');
 function render(){
  const query=normalize(input.value.trim());
  const publications=data.publications.filter(publication=>(yearSelect.value==='all'||String(publication.year)===yearSelect.value)&&normalize(publication.title+' '+publication.authors+' '+publication.journal).includes(query));
  document.querySelector('#publication-count').textContent=`${publications.length} publication${publications.length>1?'s':''} · de la plus récente à la plus ancienne`;
  document.querySelector('#publications-empty').hidden=publications.length>0;
  const years=[...new Set(publications.map(publication=>publication.year))].sort((a,b)=>b-a);
  document.querySelector('#publication-list').innerHTML=years.map(year=>{
   const group=publications.filter(publication=>publication.year===year);
   return `<section class="publication-year-group" aria-labelledby="pub-year-${year}"><div class="publication-group-heading"><h3 id="pub-year-${year}">${year}</h3><span>${group.length} article${group.length>1?'s':''}</span></div><div class="publication-year-grid">${group.map(publication=>`<article class="publication"><div class="publication-content"><h4>${escapeHTML(publication.title)}</h4><p class="publication-authors">${escapeHTML(publication.authors)}</p><p class="publication-journal">${escapeHTML(publication.journal)}${publication.details?' · '+escapeHTML(publication.details):''}</p></div><a class="doi-link" href="${escapeHTML(publication.doi ? 'https://doi.org/'+publication.doi : publication.url)}" target="_blank" rel="noopener noreferrer" aria-label="Voir l’article : ${escapeHTML(publication.title)} (nouvel onglet)">Article <span aria-hidden="true">↗</span></a></article>`).join('')}</div></section>`;
  }).join('');
 }
 yearSelect.addEventListener('change',render);input.addEventListener('input',render);render();
 document.querySelector('#thesis-total').textContent=`${data.theses.length} thèses`;
 document.querySelector('#thesis-list').innerHTML=data.theses.map(thesis=>`<article class="thesis-card" data-status="${thesis.status.startsWith('Soutenue')?'completed':'ongoing'}"><span class="thesis-status">${escapeHTML(thesis.status)}</span><h3>${escapeHTML(thesis.name)}</h3><p class="thesis-title">${escapeHTML(thesis.title)}</p></article>`).join('');
}
