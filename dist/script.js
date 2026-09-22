const searchItems = [
  {title:'Dad Jokes Vault',description:'A little humor, a lot of dad energy. Explore the project.',href:'#dad-jokes-vault',keywords:'dad father jokes humor funny comedy software work project'},
  {title:'Total Chaos',description:'One of Tony’s personal projects. A little wild by design.',href:'#total-chaos',keywords:'total chaos project work experiment building'},
  {title:'Devprompt',description:'An idea brought to life through code.',href:'#devprompt',keywords:'devprompt dev prompt developer software project code work'},
  {title:'The human behind the code',description:'Meet Tony: developer, family man, and father of two.',href:'#about',keywords:'about tony schaffert family father dad two kids children biography human developing'},
  {title:'Things I’ve built',description:'Explore all three featured projects.',href:'#work',keywords:'portfolio work projects developing software things built'}
];
const dialog = document.querySelector('#site-search');
const input = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const count = document.querySelector('#search-count');
function renderSearch(){
  const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = searchItems.filter(item => terms.every(term => `${item.title} ${item.description} ${item.keywords}`.toLocaleLowerCase().includes(term)));
  results.replaceChildren();
  count.textContent = terms.length ? `${matches.length} result${matches.length === 1 ? '' : 's'}` : 'EXPLORE THE SITE';
  for(const item of matches){
    const li=document.createElement('li');
    const a=document.createElement('a');
    a.href=item.href;
    const title=document.createElement('strong');title.textContent=item.title;
    const desc=document.createElement('p');desc.textContent=item.description;
    a.append(title,desc);
    a.addEventListener('click',()=>dialog.close());
    li.append(a);results.append(li);
  }
  if(!matches.length){const empty=document.createElement('li');empty.className='search-empty';empty.textContent='Nothing here yet. Try “projects”, “family”, or “dad jokes”.';results.append(empty);}
}
function openSearch(){if(dialog.open)return;input.value='';renderSearch();dialog.showModal();document.body.classList.add('search-open');input.focus();}
document.querySelector('.search-trigger').addEventListener('click',openSearch);
document.querySelector('.search-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('search-open'));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
input.addEventListener('input',renderSearch);
input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('a')?.focus();}if(event.key==='Enter'){const first=results.querySelector('a');if(first){dialog.close();location.hash=first.hash;}}});
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();dialog.open?dialog.close():openSearch();}});
if(!/Mac|iPhone|iPad/.test(navigator.platform))document.querySelector('.search-trigger kbd').textContent='Ctrl K';
document.querySelector('#year').textContent=new Date().getFullYear();
