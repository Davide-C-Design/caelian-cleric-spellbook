const BASE_CLERIC_SLOTS=[
 [3,1],[4,2],[4,2,1],[5,3,2],[5,3,2,1],[5,3,3,2],[6,4,3,2,1],[6,4,3,3,2],[6,4,4,3,2,1],[6,4,4,3,3,2],
 [6,5,4,4,3,2,1],[6,5,4,4,3,3,2],[6,5,5,4,4,3,2,1],[6,5,5,4,4,3,3,2],[6,5,5,4,4,4,3,2,1],[6,5,5,4,4,4,3,3,2],[6,5,5,4,4,4,3,3,2,1],[6,5,5,4,4,4,3,3,3,2],[6,5,5,4,4,4,3,3,3,3],[6,5,5,4,4,4,3,3,3,3]
];
const CAELIAN_FIRST_LEVEL_ADJUSTMENT=1;
const STAT_OVERRIDES={
  "cleric|0|Detect Magic":{casting:"Standard action",range:"60 ft.",target:"Cone-shaped emanation",duration:"Concentration, up to 1 min./level",save:"None",sr:"No",components:"V, S"},
  "cleric|0|Guidance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 minute or until discharged",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|0|Light":{casting:"Standard action",range:"Touch",target:"Object touched",duration:"10 min./level",save:"None",sr:"No",components:"V, DF"},
  "cleric|0|Resistance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 minute",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|1|Bless":{casting:"Standard action",range:"50 ft.",target:"Allies in a 50-ft. burst",duration:"1 min./level",save:"None",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|1|Cure Light Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|1|Divine Favor":{casting:"Standard action",range:"Personal",target:"You",duration:"1 minute",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|1|Magic Weapon":{casting:"Standard action",range:"Touch",target:"Weapon touched",duration:"1 min./level",save:"Will (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, DF"},
  "cleric|1|Shield of Faith":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|2|Cure Moderate Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|2|Spiritual Weapon":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Magic weapon",duration:"1 round/level",save:"None",sr:"Yes",components:"V, S, DF"},
  "cleric|3|Dispel Magic":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One spellcaster, creature, or object; or 20-ft. burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Magic Vestment":{casting:"Standard action",range:"Touch",target:"Armor or shield touched",duration:"1 hour/level",save:"Will (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, DF"},
  "cleric|3|Protection from Energy":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level or until discharged",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "magic|3|Dispel Magic":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One spellcaster, creature, or object; or 20-ft. burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"}
};
let tab="cleric", selected=null;
let state={prepared:[],favorites:[],character:{level:5,wisdom:23}};
try { const saved=window.localStorage.getItem("caelianSpellbook"); if(saved) state={...state,...JSON.parse(saved)}; } catch(e) {}
state.prepared=Array.isArray(state.prepared)?state.prepared:[]; state.favorites=Array.isArray(state.favorites)?state.favorites:[]; state.character={...{level:5,wisdom:23},...(state.character||{})};
const save=()=>{ try { window.localStorage.setItem("caelianSpellbook",JSON.stringify(state)); } catch(e) {} };
const key=(source,lvl,n)=>source+"|"+lvl+"|"+n;
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const sourceLabel=s=>s==="cleric"?"Cleric spell":s==="magic"?"Magic domain":"Balance domain";
function allSpells(source){
 if(source==="cleric") return Object.entries(DATA.cleric).flatMap(([l,a])=>a.map(x=>({...x,l:+l,source})));
 const obj=source==="magic"?DATA.magic:DATA.balance;
 return Object.entries(obj).map(([l,x])=>({...x,l:+l,source}));
}
function current(){return allSpells(tab==="cleric"?"cleric":tab);}
function isDomain(s){return s.source!=="cleric";}
function preparedAt(level,domain){return allSpells("cleric").concat(allSpells("magic"),allSpells("balance")).filter(s=>s.l===level&&isDomain(s)===domain&&state.prepared.includes(key(s.source,s.l,s.n)));}
function characterLevel(){return state.character.level;}
function wisdom(){return state.character.wisdom;}
function wisdomModifier(){return Math.floor((wisdom()-10)/2);}
function bonusSpells(level){const modifier=wisdomModifier();return level>0&&modifier>=level?1+Math.floor((modifier-level)/4):0;}
function slotInfo(level){const base=(BASE_CLERIC_SLOTS[characterLevel()-1]||[])[level]||0;if(!base||wisdom()<10+level)return {normal:0,domain:0};return {normal:base+(level===1?CAELIAN_FIRST_LEVEL_ADJUSTMENT:0)+bonusSpells(level),domain:level>0?1:0};}
function activeSpellLevels(){return Array.from({length:10},(_,level)=>level).filter(level=>slotInfo(level).normal>0);}
function spellDC(level){return 10+level+wisdomModifier();}
function spellStats(s){return STAT_OVERRIDES[key(s.source,s.l,s.n)]||{casting:"See full rules",range:"See full rules",target:"See full rules",duration:"See full rules",save:"See full rules",sr:"See full rules",components:"See full rules"};}
function spellReference(s){
 if(s.source==="balance") return {label:"View Spell Compendium reference",url:"https://www.dmsguild.com/product/3725/Spell-Compendium-35",note:"Balance-domain text comes from Spell Compendium. This sheet keeps only a concise summary and the book reference."};
 const file=s.n.toLowerCase().replace(/[^a-z0-9]+(.)?/g,(_,letter)=>letter?letter.toUpperCase():"");
 return {label:"Read full SRD rules text",url:"https://www.d20srd.org/srd/spells/"+file+".htm",note:"This is SRD material. The linked reference contains the complete spell text and rules details."};
}
function fullCardDescription(s,stats){
 const mechanics=stats.casting==="See full rules"?"The linked rules reference supplies any spell-specific exceptions, scaling, targets, and restrictions not shown in this quick card.":`Cast it as a ${stats.casting.toLowerCase()} effect with a range of ${stats.range.toLowerCase()}. It affects ${stats.target.toLowerCase()} and lasts ${stats.duration.toLowerCase()}. ${stats.save!=="None"?`If a saving throw applies, the DC is ${spellDC(s.l)}.`:"It does not allow a saving throw."} Spell resistance is ${stats.sr.toLowerCase()}.`;
 return `${s.d} ${mechanics} ${isDomain(s)?"Preparing it uses this level’s single domain slot, shared between Magic and Balance.":"Preparing it uses one normal Cleric slot of this spell level."}`;
}
function openSpell(s){
 selected=s; const html=detailHTML(s);
 [document.getElementById("detail"),document.getElementById("sheet")].forEach(node=>{node.innerHTML=html;bindDetailActions(node);});
}
function detailHTML(s){
 const prepared=state.prepared.includes(key(s.source,s.l,s.n)), favorite=state.favorites.includes(key(s.source,s.l,s.n)), stats=spellStats(s), reference=spellReference(s), domain=isDomain(s), info=slotInfo(s.l), preparedCount=preparedAt(s.l,domain).length, limit=domain?info.domain:info.normal;
 const fields=[["School",s.s],["Casting time",stats.casting],["Range",stats.range],["Target / effect",stats.target],["Duration",stats.duration],["Save",stats.save],["Spell resistance",stats.sr],["Components",stats.components],["Spell save DC",spellDC(s.l)],["Caster level",characterLevel()],["Preparation",prepared?"Prepared":"Not prepared"],["Bookmark",favorite?"★ Favorite":"☆ Not favorited"]];
 return `<button class="close" data-action="close" aria-label="Close spell details">×</button><h2>${esc(s.n)}</h2><div class="source">${sourceLabel(s.source)} · ${s.l===0?"0-level orison":ordinal(s.l)+" level"}</div>
 <div class="actionrow"><button class="action" data-action="prepare">${prepared?"Remove from prepared":"Prepare this spell"}</button><button class="action secondary" data-action="favorite">${favorite?"★ Remove bookmark":"☆ Add bookmark"}</button></div>
 <h3>Spell Details</h3><div class="facts">${fields.map(([label,value])=>`<div class="fact"><b>${label}</b>${esc(value)}</div>`).join("")}</div>
 <h3>Quick Summary</h3><p>${esc(s.d)}</p>
 <div class="note">${domain?`Domain slot: ${preparedCount} of ${limit} selected at this level. Pick one spell from either Magic or Balance for the domain slot.`:`Cleric slots: ${preparedCount} of ${limit} selected at this level.`}</div>
 <h3>Full Description</h3><p class="ruletext">${esc(fullCardDescription(s,stats))}</p><h3>Rules Reference</h3><p class="statusline">${esc(reference.note)}</p><a class="reference" href="${reference.url}" target="_blank" rel="noopener noreferrer">↗ ${reference.label}</a>
 <p class="statusline">★ is a personal bookmark used by the Favorites filter. It never consumes a prepared slot.</p>`;
}
function bindDetailActions(node){
 node.querySelectorAll("[data-action]").forEach(button=>button.onclick=event=>{event.stopPropagation();const action=button.dataset.action;if(action==="close")return closeModal();if(!selected)return;action==="prepare"?togglePrepared(selected):toggleFavorite(selected);});
}
function render(){
 const el=document.getElementById("content"), toolbar=document.querySelector(".toolbar"); el.innerHTML=""; toolbar.hidden=tab==="today";
 updateBadge();updateSlots();
 if(tab==="today"){renderToday(el);return;}
 let spells=current(), query=document.getElementById("search").value.toLowerCase(), levelFilter=document.getElementById("levelFilter").value, preparedFilter=document.getElementById("preparedFilter").value;
 spells=spells.filter(s=>(levelFilter==="all"||s.l==levelFilter)&&(!query||s.n.toLowerCase().includes(query)||s.d.toLowerCase().includes(query)||s.s.toLowerCase().includes(query))&&(preparedFilter==="all"||(preparedFilter==="prepared"&&state.prepared.includes(key(s.source,s.l,s.n)))||(preparedFilter==="favorites"&&state.favorites.includes(key(s.source,s.l,s.n)))));
 for(let level=0;level<=9;level++){
  const list=spells.filter(s=>s.l===level); if(!list.length)continue;
  const section=document.createElement("div");section.className="level";section.innerHTML=`<div class="levelhead"><strong>${level===0?"0 · Orisons":ordinal(level)+" · Spells"}</strong><span class="count">${list.length}</span></div>`;
  list.forEach(s=>{const spellKey=key(s.source,s.l,s.n),row=document.createElement("div");row.className="spellrow";row.innerHTML=`<input class="check" type="checkbox" ${state.prepared.includes(spellKey)?"checked":""} aria-label="Prepare ${esc(s.n)}"><div><div class="spellname">${esc(s.n)}</div><div class="meta">${esc(s.s)} · ${esc(s.d)}</div></div><button class="star ${state.favorites.includes(spellKey)?"on":""}" title="Personal bookmark; use the Favorites filter" aria-label="Bookmark ${esc(s.n)}">★</button>`;
   row.querySelector(".check").onclick=event=>{event.stopPropagation();togglePrepared(s);};row.querySelector(".star").onclick=event=>{event.stopPropagation();toggleFavorite(s);};row.onclick=()=>{openSpell(s);document.getElementById("modal").classList.add("show")};section.appendChild(row);});
  el.appendChild(section);
 }
 if(!el.childElementCount)el.innerHTML='<div class="empty">No spells match these filters.</div>';
}
function renderToday(el){
 const all=allSpells("cleric").concat(allSpells("magic"),allSpells("balance"));
 const levels=activeSpellLevels(),prepared=all.filter(s=>state.prepared.includes(key(s.source,s.l,s.n))),totalCapacity=levels.reduce((sum,level)=>{const info=slotInfo(level);return sum+info.normal+info.domain;},0);
 const dcCards=levels.map(level=>`<div class="dc-item"><span>${level===0?"0-level":ordinal(level)+" level"}</span><b>DC ${spellDC(level)}</b></div>`).join("");
 el.innerHTML=`<section><h2 style="font-family:Georgia,serif;margin:0 0 4px">Prepared Today</h2><p class="prepared-intro">Caelian, Cleric ${characterLevel()} · Wisdom ${wisdom()} (${wisdomModifier()>=0?"+":""}${wisdomModifier()}). Checkboxes prepare spells; ★ bookmarks them for the Favorites filter.</p><div class="summarygrid"><div class="summarycard"><b>${prepared.length} / ${totalCapacity}</b><span>Prepared slots</span></div><div class="summarycard"><b>+${characterLevel()}</b><span>Caster level / dispel check</span></div><div class="summarycard"><b>${levels.filter(level=>level>0).length}</b><span>Available domain levels</span></div></div><div class="dc-panel"><h3>Spell Save DC by Level</h3><div class="dc-grid">${dcCards}</div></div><div class="bookmark-note"><strong>★</strong><span>Favorites are personal bookmarks only. They make a spell easier to find and do not prepare it.</span></div><div class="slotgrid">${levels.map(level=>slotCard(level)).join("")}</div><div class="actionrow"><button class="action secondary" id="clearPrepared">Clear today’s preparation</button></div></section>`;
 const unsupported=prepared.filter(s=>!slotInfo(s.l).normal); if(unsupported.length)el.innerHTML+=`<div class="warning">${unsupported.length} prepared spell${unsupported.length===1?" is":"s are"} above the current Cleric level or Wisdom limit. Remove ${unsupported.length===1?"it":"them"} before play.</div>`;
 const grouped=levels.map(level=>({level,normal:prepared.filter(s=>s.l===level&&!isDomain(s)),domain:prepared.filter(s=>s.l===level&&isDomain(s))}));
 grouped.forEach(group=>{const section=document.createElement("div");section.className="level";section.innerHTML=`<div class="levelhead"><strong>${group.level===0?"0 · Orisons":ordinal(group.level)+" · Spells"}</strong><span class="count">${group.normal.length} cleric · ${group.domain.length} domain</span></div>`;[...group.normal,...group.domain].forEach(s=>{const row=document.createElement("div");row.className="spellrow";row.innerHTML=`<div></div><div><div class="spellname">${esc(s.n)}</div><div class="meta">${sourceLabel(s.source)} · ${esc(s.s)} · DC ${spellDC(s.l)}</div></div><button class="star" aria-label="Open ${esc(s.n)}">→</button>`;row.onclick=()=>{openSpell(s);document.getElementById("modal").classList.add("show")};section.appendChild(row);});el.appendChild(section);});
 if(!prepared.length)el.innerHTML+='<div class="empty">No spells prepared yet. Go to Cleric, Magic Domain, or Balance Domain and tick a checkbox.</div>';
 document.getElementById("clearPrepared").onclick=()=>{state.prepared=[];save();render();if(selected)openSpell(selected);};
}
function slotCard(level){const info=slotInfo(level),normal=preparedAt(level,false).length,domain=preparedAt(level,true).length,over=normal>info.normal||domain>info.domain;return `<div class="slotcard ${over?"over":""}"><h3>${level===0?"0 · Orisons":ordinal(level)+" · Spells"}</h3><p>${info.normal} cleric${info.domain?" + 1 domain":""}</p><div class="used">${normal} / ${info.normal}${info.domain?` · ${domain} / 1 D`:""}</div></div>`;}
function ordinal(number){return["","1st","2nd","3rd"][number]||number+"th";}
function togglePrepared(s){
 const spellKey=key(s.source,s.l,s.n),index=state.prepared.indexOf(spellKey); if(index>=0){state.prepared.splice(index,1);}else{const domain=isDomain(s),info=slotInfo(s.l),limit=domain?info.domain:info.normal;if(!limit){alert(`Caelian cannot prepare ${ordinal(s.l)}-level spells at Cleric ${characterLevel()} with Wisdom ${wisdom()}.`);return;}if(preparedAt(s.l,domain).length>=limit){alert(domain?`The ${ordinal(s.l)}-level domain slot is already filled. Remove that domain spell first.`:`All ${limit} ${ordinal(s.l)}-level cleric slots are filled. Remove a spell first.`);return;}state.prepared.push(spellKey);}save();render();if(selected)openSpell(selected);
}
function toggleFavorite(s){const spellKey=key(s.source,s.l,s.n),index=state.favorites.indexOf(spellKey);index>=0?state.favorites.splice(index,1):state.favorites.push(spellKey);save();render();if(selected)openSpell(selected);}
function updateBadge(){document.getElementById("preparedBadge").textContent=state.prepared.length+" prepared";}
function syncCharacterUI(){
 const subtitle=document.querySelector(".title p"),note=document.querySelector(".settings .meta"),mobileNote=document.getElementById("mobileCharacterNote");
 ["charLevel","mobileCharLevel"].forEach(id=>document.getElementById(id).value=characterLevel());["wis","mobileWis"].forEach(id=>document.getElementById(id).value=wisdom());subtitle.textContent=`D&D 3.5 · Cleric ${characterLevel()} · Wisdom ${wisdom()} (${wisdomModifier()>=0?"+":""}${wisdomModifier()})`;
 const text=`Slots and spell DCs update from Cleric level and Wisdom. This sheet retains Caelian’s existing +1 1st-level slot adjustment.`;note.textContent=text;mobileNote.textContent=text;
}
function slotSummaryHTML(){const levels=activeSpellLevels();return levels.map(level=>{const info=slotInfo(level);return `<div class="slotline"><span>${level===0?"Orisons":ordinal(level)+" level"}</span><b>${preparedAt(level,false).length}/${info.normal}${info.domain?` · ${preparedAt(level,true).length}/1 D`:""}</b></div>`;}).join("")+`<div class="slotline"><span>Spell DCs</span><b>Listed by level</b></div>`+levels.map(level=>`<div class="slotline"><span>DC · ${level===0?"0-level":ordinal(level)}</span><b>${spellDC(level)}</b></div>`).join("")+`<div class="slotline"><span>Caster level</span><b>${characterLevel()}</b></div>`;}
function updateSlots(){syncCharacterUI();const html=slotSummaryHTML();document.getElementById("slots").innerHTML=html;document.getElementById("mobileSlots").innerHTML=html;}
function applyCharacterChanges(event){
 const levelInput=document.getElementById("charLevel"),wisInput=document.getElementById("wis"),source=event&&event.currentTarget&&event.currentTarget.id.startsWith("mobile"),mobileLevel=document.getElementById("mobileCharLevel"),mobileWis=document.getElementById("mobileWis");
 if(source){levelInput.value=mobileLevel.value;wisInput.value=mobileWis.value;}
 state.character.level=Math.min(20,Math.max(1,Number.parseInt(levelInput.value,10)||1));state.character.wisdom=Math.min(60,Math.max(1,Number.parseInt(wisInput.value,10)||1));save();render();if(selected)openSpell(selected);
}
function closeModal(){document.getElementById("modal").classList.remove("show");}
document.querySelectorAll(".tab").forEach(button=>button.onclick=()=>{document.querySelectorAll(".tab").forEach(item=>item.classList.remove("active"));button.classList.add("active");tab=button.dataset.tab;document.getElementById("levelFilter").value="all";document.getElementById("preparedFilter").value="all";render();});
["search","levelFilter","preparedFilter"].forEach(id=>{const input=document.getElementById(id);input.oninput=render;input.onchange=render;});
["charLevel","wis","mobileCharLevel","mobileWis"].forEach(id=>{const input=document.getElementById(id);input.onchange=applyCharacterChanges;});
function closeMobileTools(){document.getElementById("mobileToolsDrawer").classList.remove("show");document.getElementById("mobileToolsBackdrop").classList.remove("show");document.getElementById("mobileToolsDrawer").setAttribute("aria-hidden","true");document.getElementById("mobileToolsButton").setAttribute("aria-expanded","false");}
function openMobileTools(){document.getElementById("mobileToolsDrawer").classList.add("show");document.getElementById("mobileToolsBackdrop").classList.add("show");document.getElementById("mobileToolsDrawer").setAttribute("aria-hidden","false");document.getElementById("mobileToolsButton").setAttribute("aria-expanded","true");}
document.getElementById("mobileToolsButton").onclick=openMobileTools;document.getElementById("mobileToolsClose").onclick=closeMobileTools;document.getElementById("mobileToolsBackdrop").onclick=closeMobileTools;
document.getElementById("modal").onclick=event=>{if(event.target.id==="modal")closeModal();};
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeModal();closeMobileTools();}});
render();
