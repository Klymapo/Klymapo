"use strict";

// Índice curado de proyectos PÚBLICOS. No añadir aquí nombres ni datos de repos privados.
// Estado = descripción editorial del proyecto, NO estado de CI ni seguimiento automático.
const CURATED = [
  {slug:"ATLAS",title:"ATLAS · Cuatro Voces",category:"apps",status:"Activo",description:"Aprendizaje multilingüe dentro de una aventura detectivesca: casos, vocabulario y control de calidad.",tags:["Idiomas","JavaScript","PWA"],icon:"文",tone:"purple",rank:1},
  {slug:"alth-meta",title:"ALTH-META / AlasTheo",category:"modelado",status:"Activo",description:"Producción de personajes y assets 3D estilizados, referencias, Blender y auditorías con COPOX.",tags:["Blender","Modelado 3D","COPOX"],icon:"⬡",tone:"blue",rank:2},
  {slug:"pokemon-infinito",title:"Pokémon Infinite",category:"videojuegos",status:"Activo",description:"Aventura RPG personal para móvil, con historia extensible y funcionamiento como aplicación web.",tags:["RPG","PWA","JavaScript"],icon:"◈",tone:"purple",rank:3},
  {slug:"rupert",title:"Rupert",category:"apps",status:"Activo",description:"Asistente personal con interfaz móvil y arquitectura en la nube, pensado para uso cotidiano.",tags:["Asistente","PWA","Supabase"],icon:"⌘",tone:"blue",rank:4},
  {slug:"ficha-dnd",title:"Ficha D&D",category:"videojuegos",status:"Herramienta",description:"Ficha interactiva de personaje para partidas de rol, diseñada para funcionar desde el navegador.",tags:["D&D","HTML","Rol"],icon:"⚄",tone:"gold",rank:5},
  {slug:"ALASTHEO",title:"ALASTHEO · Origen",category:"historico",status:"Histórico",description:"Repositorio histórico de AlasTheo. Su documentación de producción fue incorporada a ALTH-META.",tags:["Historial","AlasTheo","3D"],icon:"◷",tone:"purple",rank:6},
  {slug:"Klymapo",title:"Archivo de aprendizaje",category:"historico",status:"Histórico",description:"Terminal Adventure (Python) y Dungeon Meshi Delivery (HTML), preservados con sus archivos originales verificados.",tags:["Python","HTML","Aprendizaje"],icon:">_",tone:"gold",rank:7,url:"https://github.com/Klymapo/Klymapo/tree/main/archive/learning"}
];
const LABELS={all:"Todos",videojuegos:"Videojuegos",modelado:"Modelado 3D",apps:"Aplicaciones e IA",datos:"Data y portafolio",escritura:"Escritura",historico:"Archivo histórico"};
const OWNER="Klymapo", CACHE_KEY="klymapo_public_metadata_v1", FAV_KEY="klymapo_public_favorites_v1";
const FOUR_HOURS=4*60*60*1000;
const state={category:"all",favoritesOnly:false,query:"",sort:"featured",metadata:{},lastSync:0,favorites:[],view:"folders"};

