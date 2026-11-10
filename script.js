const courses = [
  {level:'licence',name:'Probabilités & Statistique',text:'Les fondements de l’aléatoire et de l’analyse statistique.',icon:'P(A)'},
  {level:'licence',name:'Modélisation statistique',text:'Enseignements de modélisation statistique avec R et SPSS.',icon:'R'},
  {level:'licence',name:'Analyse & Analyse numérique',text:'Méthodes mathématiques et outils de calcul numérique.',icon:'∫'},
  {level:'master',name:'Probabilités & Processus',text:'Compléments de probabilités et processus stochastiques.',icon:'Xₜ'},
  {level:'master',name:'Outils pour les probabilités',text:'Probabilités sous Mathematica et biostatistique sous SPSS.',icon:'σ'},
  {level:'master',name:'Deep Learning & IA',text:'Enseignements de deep learning et d’intelligence artificielle.',icon:'∇'},
  {level:'doctorat',name:'Formation doctorale',text:'Formation au PEDOC sur la période 2024–2026 et préparation de supports pour les doctorants.',icon:'∞'}
];
const labels={licence:'LICENCE',master:'MASTER',doctorat:'DOCTORAT'};
const container=document.querySelector('#courses');
function renderCourses(level='all'){
  container.replaceChildren(...courses.filter(course=>level==='all'||course.level===level).map(course=>{
    const card=document.createElement('article');
    card.className='course';
    const meta=document.createElement('div');meta.className='course-meta';
    const label=document.createElement('span');label.textContent=labels[course.level];
    const icon=document.createElement('span');icon.className='course-icon';icon.textContent=course.icon;icon.setAttribute('aria-hidden','true');
    meta.append(label,icon);
    const title=document.createElement('h3');title.textContent=course.name;
    const description=document.createElement('p');description.textContent=course.text;
    const status=document.createElement('span');status.className='course-status';status.textContent='Supports à venir';
    card.append(meta,title,description,status);return card;
  }));
}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  renderCourses(button.dataset.level);
}));
const menu=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');}
menu.addEventListener('click',()=>{const opened=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(opened));navigation.classList.toggle('open',opened);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.querySelector('#year').textContent=String(new Date().getFullYear());
renderCourses();
