/* Valle de Santa Aurelia — dependency-free living atlas.
   Local-first editing; exported JSON is the portable archive.
   External HTML is never trusted or interpreted from editable entry content. */
(function () {
"use strict";
const STORAGE_KEY="santa-aurelia-living-atlas-v1";
const CATEGORIES=["Region","Settlement","Location","Landmark","Person","Family","Organization","Community","Culture","Species","Geology","Event","Myth","Artifact","Institution","Document","Religion","Language","Other"];
const ICONS={Region:"◇",Settlement:"♜",Location:"♧",Landmark:"◈",Person:"♙",Family:"♧",Organization:"⌘",Community:"♜",Culture:"❖",Species:"❧",Geology:"◆",Event:"◷",Myth:"✧",Artifact:"⚒",Institution:"▦",Document:"▤",Religion:"✥",Language:"⌁",Other:"•"};
let data=loadData(),view="home",activeFilter="All",searchText="",activeEntry=null;
const extraViews={};
const $=(s)=>document.querySelector(s);
const $$=(s)=>Array.from(document.querySelectorAll(s));
const esc=(value)=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const normalize=s=>String(s||"").trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const entries=()=>data.entries;
function loadData(){
  try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));if(isValid(x))return x;}catch(e){console.warn("Could not read local archive",e);}
  return structuredClone(window.SANTA_AURELIA_SEED);
}
function isValid(d){return !!(d&&d.version===1&&Array.isArray(d.entries)&&Array.isArray(d.timeline)&&d.entries.length<=5000&&d.entries.every(e=>e&&typeof e.id==="string"&&typeof e.title==="string"&&typeof e.body==="string"&&Array.isArray(e.links)&&Array.isArray(e.tags)));}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));return true}catch(e){toast("Browser storage failed. Export a JSON backup.");return false;}}
function getEntry(q){const target=String(q??"").trim().toLowerCase();return entries().find(e=>e.id.toLowerCase()===target)||entries().find(e=>e.title.toLowerCase()===target)||entries().find(e=>normalize(e.title)===normalize(target));}
function getLinks(e){return [...new Set((e.links||[]).map(getEntry).filter(Boolean).map(x=>x.id))].map(id=>getEntry(id));}
function backlinks(e){return entries().filter(other=>other.id!==e.id&&((other.links||[]).some(link=>getEntry(link)?.id===e.id)||Array.from((other.body||"").matchAll(/\[\[([^\]]+)\]\]/g)).some(m=>getEntry(m[1].split("|")[0])?.id===e.id)));}
function categoryLabel(c){return ICONS[c]||"•";}
function statusLabel(s){return ({established:"Established",working:"Working canon",provisional:"Provisional",legend:"Folklore / account"})[s]||"Working canon";}
function linkTo(id){location.hash="#/entry/"+encodeURIComponent(id);}
function toast(msg){const e=$("#toast");e.textContent=msg;e.classList.remove("hidden");clearTimeout(toast.timer);toast.timer=setTimeout(()=>e.classList.add("hidden"),3300);}
function articleInline(s){
  let result="",pos=0;
  const re=/\[\[([^\]]+)\]\]/g;
  for(const m of s.matchAll(re)){
    result+=formatEmphasis(s.slice(pos,m.index));
    const [ref,label]=m[1].split("|");
    const target=getEntry(ref);
    result+=target?'<a class="inline-link" href="#/entry/'+encodeURIComponent(target.id)+'">'+esc(label||target.title)+'</a>':esc(label||ref);
    pos=m.index+m[0].length;
  }
  return result+formatEmphasis(s.slice(pos));
}
function formatEmphasis(s){return esc(s).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");}
function renderBody(body){
 return String(body||"").split(/\n\s*\n/).map(block=>{
   const lines=block.trim().split("\n");
   if(lines[0].startsWith("## "))return "<h3>"+articleInline(lines[0].slice(3))+"</h3>"+(lines.length>1?"<p>"+lines.slice(1).map(articleInline).join("<br>")+"</p>":"");
   return "<p>"+lines.map(articleInline).join("<br>")+"</p>";
 }).join("");
}
function card(e){return '<a class="entry-card" href="#/entry/'+encodeURIComponent(e.id)+'"><span class="card-overline">'+esc(categoryLabel(e.category)+" "+e.category)+' · '+esc(e.era||"")+'</span><h3>'+esc(e.title)+'</h3><p>'+esc(e.summary||"No description yet.")+'</p><span class="card-footer">'+esc(statusLabel(e.status))+'<span class="arrow">↗</span></span></a>';}
function setCrumb(text){$("#crumbs").innerHTML="THE ATLAS <span>/</span> "+esc(text.toUpperCase());}
function updateSide(){
 $("#countNav").textContent=entries().length;
 $("#footerCount").textContent=entries().length+" INDEXED ARTICLES";
 $("#categoryNav").innerHTML=CATEGORIES.filter(c=>entries().some(e=>e.category===c)).map(c=>{
 const count=entries().filter(e=>e.category===c).length;
 return '<button class="cat-item '+(activeFilter===c&&view==="library"?"active":"")+'" data-cat="'+esc(c)+'"><span class="dot"></span>'+esc(c)+'<span class="count">'+count+"</span></button>";
 }).join("");
 $$(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
}
function showHome(){
 setCrumb("Overview");
 const featured=["santa-aurelia","willowwick","witchwood","fairy-stones","festival","blacksilver"].map(getEntry).filter(Boolean);
 $("#content").innerHTML='<section class="hero"><div class="hero-content"><span class="eyebrow">AN ATLAS OF PLACE, PEOPLE & MEMORY · OREGON COAST</span><h1>Valle de <i>Santa Aurelia</i></h1><div class="subtitle">Where the forest meets the sea, and every stone holds a story.</div><p>Explore the Jewel of the Pacific, the Garden City of the Lower Columbia, and the ancient woodland country between them. An interlinked, evolving encyclopedia of the valley’s history, communities, landscapes, and legends.</p><div class="hero-actions"><button class="button button-gold" data-go="library">Explore the encyclopedia ↗</button><button class="button outline-gold" data-go="map">View regional atlas ◇</button></div></div></section>'+
 '<section class="section"><div class="stat-row"><div class="stat"><b>1608</b><small>Spanish port founded</small></div><div class="stat"><b>19,000</b><small>Santa Aurelia · approx.</small></div><div class="stat"><b>21,000</b><small>Willowwick Grove · approx.</small></div><div class="stat"><b>'+entries().length+'</b><small>Linked archive entries</small></div></div></section>'+
 '<section class="section"><div class="section-header"><div><span class="eyebrow">CURATED PATHWAYS</span><h2>Discover the valley</h2><p>Places, people, legends, and living heritage.</p></div><button class="text-link" data-go="library">View all articles ↗</button></div><div class="cards">'+featured.map(card).join("")+'</div></section>'+
 '<section class="section"><div class="section-header"><div><span class="eyebrow">A LIVING PLACE</span><h2>Two cities. Centuries of stories.</h2></div></div><div class="feature-two"><div class="feature-panel"><span class="eyebrow">THE JEWEL OF THE PACIFIC</span><h3>Santa Aurelia</h3><p>An ancient Columbia River port of Spanish–Indigenous roots and Venetian maritime splendor. Explore the founding romance, the waterfront festival, and its preserved flagship.</p><button class="text-link" data-entry="santa-aurelia">Enter the harbor ↗</button></div><div class="feature-panel"><span class="eyebrow">THE GARDEN CITY</span><h3>Willowwick Grove</h3><p>A former mining colony transformed into a lush Victorian city of ornamental gardens, theater, stonecraft, and old-money estates.</p><button class="text-link" data-entry="willowwick">Walk the gardens ↗</button></div></div></section>';
}
function showLibrary(){
 setCrumb("Encyclopedia");
 const all=entries().filter(e=>(activeFilter==="All"||e.category===activeFilter)&&(!searchText||[e.title,e.summary,e.body,e.category,...e.tags].join(" ").toLowerCase().includes(searchText.toLowerCase())));
 $("#content").innerHTML='<div class="page"><div class="page-head"><span class="eyebrow">THE INDEX OF ALL THINGS</span><h1>Encyclopedia</h1><p>A searchable knowledge base spanning geography, people, heritage, folklore, ecology, and events. Use internal links to follow the story wherever it leads.</p></div><div class="toolbar"><button class="filter-chip '+(activeFilter==="All"?"selected":"")+'" data-filter="All">All entries · '+entries().length+'</button>'+CATEGORIES.filter(c=>entries().some(e=>e.category===c)).map(c=>'<button class="filter-chip '+(activeFilter===c?"selected":"")+'" data-filter="'+esc(c)+'">'+esc(c)+'</button>').join("")+'</div><p class="muted">'+all.length+' entries found'+(searchText?' for “'+esc(searchText)+'”':"")+'</p><div class="cards">'+(all.length?all.map(card).join(""):'<div class="empty">No entries match your filters. Try another category or search term.</div>')+'</div></div>';
}
function showEntry(e){
 if(!e){location.hash="#/library";return;}
 activeEntry=e.id;setCrumb(e.category+" / "+e.title);
 const genealogyPerson=data.genealogy?.people?.find(p=>p.entryId===e.id);
 const related=getLinks(e),back=backlinks(e);
 $("#content").innerHTML='<div class="page"><div class="entry-layout"><article><header class="article-header"><span class="eyebrow">'+esc(categoryLabel(e.category)+" "+e.category)+' / VALLE DE SANTA AURELIA</span><h1>'+esc(e.title)+'</h1><div class="article-subtitle">'+esc(e.summary||"")+'</div></header><div class="article-toolbar"><span class="badge '+esc(e.status)+'">'+esc(statusLabel(e.status))+'</span>'+(genealogyPerson?'<a class="button outline-gold" href="#/genealogy/'+encodeURIComponent(genealogyPerson.id)+'">♧ View family tree</a>':'')+'<button class="button subtle" id="editCurrent">✎ Edit article</button><button class="button subtle" id="copyLink">⧉ Copy link</button><button class="button danger-outline" id="deleteCurrent">Delete</button></div><hr class="article-divider"><div class="article-prose">'+renderBody(e.body)+'</div></article><aside class="meta-panel"><span class="eyebrow">ARCHIVAL RECORD</span><h3>Entry details</h3><div class="meta-line"><strong>Classification</strong>'+esc(e.category)+'</div><div class="meta-line"><strong>Period</strong>'+esc(e.era||"Not specified")+'</div><div class="meta-line"><strong>Canon status</strong>'+esc(statusLabel(e.status))+'</div><div class="meta-line"><strong>Keywords</strong>'+(e.tags||[]).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div><hr class="article-divider"><span class="eyebrow">CONNECTED ENTRIES</span>'+(related.length?related.map(x=>'<a class="related-link" href="#/entry/'+encodeURIComponent(x.id)+'">↗ '+esc(x.title)+'</a>').join(""):'<p class="muted">No direct links yet.</p>')+'<hr class="article-divider"><span class="eyebrow">REFERENCED BY</span>'+(back.length?back.map(x=>'<a class="related-link" href="#/entry/'+encodeURIComponent(x.id)+'">↖ '+esc(x.title)+'</a>').join(""):'<p class="muted">No incoming references.</p>')+'</aside></div></div>';
 $("#editCurrent").onclick=()=>openEditor(e);
 $("#copyLink").onclick=()=>{navigator.clipboard?.writeText(location.href).then(()=>toast("Article link copied")).catch(()=>toast("Could not copy link"));};
 $("#deleteCurrent").onclick=()=>{if(!confirm('Delete “'+e.title+'”? References will remain as plain text.'))return;data.entries=data.entries.filter(x=>x.id!==e.id);persist();location.hash="#/library";toast("Entry deleted");};
}
function showTimeline(){
 setCrumb("Chronology");
 const timeline=[...data.timeline].sort((a,b)=>a.year-b.year);
 $("#content").innerHTML='<div class="page"><div class="page-head"><span class="eyebrow">THE LONG MEMORY OF PLACE</span><h1>Regional chronology</h1><p>From ancient monuments to a Spanish maritime settlement, industrial transformation, and the living valley. Early dates and some events are working reconstructions, not final canon.</p></div><div class="timeline">'+timeline.map(t=>'<div class="time-event" data-entry="'+esc(t.entry||"")+'" tabindex="0" role="link"><b>'+esc(t.year<0?Math.abs(t.year)+" BCE":String(t.year))+'</b><h3>'+esc(t.label)+'</h3><p>'+esc(t.summary)+'</p></div>').join("")+'</div></div>';
}
function showMap(){
 setCrumb("Regional atlas");
 $("#content").innerHTML='<div class="page"><div class="page-head"><span class="eyebrow">THE PHYSICAL WORLD</span><h1>Regional atlas</h1><p>A conceptual, clickable map of the setting. It shows relative positions, not surveyed coordinates; Santa Aurelia is anchored at real-world Astoria, and the woodland’s reservation overlap and southwestern Fernhollow placement follow our canon.</p></div><div class="atlas-map"><svg viewBox="0 0 960 580" role="img" aria-label="Schematic regional map showing Santa Aurelia west along Columbia, Willowwick inland, Witches Wood, reservation to its northwest and Fernhollow southwest"><defs><pattern id="forest" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M5 27L15 8L26 27Z" fill="none" stroke="#77927b" stroke-width="1" opacity=".22"/></pattern><linearGradient id="terrain" x2="1" y2="1"><stop stop-color="#263a30"/><stop offset="1" stop-color="#4b5440"/></linearGradient></defs><rect width="960" height="580" fill="url(#terrain)"/><path d="M0 0H960V94Q800 75 685 105Q540 88 401 118Q220 104 0 152Z" fill="#355d65"/><path d="M0 155Q250 104 411 117T960 94" fill="none" stroke="#6d9290" stroke-width="6" opacity=".35"/><path d="M960 180Q759 176 638 235T362 355T140 450" stroke="#577b7b" stroke-width="17" fill="none" opacity=".72"/><path d="M960 180Q759 176 638 235T362 355T140 450" stroke="#a5c3b1" stroke-width="2" stroke-dasharray="7 11" fill="none" opacity=".43"/><path d="M530 210Q625 145 803 214Q894 282 855 398Q810 484 675 482Q551 466 510 351Z" fill="#1b392e" stroke="#547b63" stroke-width="2"/><path d="M530 210Q625 145 803 214Q894 282 855 398Q810 484 675 482Q551 466 510 351Z" fill="url(#forest)"/><path d="M508 207Q562 178 650 211L658 326L589 350L509 303Z" fill="#777d62" stroke="#c1b38d" stroke-width="2" stroke-dasharray="8 6"/><path d="M462 367Q540 333 600 397L585 531L454 536L401 468Z" fill="#536b49" stroke="#abc08b" stroke-width="2"/><g class="atlas-point" data-entry="santa-aurelia"><circle cx="174" cy="164" r="11"/><text x="194" y="160" class="atlas-label">SANTA AURELIA</text><text x="194" y="178" class="atlas-small">JEWEL OF THE PACIFIC</text></g><g class="atlas-point" data-entry="willowwick"><circle cx="375" cy="310" r="11"/><text x="305" y="290" class="atlas-label">WILLOWWICK GROVE</text><text x="305" y="329" class="atlas-small">GARDEN CITY</text></g><g class="atlas-point" data-entry="witchwood"><circle cx="740" cy="343" r="11"/><text x="760" y="337" class="atlas-label">WITCHES’ WOOD</text><text x="760" y="355" class="atlas-small">BLACKWOOD RIDGE</text></g><g class="atlas-point" data-entry="fairy-stones"><circle cx="720" cy="395" r="8"/><text x="738" y="415" class="atlas-small">FAIRY STONES</text></g><g class="atlas-point" data-entry="reservation"><circle cx="570" cy="263" r="8"/><text x="531" y="243" class="atlas-small">RESERVATION</text></g><g class="atlas-point" data-entry="fernhollow"><circle cx="508" cy="444" r="9"/><text x="517" y="470" class="atlas-label">FERNHOLLOW</text></g><text x="48" y="75" class="atlas-small">COLUMBIA ESTUARY</text><text x="50" y="112" class="atlas-small">PACIFIC APPROACH →</text><text x="784" y="548" class="atlas-small">SCHEMATIC / NOT TO SCALE</text></svg></div><p class="atlas-note">Select a marker to open its article. No journey lengths, routes or coordinates are implied by this conceptual diagram. A geographically accurate GIS map is a later milestone.</p><div class="atlas-list">'+["santa-aurelia","willowwick","blackwood","reservation","fernhollow","fairy-stones"].map(getEntry).filter(Boolean).map(card).join("")+'</div></div>';
}
function showConnections(){
 setCrumb("Connections");
 const linked=entries().map(e=>({entry:e,related:getLinks(e),inbound:backlinks(e).length})).filter(x=>x.related.length||x.inbound).sort((a,b)=>(b.related.length+b.inbound)-(a.related.length+a.inbound));
 $("#content").innerHTML='<div class="page"><div class="page-head"><span class="eyebrow">RELATIONSHIPS & BACKLINKS</span><h1>Connections</h1><p>Explore the links between people, places, institutions and traditions. Each article includes both outgoing links and articles referring back to it.</p></div><div class="relation-list">'+linked.map(({entry:e,related,inbound})=>'<a class="relation" href="#/entry/'+encodeURIComponent(e.id)+'"><span class="relation-ico">'+esc(categoryLabel(e.category))+'</span><span><b>'+esc(e.title)+'</b><small>'+esc(e.category)+' · '+related.length+' outbound / '+inbound+' inbound</small></span><span style="margin-left:auto;color:var(--gold)">↗</span></a>').join("")+'</div></div>';
}
function render(){
 const path=decodeURIComponent(location.hash.replace(/^#\/?/,"")).split("/").filter(Boolean);
 view=path[0]==="entry"?"entry":(["library","map","timeline","connections",...Object.keys(extraViews)].includes(path[0])?path[0]:"home");
 activeEntry=view==="entry"?path.slice(1).join("/"):null;
 updateSide();
 if(view==="home")showHome();else if(view==="library")showLibrary();else if(view==="map")showMap();else if(view==="timeline")showTimeline();else if(view==="connections")showConnections();else if(extraViews[view])extraViews[view]();else showEntry(getEntry(activeEntry));
 window.scrollTo({top:0,behavior:"instant"});
 $(".sidebar").classList.remove("open");
}
function openEditor(e=null){
 $("#editTitle").textContent=e?"Edit "+e.title:"New entry";
 $("#entryId").value=e?.id||"";
 $("#entryTitle").value=e?.title||"";
 $("#entryCategory").value=e?.category||"Location";
 $("#entryStatus").value=e?.status||"working";
 $("#entryEra").value=e?.era||"";
 $("#entrySummary").value=e?.summary||"";
 $("#entryBody").value=e?.body||"";
 $("#entryTags").value=(e?.tags||[]).join(", ");
 $("#entryLinks").value=(e?.links||[]).join(", ");
 $("#editBackdrop").classList.remove("hidden");
 $("#entryTitle").focus();
}
function closeModals(){$$(".modal-backdrop").forEach(x=>x.classList.add("hidden"));}
function saveEntry(ev){
 ev.preventDefault();
 const oldId=$("#entryId").value,title=$("#entryTitle").value.trim();
 if(!title){toast("Please enter a title");return;}
 let id=oldId||normalize(title)||"entry";
 if(!oldId){const base=id;let suffix=2;while(getEntry(id)){id=base+"-"+suffix++;}}
 const rec={id,title,category:$("#entryCategory").value,status:$("#entryStatus").value,era:$("#entryEra").value.trim(),summary:$("#entrySummary").value.trim(),body:$("#entryBody").value.trim(),tags:$("#entryTags").value.split(",").map(x=>x.trim()).filter(Boolean).slice(0,40),links:$("#entryLinks").value.split(",").map(x=>x.trim()).filter(Boolean).slice(0,80)};
 const index=entries().findIndex(e=>e.id===oldId);
 if(index>=0)data.entries[index]=rec;else data.entries.push(rec);
 persist();closeModals();location.hash="#/entry/"+encodeURIComponent(id);render();toast(oldId?"Entry updated":"Entry created");
}
function downloadArchive(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="santa-aurelia-atlas-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast("Archive exported");}
function importArchive(file){
 if(!file)return;
 if(file.size>5000000){toast("File is too large");return;}
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const next=JSON.parse(reader.result);
   if(!isValid(next))throw Error("Invalid archive structure");
   const ids=next.entries.map(e=>e.id);
   if(new Set(ids).size!==ids.length)throw Error("Duplicate article IDs");
   if(!confirm("Replace the current local archive with this file? Export first if you need a backup."))return;
   data=next;persist();closeModals();activeFilter="All";searchText="";$("#globalSearch").value="";location.hash="#/library";render();toast("Archive imported");
  }catch(e){toast("Import failed: "+e.message);}
 };
 reader.readAsText(file);
}
function bind(){
 $("#entryCategory").innerHTML=CATEGORIES.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join("");
 $("#newEntry").onclick=()=>openEditor();
 $("#openTools").onclick=()=>$("#toolsBackdrop").classList.remove("hidden");
 $("#entryForm").addEventListener("submit",saveEntry);
 $("#exportJson").onclick=downloadArchive;
 $("#importJson").onchange=ev=>{importArchive(ev.target.files[0]);ev.target.value="";};
 $("#resetData").onclick=()=>{if(!confirm("Restore the bundled seed and discard ALL local edits? Export a backup first."))return;data=structuredClone(window.SANTA_AURELIA_SEED);persist();closeModals();activeFilter="All";searchText="";$("#globalSearch").value="";location.hash="#/";render();toast("Original archive restored");};
 $("#mobileMenu").onclick=()=>$(".sidebar").classList.toggle("open");
 $("#globalSearch").oninput=e=>{searchText=e.target.value.trim();activeFilter="All";if(location.hash!=="#/library")location.hash="#/library";else render();};
 document.addEventListener("click",ev=>{
   const close=ev.target.closest("[data-close]");if(close){$("#"+close.dataset.close).classList.add("hidden");return;}
   const nav=ev.target.closest("[data-view],[data-go]");if(nav){activeFilter="All";location.hash="#/"+(nav.dataset.view||nav.dataset.go);return;}
   const cat=ev.target.closest("[data-cat]");if(cat){activeFilter=cat.dataset.cat;location.hash="#/library";render();return;}
   const filter=ev.target.closest("[data-filter]");if(filter){activeFilter=filter.dataset.filter;render();return;}
   const entry=ev.target.closest("[data-entry]");if(entry){linkTo(entry.dataset.entry);return;}
   if(ev.target.classList.contains("modal-backdrop"))closeModals();
 });
 document.addEventListener("keydown",ev=>{
   if(ev.key==="Escape"){closeModals();$(".sidebar").classList.remove("open");}
   if(ev.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)&&!ev.ctrlKey&&!ev.metaKey){ev.preventDefault();$("#globalSearch").focus();}
   const route=ev.target.closest?.(".time-event");if(route&&(ev.key==="Enter"||ev.key===" ")){ev.preventDefault();linkTo(route.dataset.entry);}
 });
 window.addEventListener("hashchange",render);
}
window.SantaAtlas={data:()=>data,entries,getEntry,esc,setCrumb,persist,toast,currentView:()=>view,registerView:(name,fn)=>{extraViews[name]=fn;if(location.hash.replace(/^#\\/?/,"").split("/")[0]===name)render();}};
bind();render();
})();