function safeLoad(key,fallback){try{const value=JSON.parse(localStorage.getItem(key)||"null");return value===null?fallback:value;}catch{return fallback;}}
function safeSave(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Modo privado o almacenamiento deshabilitado: sesión sin persistencia */}}
const stored=safeLoad(CACHE_KEY,null);
if(stored && typeof stored==="object" && typeof stored.timestamp==="number" && stored.repos && typeof stored.repos==="object"){
  state.metadata=stored.repos;state.lastSync=stored.timestamp;
}
const viewPreference=safeLoad("klymapo_view_mode_v1","folders");
state.view=(viewPreference==="cards"?"cards":"folders");
const previousFavorites=safeLoad(FAV_KEY,[]);
state.favorites=Array.isArray(previousFavorites)?previousFavorites.filter(x=>typeof x==="string"&&CURATED.some(r=>r.slug===x)):[];
const $=id=>document.getElementById(id);
function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
function dateLabel(iso){if(!iso)return "Actividad no disponible";const d=new Date(iso);if(Number.isNaN(d.getTime()))return "Actividad no disponible";return "Actividad: "+new Intl.DateTimeFormat("es-MX",{day:"numeric",month:"short",year:"numeric"}).format(d);}
function projectUrl(repo){return repo.url||("https://github.com/"+OWNER+"/"+encodeURIComponent(repo.slug));}
function filtered(){
  let items=CURATED.filter(r=>{
    const matchesCategory=state.category==="all"||r.category===state.category;
    const matchesFavorites=!state.favoritesOnly||state.favorites.includes(r.slug);
    const haystack=[r.slug,r.title,r.description,LABELS[r.category],...r.tags].join(" ").toLocaleLowerCase("es");
    return matchesCategory&&matchesFavorites&&haystack.includes(state.query.toLocaleLowerCase("es"));
  });
  if(state.sort==="name")items.sort((a,b)=>a.title.localeCompare(b.title,"es"));
  else if(state.sort==="updated")items.sort((a,b)=>Date.parse(state.metadata[b.slug]?.pushed_at||"2000-01-01")-Date.parse(state.metadata[a.slug]?.pushed_at||"2000-01-01")||a.rank-b.rank);
  else items.sort((a,b)=>a.rank-b.rank);
  return items;
}
function buildCard(repo){
  const card=node("article","repo-card");
  const top=node("div","card-top");
  const icon=node("div","project-icon "+repo.tone,repo.icon);icon.setAttribute("aria-hidden","true");top.append(icon);
  const tools=node("div","card-tools");
  const pill=node("span","status-pill"+(repo.status==="Histórico"?" historical":repo.status==="Herramienta"?" tool":""),repo.status);
  tools.append(pill);
  const selected=state.favorites.includes(repo.slug);
  const star=node("button","favorite-button"+(selected?" on":""),selected?"★":"☆");
  star.type="button";star.setAttribute("aria-label",(selected?"Quitar de":"Añadir a")+" favoritos: "+repo.title);star.setAttribute("aria-pressed",String(selected));
  star.addEventListener("click",()=>toggleFavorite(repo.slug));tools.append(star);top.append(tools);card.append(top);
  card.append(node("h3","",repo.title));
  card.append(node("div","card-category",LABELS[repo.category].toUpperCase()));
  card.append(node("p","card-description",repo.description));
  const tags=node("div","tags");repo.tags.forEach(t=>tags.append(node("span","tag",t)));card.append(tags);
  const footer=node("div","card-footer");
  const info=state.metadata[repo.slug];
  footer.append(node("span","card-update",dateLabel(info?.pushed_at)));
  const link=node("a","card-action",repo.url?"Ver archivo ↗":"Ver repositorio ↗");link.href=projectUrl(repo);link.target="_blank";link.rel="noopener noreferrer";link.setAttribute("aria-label","Abrir "+repo.title+" en GitHub");footer.append(link);
  card.append(footer);return card;
}
const AREA_ORDER=["videojuegos","modelado","apps","historico","datos","escritura"];
const AREA_DESCRIPTIONS={
  videojuegos:"Aventuras, juegos de rol y herramientas de juego.",
  modelado:"Modelos, producción de assets y experimentación visual.",
  apps:"Aplicaciones, automatizaciones y herramientas inteligentes.",
  historico:"Primeros proyectos y fuentes preservadas. No se eliminan.",
  datos:"Proyectos de análisis y portafolio público.",
  escritura:"Proyectos literarios que se publiquen expresamente."
};
const AREA_SYMBOLS={videojuegos:"◇",modelado:"⬡",apps:"⌘",historico:"◷",datos:"◫",escritura:"✎"};
function buildFolder(cat,items){
  const section=node("section","folder-section");
  section.setAttribute("aria-label",LABELS[cat]);
  const head=node("div","folder-head");
  const caption=node("div","folder-caption");
  caption.append(node("span","folder-icon",AREA_SYMBOLS[cat]||"▦"));
  const info=node("div","folder-head-copy");
  info.append(node("h3","",LABELS[cat]));
  info.append(node("p","",AREA_DESCRIPTIONS[cat]));
  caption.append(info);head.append(caption);
  head.append(node("span","folder-count",items.length+" proyecto"+(items.length===1?"":"s")));
  section.append(head);
  const grid=node("div","cards-grid");grid.append(...items.map(buildCard));section.append(grid);
  return section;
}
function render(){
  const items=filtered(), grid=$("repo-grid");
  if(state.view==="folders"){
    const grouped=AREA_ORDER.filter(cat=>items.some(x=>x.category===cat)).map(cat=>buildFolder(cat,items.filter(x=>x.category===cat)));
    grid.className="repo-list folders-view";
    grid.replaceChildren(...grouped);
  }else{
    grid.className="repo-list cards-grid";
    grid.replaceChildren(...items.map(buildCard));
  }
  const folders=state.view==="folders";
  $("view-folders").classList.toggle("active",folders);
  $("view-cards").classList.toggle("active",!folders);
  $("view-folders").setAttribute("aria-pressed",String(folders));
  $("view-cards").setAttribute("aria-pressed",String(!folders));
  $("empty-state").classList.toggle("hidden",items.length!==0);
  $("results-count").textContent=items.length+" resultado"+(items.length===1?"":"s");
  $("metric-total").textContent=CURATED.filter(x=>x.slug!=="Klymapo").length;
  $("count-all").textContent=CURATED.length;
  $("metric-active").textContent=CURATED.filter(x=>x.status==="Activo").length;
  $("metric-archive").textContent=CURATED.filter(x=>x.status==="Histórico").length;
  $("metric-favorites").textContent=state.favorites.length;
  $("favorites-count").textContent=state.favorites.length;
  document.querySelectorAll("[data-category]").forEach(b=>{const active=state.category===b.dataset.category&&!state.favoritesOnly;b.classList.toggle("active",active);b.setAttribute("aria-current",active?"page":"false");});
  document.querySelectorAll("[data-chip]").forEach(b=>{const active=state.category===b.dataset.chip&&!state.favoritesOnly;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
  $("favorites-link").classList.toggle("active",state.favoritesOnly);
}
function setCategory(cat){state.category=cat;state.favoritesOnly=false;render();closeMenu();}
function toggleFavorite(slug){const idx=state.favorites.indexOf(slug);if(idx===-1)state.favorites.push(slug);else state.favorites.splice(idx,1);safeSave(FAV_KEY,state.favorites);render();}
function closeMenu(){$("sidebar").classList.remove("open");$("mobile-overlay").classList.add("hidden");$("menu-toggle").setAttribute("aria-expanded","false");}
function showMenu(){$("sidebar").classList.add("open");$("mobile-overlay").classList.remove("hidden");$("menu-toggle").setAttribute("aria-expanded","true");}
function displaySync(note){$("sync-label").textContent=note;}
async function refresh(force=false){
  if(!force&&state.lastSync&&Date.now()-state.lastSync<FOUR_HOURS){displaySync("GitHub · datos guardados");render();return;}
  const button=$("refresh-button");button.disabled=true;displaySync("Consultando GitHub…");
  try{
    // La API de usuarios devuelve únicamente los repositorios PÚBLICOS. No se usan tokens.
    const response=await fetch("https://api.github.com/users/"+OWNER+"/repos?type=owner&per_page=100&sort=updated",{headers:{Accept:"application/vnd.github+json"},cache:"no-store"});
    if(!response.ok)throw new Error("GitHub API "+response.status);
    const data=await response.json();if(!Array.isArray(data))throw new Error("Respuesta inesperada");
    const updated={};
    for(const item of data){if(item && item.private===false && typeof item.name==="string" && !item.archived /* archived still used for activity below */) {
      updated[item.name]={pushed_at:item.pushed_at||null,archived:Boolean(item.archived)};
    }else if(item && item.private===false && typeof item.name==="string"){
      updated[item.name]={pushed_at:item.pushed_at||null,archived:Boolean(item.archived)};
    }}
    state.metadata=updated;state.lastSync=Date.now();
    safeSave(CACHE_KEY,{timestamp:state.lastSync,repos:updated});
    displaySync("GitHub · información pública");
  }catch(err){displaySync(state.lastSync?"GitHub · datos guardados":"GitHub · modo sin conexión");}
  finally{button.disabled=false;render();}
}
document.querySelectorAll("[data-category]").forEach(x=>x.addEventListener("click",()=>setCategory(x.dataset.category)));
document.querySelectorAll("[data-chip]").forEach(x=>x.addEventListener("click",()=>setCategory(x.dataset.chip)));
$("favorites-link").addEventListener("click",()=>{state.favoritesOnly=true;state.category="all";render();closeMenu();});
$("search-input").addEventListener("input",e=>{state.query=e.target.value.trim();render();});
$("sort-select").addEventListener("change",e=>{state.sort=e.target.value;render();});
function setView(next){state.view=next;safeSave("klymapo_view_mode_v1",next);render();}
$("view-folders").addEventListener("click",()=>setView("folders"));
$("view-cards").addEventListener("click",()=>setView("cards"));
$("clear-filters").addEventListener("click",()=>{state.query="";$("search-input").value="";setCategory("all");});
$("refresh-button").addEventListener("click",()=>refresh(true));
$("explore-button").addEventListener("click",()=>document.getElementById("projects").scrollIntoView({behavior:"smooth",block:"start"}));
$("menu-toggle").addEventListener("click",()=>{$("sidebar").classList.contains("open")?closeMenu():showMenu();});
$("mobile-overlay").addEventListener("click",closeMenu);
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeMenu();
  if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();$("search-input").focus();}
});
render();refresh(false);
setInterval(()=>{if(Date.now()-state.lastSync>=FOUR_HOURS && document.visibilityState==="visible")refresh(false);},15*60*1000);
