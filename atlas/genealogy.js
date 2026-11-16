/* Self-contained genealogy subsystem. Initializes after atlas/app.js.
   People and relationships are separate data, stored in the main archive JSON. */
(function(){
"use strict";
const A=window.SantaAtlas;
if(!A)return;
const $=s=>document.querySelector(s);
const esc=A.esc;
const relations=["biological","adoptive","step","foster","guardian"];
const partnerKinds=["married","partner","former partner","betrothed"];
const generationLimit=4;
const g=()=>A.data().genealogy;
let focus="person-alonso",mode="family",search="";
function migrate(d){
 if(!d.genealogy||!Array.isArray(d.genealogy.people)||!Array.isArray(d.genealogy.relations)){
 d.genealogy={people:[
 {id:"person-alonso",name:"Don Alonso de Valcárcel y Austria",born:"c. 1572",died:"c. 1641",bio:"Wealthy Spanish merchant captain; founded Santa Aurelia in 1608. His precise dates and genealogy remain provisional.",entryId:"alonso",status:"working",privacy:"historical"},
 {id:"person-ines",name:"Inés (Indigenous name undecided)",born:"",died:"",bio:"Adult daughter of a local Indigenous chief; beloved wife and equal partner of Alonso. Her original name and dates have yet to be researched in the setting.",entryId:"ines",status:"working",privacy:"historical"}
 ],relations:[{id:"rel-alonso-ines",type:"partner",a:"person-alonso",b:"person-ines",kind:"married",start:"c. 1611",end:"",notes:"Mutual love; date provisional."}]};
 }else{
 if(!Array.isArray(d.genealogy.people))d.genealogy.people=[];
 if(!Array.isArray(d.genealogy.relations))d.genealogy.relations=[];
 }
}
migrate(A.data());
function people(){return g().people;}
function rels(){return g().relations;}
function byId(id){return people().find(p=>p.id===id);}
function relationFor(id,type){return rels().filter(r=>r.type===type&&(r.a===id||r.b===id));}
function parents(id){return rels().filter(r=>r.type==="parent"&&r.b===id).map(r=>({person:byId(r.a),relation:r})).filter(x=>x.person);}
function children(id){return rels().filter(r=>r.type==="parent"&&r.a===id).map(r=>({person:byId(r.b),relation:r})).filter(x=>x.person);}
function partners(id){return relationFor(id,"partner").map(r=>({person:byId(r.a===id?r.b:r.a),relation:r})).filter(x=>x.person);}
function allRelatives(id){return [...parents(id),...children(id),...partners(id)];}
function siblings(id){const parentIds=new Set(parents(id).map(x=>x.person.id));return people().filter(p=>p.id!==id&&parents(p.id).some(x=>parentIds.has(x.person.id))).map(person=>({person,label:"Shared parent"}));}
function safeId(prefix){let id;do{id=prefix+"-"+Math.random().toString(36).slice(2,10)}while(byId(id)||rels().some(r=>r.id===id));return id;}
function ancestorOf(older,younger,visited=new Set()){
 if(older===younger)return true;
 if(visited.has(older))return false;
 visited.add(older);
 return children(older).some(({person})=>ancestorOf(person.id,younger,new Set(visited)));
}
function validateRel(r){
 if(r.a===r.b)throw Error("A person cannot be related to themselves.");
 if(!byId(r.a)||!byId(r.b))throw Error("Both people must exist.");
 if(r.type==="parent"&&ancestorOf(r.b,r.a))throw Error("This would create an ancestry cycle.");
 if(rels().some(old=>old.id!==r.id&&old.type===r.type&&old.a===r.a&&old.b===r.b))throw Error("That relationship already exists.");
 if(r.type==="partner"&&rels().some(old=>old.id!==r.id&&old.type==="partner"&&((old.a===r.a&&old.b===r.b)||(old.a===r.b&&old.b===r.a))))throw Error("That partnership already exists.");
}
function personCard(p,relation="",muted=false){
 if(!p)return '<div class="family-placeholder">Unknown relative</div>';
 return '<button class="family-person '+(p.id===focus?"is-focus ":"")+(muted?"is-muted":"")+'" data-person="'+esc(p.id)+'"><span class="family-avatar">'+esc(p.name.slice(0,1).toUpperCase())+'</span><span class="family-person-info"><b>'+esc(p.name)+'</b><small>'+esc([p.born,p.died].filter(Boolean).join(" – ")||"Dates unknown")+'</small>'+(relation?'<i>'+esc(relation)+'</i>':"")+'</span></button>';
}
function group(title,items,emptyText){
 return '<section class="family-generation"><div class="family-gen-label">'+esc(title)+'</div><div class="family-cards">'+(items.length?items.map(x=>personCard(x.person,x.label||"")).join(""):'<p class="family-empty">'+esc(emptyText)+'</p>')+'</div></section>';
}
function showFamily(p){
 const parentItems=parents(p.id).map(x=>({...x,label:x.relation.kind||"parent"}));
 const childItems=children(p.id).map(x=>({...x,label:x.relation.kind||"child"}));
 const partnerItems=partners(p.id).map(x=>({...x,label:x.relation.kind||"partner"}));
 const siblingItems=siblings(p.id);
 return '<div class="family-layout">'+group("PARENTS",parentItems,"No parents recorded")+'<div class="family-branch-line"></div>'+group("FOCAL PERSON & PARTNERS",[{person:p,label:"Selected person"},...partnerItems],"")+'<div class="family-branch-line"></div>'+group("CHILDREN",childItems,"No children recorded")+'<div class="family-branch-line"></div>'+group("SIBLINGS",siblingItems,"No siblings recorded")+'</div>';
}
function lineage(id,direction,depth=0,seen=new Set()){
 const p=byId(id);if(!p)return "";
 if(seen.has(id))return '<div class="family-cycle-warning">Repeated ancestor</div>';
 const s=new Set(seen);s.add(id);
 const relatives=direction==="ancestors"?parents(id):children(id);
 return '<div class="pedigree-branch"><div class="pedigree-node">'+personCard(p)+'</div>'+(depth<generationLimit&&relatives.length?'<div class="pedigree-children">'+relatives.map(x=>lineage(x.person.id,direction,depth+1,s)).join("")+'</div>':"")+'</div>';
}
function showLineage(p){
 return '<div class="pedigree-scroll"><div class="pedigree-tree">'+lineage(p.id,mode==="ancestors"?"ancestors":"descendants")+'</div></div><p class="family-hint">Select any person to make them the center of the tree. Display is limited to five generations per view; the underlying records are not limited.</p>';
}
function connectedCount(){return rels().length;}
function selectedPerson(){return byId(focus)||people()[0]||null;}
function render(){
 migrate(A.data());
 const p=selectedPerson();if(p)focus=p.id;
 const matching=people().filter(p=>[p.name,p.born,p.died,p.bio].join(" ").toLowerCase().includes(search.toLowerCase()));
 A.setCrumb("Genealogy");
 $("#content").innerHTML='<div class="page genealogy-page"><div class="page-head"><span class="eyebrow">HERITAGE, KINSHIP & DYNASTIES</span><h1>The Family Archive</h1><p>Explore families across Santa Aurelia and Willowwick, follow generations, and connect individuals to the wider atlas. Ancestry records are separate from folklore and speculative heritage.</p></div><div class="family-stats"><span><b>'+people().length+'</b> Individuals</span><span><b>'+connectedCount()+'</b> Relationships</span><span><b>'+people().filter(p=>p.entryId).length+'</b> Encyclopedia profiles</span></div><div class="genealogy-shell"><aside class="family-directory"><label class="family-search">⌕ <input id="personSearch" placeholder="Search individuals..." value="'+esc(search)+'" aria-label="Search people"/></label><div class="family-directory-scroll">'+(matching.length?matching.map(p=>personCard(p)).join(""):'<p class="family-empty">No people match this search.</p>')+'</div><button class="button button-gold family-add" data-gen-action="new">＋ Add individual</button></aside><section class="family-main">'+(p?'<div class="family-toolbar"><div><span class="eyebrow">CURRENT FOCUS</span><h2>'+esc(p.name)+'</h2><p>'+esc(p.bio||"No biographical notes yet.")+'</p></div><div class="family-controls"><button class="button subtle" data-gen-action="edit">✎ Edit person</button><button class="button subtle" data-gen-action="connect">＋ Connect relative</button><button class="button subtle" data-gen-action="edit-links">Relationships</button></div></div><div class="family-view-tabs"><button class="'+(mode==="family"?"active":"")+'" data-gen-view="family">Family</button><button class="'+(mode==="ancestors"?"active":"")+'" data-gen-view="ancestors">Ancestors</button><button class="'+(mode==="descendants"?"active":"")+'" data-gen-view="descendants">Descendants</button></div>'+(mode==="family"?showFamily(p):showLineage(p))+'<div class="family-detail"><span class="eyebrow">PERSON RECORD</span><div class="family-facts"><span><strong>Birth</strong>'+esc(p.born||"Unknown")+'</span><span><strong>Death</strong>'+esc(p.died||"Unknown")+'</span><span><strong>Canon</strong>'+esc(p.status||"working")+'</span><span><strong>Privacy</strong>'+esc(p.privacy||"historical")+'</span></div><div class="family-controls">'+(p.entryId&&A.getEntry(p.entryId)?'<a class="button button-gold" href="#/entry/'+encodeURIComponent(p.entryId)+'">Read encyclopedia article ↗</a>':"")+'<button class="button subtle" data-gen-action="link-entry">Link article</button><button class="button danger-outline" data-gen-action="remove-person">Delete individual</button></div></div>':'<div class="family-empty">Create your first individual to begin a tree.</div>')+'</section></div></div>';
 $("#personSearch").oninput=e=>{const caret=e.target.selectionStart;search=e.target.value;render();$("#personSearch").focus();$("#personSearch").setSelectionRange(caret,caret);};
}
function modal(title,content,submitLabel,submit){
 const cover=$("#genealogyBackdrop");
 $("#genealogyModalTitle").textContent=title;
 $("#genealogyFormBody").innerHTML=content;
 $("#genealogySave").textContent=submitLabel;
 cover.classList.remove("hidden");
 const form=$("#genealogyForm");
 form.onsubmit=e=>{e.preventDefault();try{submit(new FormData(form));A.persist();close();render();A.toast("Family archive saved")}catch(err){A.toast(err.message)}};
 const first=cover.querySelector("input:not([type=hidden]),select");first?.focus();
}
function close(){$("#genealogyBackdrop").classList.add("hidden");}
function personFields(p={}){
 return '<label class="field">Full name<input name="name" required maxlength="150" value="'+esc(p.name||"")+'" placeholder="Full name"/></label><div class="form-grid"><label class="field">Born / birth date<input name="born" maxlength="90" value="'+esc(p.born||"")+'" placeholder="c. 1600"/></label><label class="field">Died / death date<input name="died" maxlength="90" value="'+esc(p.died||"")+'"/></label></div><div class="form-grid"><label class="field">Canon status<select name="status">'+["established","working","provisional","legend"].map(s=>'<option value="'+s+'" '+((p.status||"working")===s?"selected":"")+'>'+s+'</option>').join("")+'</select></label><label class="field">Record privacy<select name="privacy"><option value="historical" '+((p.privacy||"historical")==="historical"?"selected":"")+'>Historical / public</option><option value="private" '+(p.privacy==="private"?"selected":"")+'>Private / living</option></select></label></div><label class="field">Biographical notes<textarea name="bio" rows="4" maxlength="5000">'+esc(p.bio||"")+'</textarea></label><label class="field">Linked encyclopedia article<input name="entryId" value="'+esc(p.entryId||"")+'" placeholder="Person entry ID, e.g. alonso"/></label>';
}
function addPerson(){
 modal("Add an individual",personFields(),"Create individual",fd=>{
 const name=String(fd.get("name")||"").trim();
 if(!name)throw Error("A name is required.");
 if(people().some(p=>p.name.toLowerCase()===name.toLowerCase()))throw Error("A person with that name already exists. Edit that record or use a distinguishing name.");
 const p={id:safeId("person"),name,born:fd.get("born").trim(),died:fd.get("died").trim(),bio:fd.get("bio").trim(),entryId:fd.get("entryId").trim(),status:fd.get("status"),privacy:fd.get("privacy")};
 people().push(p);focus=p.id;
 });
}
function editPerson(p){
 modal("Edit individual",personFields(p),"Save individual",fd=>{
 const name=fd.get("name").trim();
 if(!name)throw Error("A name is required.");
 if(people().some(x=>x.id!==p.id&&x.name.toLowerCase()===name.toLowerCase()))throw Error("Another individual already has this name.");
 Object.assign(p,{name,born:fd.get("born").trim(),died:fd.get("died").trim(),bio:fd.get("bio").trim(),entryId:fd.get("entryId").trim(),status:fd.get("status"),privacy:fd.get("privacy")});
 });
}
function linkEntry(p){
 modal("Link an encyclopedia profile",'<p class="muted">Use the ID of an existing article. It will appear as a navigation link on this person.</p><label class="field">Article<select name="entryId"><option value="">No linked article</option>'+A.entries().filter(e=>e.category==="Person").map(e=>'<option value="'+esc(e.id)+'" '+(e.id===p.entryId?"selected":"")+'>'+esc(e.title)+'</option>').join("")+'</select></label>',"Save profile link",fd=>{p.entryId=fd.get("entryId");});
}
function connect(p){
 const other=people().filter(q=>q.id!==p.id);
 if(!other.length){A.toast("Create another individual first.");return;}
 modal("Connect a relative",'<p class="muted">Relationships represent the selected focal person and another existing individual. Parentage may be biological, adoptive, foster, step or guardianship; partnerships may be married or unmarried.</p><label class="field">Relationship<select name="relationship"><option value="parent">This person is the parent of…</option><option value="child">This person is the child of…</option><option value="partner">These people are partners / spouses</option></select></label><label class="field">Other person<select name="other">'+other.map(q=>'<option value="'+esc(q.id)+'">'+esc(q.name)+'</option>').join("")+'</select></label><label class="field">Relationship kind<select name="kind"><optgroup label="Parentage">'+relations.map(k=>'<option value="'+k+'">'+k+'</option>').join("")+'</optgroup><optgroup label="Partnership">'+partnerKinds.map(k=>'<option value="'+k+'">'+k+'</option>').join("")+'</optgroup></select></label><div class="form-grid"><label class="field">Start / marriage date<input name="start" placeholder="c. 1611"/></label><label class="field">End date<input name="end" placeholder="optional"/></label></div><label class="field">Notes<input name="notes" maxlength="400" placeholder="How do we know?"/></label>',"Add relationship",fd=>{
 const type=fd.get("relationship"),otherId=fd.get("other");
 const isPartner=type==="partner";
 const r={id:safeId("rel"),type:isPartner?"partner":"parent",a:type==="child"?otherId:p.id,b:type==="child"?p.id:otherId,kind:fd.get("kind"),start:fd.get("start").trim(),end:fd.get("end").trim(),notes:fd.get("notes").trim()};
 if(isPartner&&!partnerKinds.includes(r.kind))throw Error("Choose a partnership kind.");
 if(!isPartner&&!relations.includes(r.kind))throw Error("Choose a parentage kind.");
 validateRel(r);rels().push(r);
 });
 const relationSelect=$("#genealogyForm").querySelector('[name="relationship"]'),kindSelect=$("#genealogyForm").querySelector('[name="kind"]');
 relationSelect.onchange=()=>{
  const partner=relationSelect.value==="partner";
  kindSelect.innerHTML=(partner?partnerKinds:relations).map(k=>'<option value="'+k+'">'+k+'</option>').join("");
 };
 relationSelect.dispatchEvent(new Event("change"));
}
function removePerson(p){
 const count=rels().filter(r=>r.a===p.id||r.b===p.id).length;
 if(!confirm('Delete '+p.name+' and disconnect '+count+' family relationship(s)? The encyclopedia article will not be deleted.'))return;
 g().people=people().filter(x=>x.id!==p.id);
 g().relations=rels().filter(x=>x.a!==p.id&&x.b!==p.id);
 focus=people()[0]?.id||"";A.persist();render();A.toast("Individual removed");
}
function removeRelation(id){
 const r=rels().find(r=>r.id===id);if(!r)return;
 if(!confirm("Remove this relationship without deleting either person?"))return;
 g().relations=rels().filter(x=>x.id!==id);A.persist();render();
}
function showLinkEditor(p){
 const relevant=rels().filter(r=>r.a===p.id||r.b===p.id);
 modal("Edit relationships",'<p class="muted">Disconnect an incorrect relationship, then connect the correct individual. Neither person will be deleted.</p><div class="family-relation-editor">'+(relevant.length?relevant.map(r=>'<div class="family-relation-row"><span>'+esc((r.type==="partner"?"Partner":r.a===p.id?"Parent of":"Child of")+' · '+(byId(r.a===p.id?r.b:r.a)?.name||"Unknown")+' · '+r.kind)+'</span><button type="button" data-drop-relation="'+esc(r.id)+'">Disconnect</button></div>').join(""):'<p>No relationships yet.</p>')+'</div>',"Close",()=>{});
 $("#genealogyForm").querySelectorAll("[data-drop-relation]").forEach(btn=>btn.onclick=()=>{removeRelation(btn.dataset.dropRelation);close();});
}
function init(){
 const backdrop=document.createElement("div");
 backdrop.id="genealogyBackdrop";backdrop.className="modal-backdrop hidden";backdrop.innerHTML='<section class="modal" role="dialog" aria-modal="true" aria-labelledby="genealogyModalTitle"><div class="modal-head"><div><span class="eyebrow">THE FAMILY ARCHIVE</span><h2 id="genealogyModalTitle">Individual</h2></div><button class="icon-button" type="button" id="genealogyClose" aria-label="Close">✕</button></div><form id="genealogyForm"><div id="genealogyFormBody"></div><div class="modal-actions"><button type="button" class="button subtle" id="genealogyCancel">Cancel</button><button type="submit" id="genealogySave" class="button button-gold">Save</button></div></form></section>';
 document.body.appendChild(backdrop);
 $("#genealogyClose").onclick=close;$("#genealogyCancel").onclick=close;
 backdrop.addEventListener("click",e=>{if(e.target===backdrop)close();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
 document.addEventListener("click",e=>{
  if(A.currentView()!=="genealogy")return;
  const el=e.target.closest("[data-person]");if(el){focus=el.dataset.person;render();return;}
  const tab=e.target.closest("[data-gen-view]");if(tab){mode=tab.dataset.genView;render();return;}
  const button=e.target.closest("[data-gen-action]");if(!button)return;
  const p=selectedPerson();
  switch(button.dataset.genAction){
   case "new":addPerson();break;
   case "edit":if(p)editPerson(p);break;
   case "connect":if(p)connect(p);break;
   case "edit-links":if(p)showLinkEditor(p);break;
   case "link-entry":if(p)linkEntry(p);break;
   case "remove-person":if(p)removePerson(p);break;
  }
 });
}
init();
A.registerView("genealogy",render);
window.SantaGenealogy={migrate,validateRel,parents,children,partners,render};
})();
