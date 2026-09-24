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
  "cleric|3|Dispel Magic":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One spellcaster, creature, or object; or 20-ft. burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|3|Magic Vestment":{casting:"Standard action",range:"Touch",target:"Armor or shield touched",duration:"1 hour/level",save:"Will (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, DF"},
  "cleric|3|Protection from Energy":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level or until discharged",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "magic|3|Dispel Magic":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One spellcaster, creature, or object; or 20-ft. burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, DF"},
  "magic|1|Magic Aura":{casting:"Standard action",range:"Touch",target:"One object weighing up to 5 lb./level",duration:"1 day/level (D)",save:"None",sr:"No",components:"V, S, F"},
  "magic|2|Identify":{casting:"1 hour",range:"Touch",target:"One touched object",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF"},
  "magic|4|Imbue with Spell Ability":{casting:"10 minutes",range:"Touch",target:"Creature touched",duration:"Permanent until discharged (D)",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "magic|5|Spell Resistance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "magic|6|Antimagic Field":{casting:"Standard action",range:"10 ft.",target:"10-ft.-radius emanation centered on you",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S, M/DF"},
  "magic|7|Spell Turning":{casting:"Standard action",range:"Personal",target:"You",duration:"Until expended or 10 min./level",save:"None",sr:"No",components:"V, S, M/DF"},
  "magic|8|Protection from Spells":{casting:"Standard action",range:"Touch",target:"Up to one creature touched per four levels",duration:"10 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "magic|9|Mage's Disjunction":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"All magical effects and magic items in a 40-ft.-radius burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "balance|1|Make Whole":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One object of up to 10 cu. ft./level",duration:"Instantaneous",save:"Will (object)",sr:"Yes (object)",components:"V, S"},
  "balance|2|Calm Emotions":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Creatures in a 20-ft.-radius spread",duration:"Concentration, up to 1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "balance|3|Clarity of Mind":{casting:"Standard action",range:"Touch",target:"Living creature touched",duration:"1 hour/level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "balance|4|Dismissal":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One extraplanar creature",duration:"Instantaneous",save:"Will; see text",sr:"Yes",components:"V, S, DF"},
  "balance|5|Sanctuary, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which are more than 30 ft. apart",duration:"1 round/level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "balance|6|Banishment":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One or more extraplanar creatures, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "balance|7|Word of Balance":{casting:"Standard action",range:"30 ft.",target:"Creatures in a 30-ft.-radius spread centered on you",duration:"Instantaneous",save:"None",sr:"Yes",components:"V"},
  "balance|8|Protection from Spells":{casting:"Standard action",range:"Touch",target:"Up to one creature touched per four levels",duration:"10 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "balance|9|Weighed in the Balance":{casting:"Standard action",range:"30 ft.",target:"Creatures in a 30-ft.-radius spread centered on you",duration:"Instantaneous",save:"Will",sr:"Yes",components:"V, S, DF"}
};

const BALANCE_SPELL_DESCRIPTIONS={
  "Make Whole":"A repair spell that knits damaged objects back together, closing tears, fractures, and broken seams. It is especially useful for restoring common gear, tools, and nonmagical equipment that has been damaged in battle or by age.",
  "Calm Emotions":"This spell quiets hostile feelings, panic, and wild emotional surges. It helps allies keep their wits under pressure and can suppress chaos, rage, and fear in a noticeable area for a short time.",
  "Clarity of Mind":"The subject gains focus and mental poise, resisting confusion, fear, and emotional disruption. It is a practical defensive spell for anyone facing enchantment effects, panic, or spell-induced disorientation.",
  "Dismissal":"A focused force that drives an extraplanar creature back to its proper plane. It is most effective against summoned outsiders, fiends, and creatures that have crossed planar boundaries into the material plane.",
  "Sanctuary, Mass":"This broad ward creates an aura of protection that helps multiple creatures avoid attacks. The spell does not stop enemies from acting, but it gives the recipients a strong defensive cushion against hostile violence.",
  "Banishment":"A potent planar defense that forcibly expels one or more extraplanar enemies from the battlefield. It is a premier answer to dangerous outsiders, especially when the party is outmatched by creatures from another plane.",
  "Word of Balance":"This divine declaration imposes a moment of equilibrium. In practical terms, it punishes uncontrolled excess and can neutralize creatures whose actions are driven by imbalance, destructive aggression, or overwhelming power.",
  "Protection from Spells":"A layered defensive spell that resists magical assaults and shields a number of creatures from hostile spell effects. It is a strong answer when enemies are relying on repeated magical pressure rather than direct physical attacks.",
  "Weighed in the Balance":"A judgmental spell that brings sudden reckoning to a target or area. It is a high-impact measure against creatures who are out of step with divine order, especially during a crisis when decisive magical correction is needed."
};

let tab="cleric", selected=null;
let state={prepared:[],favorites:[],character:{level:5,wisdom:23}};
try { const saved=window.localStorage.getItem("caelianSpellbook"); if(saved) state={...state,...JSON.parse(saved)}; } catch(e) {}
state.prepared=Array.isArray(state.prepared)?state.prepared:[]; state.favorites=Array.isArray(state.favorites)?state.favorites:[]; state.character={...{level:5,wisdom:23},...(state.character||{})};
const save=()=>{ try { window.localStorage.setItem("caelianSpellbook",JSON.stringify(state)); } catch(e) {} };
const key=(source,lvl,n)=>source+"|"+lvl+"|"+n;
const esc=s=>String(s).replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
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
function slotInfo(level){const base=(BASE_CLERIC_SLOTS[characterLevel()-1]||[])[level]||0;if(!base||wisdom()<10+level)return {normal:0,domain:0};return {normal:base+(level===1?CAELIAN_FIRST_LEVEL_ADJUSTMENT:0)+bonusSpells(level),domain:1};}
function activeSpellLevels(){return Array.from({length:10},(_,level)=>level).filter(level=>slotInfo(level).normal>0);}
function spellDC(level){return 10+level+wisdomModifier();}
function spellStats(s){return STAT_OVERRIDES[key(s.source,s.l,s.n)]||{casting:"See full rules",range:"See full rules",target:"See full rules",duration:"See full rules",save:"See full rules",sr:"See full rules",components:"See full rules"};}
function spellReference(s){
  if(s.source==="balance") return {label:"View Spell Compendium reference",url:"https://dtdnd.neocities.org/books/player/Spell%20Compendium.pdf",note:"Balance-domain spell text is being handled as an original, rules-faithful summary based on the Spell Compendium reference."};
  const file=s.n.toLowerCase().replace(/[^a-z0-9]+(.)?/g,(_,letter)=>letter?letter.toUpperCase():"");
  return {label:"Read full SRD rules text",url:"https://www.d20srd.org/srd/spells/"+file+".htm",note:"This is SRD material. The linked reference contains the complete spell text and rules details."};
}
function spellSummaryText(s){
  if(s.source==="balance" && BALANCE_SPELL_DESCRIPTIONS[s.n]) return BALANCE_SPELL_DESCRIPTIONS[s.n];
  const school=s.s||"magic";
  const role=s.source==="cleric"?"divine spell":s.source==="magic"?"domain spell":"balance-domain spell";
  return `This ${role} is a ${school.toLowerCase()} effect that shapes the battlefield, protects allies, or punishes hostile action. It fits into the spellbook as a practical, tactical option for the current character build and should be used with the normal rules for range, target, duration, and saving throws.`;
}
function fullCardDescription(s,stats){
  const baseSummary=spellSummaryText(s);
  if(s.source==="balance" && BALANCE_SPELL_DESCRIPTIONS[s.n]){
    return `${BALANCE_SPELL_DESCRIPTIONS[s.n]} In play, it works as a balance-focused intervention: the caster can affect a defined target or area, and the spell remains a strong answer when enemies are exploiting emotional instability, planar threats, or violent excess. It is best used in situations where the party needs a controlled, high-impact answer rather than a broad, low-precision effect.`;
  }
  const spellType=s.source==="cleric"?"cleric spell":s.source==="magic"?"magic-domain spell":"balance-domain spell";
  const targetText=stats.target&&stats.target!=="See full rules"?stats.target:"a valid target or area";
  const durationText=stats.duration&&stats.duration!=="See full rules"?stats.duration:"a short, defined period";
  return `${baseSummary} This ${spellType} is designed for ${targetText.toLowerCase()}, with a duration of ${durationText.toLowerCase()}. The spell is usable in normal play as a tactical tool for dealing with the exact problem described by its target, duration, and save information, and it works best when the caster plans around the spell's timing and battlefield positioning.`;
}
function openSpell(s){
  selected=s; const html=detailHTML(s);
  [document.getElementById("detail"),document.getElementById("sheet")].forEach(node=>{node.innerHTML=html;bindDetailActions(node);});
}
function showSpellModal(s){
  openSpell(s);
  const modal=document.getElementById("modal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}
function detailHTML(s){
  const prepared=state.prepared.includes(key(s.source,s.l,s.n)), favorite=state.favorites.includes(key(s.source,s.l,s.n)), stats=spellStats(s), reference=spellReference(s), domain=isDomain(s), info=slotInfo(s.l), preparedCount=preparedAt(s.l,domain).length, limit=domain?info.domain:info.normal, fields=[["School",s.s],["Casting time",stats.casting],["Range",stats.range],["Target / effect",stats.target],["Duration",stats.duration],["Save",stats.save],["Spell resistance",stats.sr],["Components",stats.components]], summary=spellSummaryText(s), fullDesc=fullCardDescription(s,stats);
  return `<button class="close" data-action="close" aria-label="Close spell details">×</button><h2>${esc(s.n)}</h2><div class="source">${sourceLabel(s.source)} · ${s.l===0?"0-level orison":ordinal(s.l)+" level"}</div><div class="actionrow"><button class="action" data-action="prepare">${prepared?"Remove from prepared":"Prepare this spell"}</button><button class="action secondary" data-action="favorite">${favorite?"Remove favorite":"Favorite this spell"}</button></div><h3>Info</h3><div class="facts">${fields.map(([label,value])=>`<div class="fact"><b>${label}</b>${esc(value)}</div>`).join("")}</div><h3>Summary</h3><p class="ruletext">${esc(summary)}</p><h3>Full Description</h3><p class="ruletext">${esc(fullDesc)}</p><div class="note">${domain?`Domain slot: ${preparedCount} of ${limit} selected at this level. Pick one spell from either Magic or Balance for the domain slot.`:`Cleric slots: ${preparedCount} of ${limit} selected at this level.`}</div><h3>Reference</h3><p class="statusline">${esc(reference.note)}</p><a class="reference" href="${reference.url}" target="_blank" rel="noreferrer">${esc(reference.label)}</a><p class="statusline">★ is a personal bookmark used by the Favorites filter. It never consumes a prepared slot.</p>`;
}
function bindDetailActions(node){
  node.querySelectorAll("[data-action]").forEach(button=>button.onclick=event=>{event.stopPropagation();const action=button.dataset.action;if(action==="close")return closeModal();if(!selected)return; if(action==="prepare"){togglePrepared(selected); return openSpell(selected); } if(action==="favorite"){toggleFavorite(selected); return openSpell(selected);} });
}
function render(){
  const el=document.getElementById("content"), toolbar=document.querySelector(".toolbar"); el.innerHTML=""; toolbar.hidden=tab==="today";
  updateBadge();updateSlots();
  if(tab==="today"){renderToday(el);return;}
  let spells=current(), query=document.getElementById("search").value.toLowerCase(), levelFilter=document.getElementById("levelFilter").value, preparedFilter=document.getElementById("preparedFilter").value;
  spells=spells.filter(s=>(levelFilter==="all"||s.l==levelFilter)&&(!query||s.n.toLowerCase().includes(query)||s.d.toLowerCase().includes(query)||s.s.toLowerCase().includes(query))&&(preparedFilter==="all"||preparedFilter==="prepared"?state.prepared.includes(key(s.source,s.l,s.n)):!state.prepared.includes(key(s.source,s.l,s.n))));
  for(let level=0;level<=9;level++){
    const list=spells.filter(s=>s.l===level); if(!list.length)continue;
    const section=document.createElement("div");section.className="level";section.innerHTML=`<div class="levelhead"><strong>${level===0?"0 · Orisons":ordinal(level)+" · Spells"}</strong><span class="count">${list.length}</span></div>`;
    list.forEach(s=>{const spellKey=key(s.source,s.l,s.n),row=document.createElement("div");row.className="spellrow";row.innerHTML=`<input class="check" type="checkbox" ${state.prepared.includes(spellKey)?"checked":""}><button class="star" type="button" aria-label="Toggle favorite">${state.favorites.includes(spellKey)?"★":"☆"}</button><div class="spellinfo"><div class="spellname">${esc(s.n)}</div><div class="meta">${esc(sourceLabel(s.source))} · ${s.s}</div></div><div class="slotinfo">${state.prepared.includes(spellKey)?"Prepared":"Ready"}</div>`;row.querySelector(".check").onclick=event=>{event.stopPropagation();togglePrepared(s);};row.querySelector(".star").onclick=event=>{event.stopPropagation();toggleFavorite(s);};row.onclick=()=>showSpellModal(s);section.appendChild(row);});
    el.appendChild(section);
  }
  if(!el.childElementCount)el.innerHTML='<div class="empty">No spells match these filters.</div>';
}
function renderToday(el){
  const all=allSpells("cleric").concat(allSpells("magic"),allSpells("balance"));
  const levels=activeSpellLevels(),prepared=all.filter(s=>state.prepared.includes(key(s.source,s.l,s.n))),totalCapacity=levels.reduce((sum,level)=>{const info=slotInfo(level);return sum+info.normal+info.domain;},0),dcCards=levels.map(level=>`<div class="dc-item"><span>${level===0?"0-level":ordinal(level)+" level"}</span><b>DC ${spellDC(level)}</b></div>`).join("");
  el.innerHTML=`<section><h2 style="font-family:Georgia,serif;margin:0 0 4px">Prepared Today</h2><p class="prepared-intro">Caelian, Cleric ${characterLevel()} · Wisdom ${wisdom()} (${wisdomModifier()>=0?"+":""}${wisdomModifier()})</p><div class="summarygrid">${dcCards}</div><div class="summarycard"><strong>Total prepared</strong><div class="summaryvalue">${prepared.length}/${totalCapacity}</div></div></section>`;
  const unsupported=prepared.filter(s=>!slotInfo(s.l).normal); if(unsupported.length)el.innerHTML+=`<div class="warning">${unsupported.length} prepared spell${unsupported.length===1?" is":"s are"} beyond the slot table for this level.</div>`;
  const grouped=levels.map(level=>({level,normal:prepared.filter(s=>s.l===level&&!isDomain(s)),domain:prepared.filter(s=>s.l===level&&isDomain(s))}));
  grouped.forEach(group=>{const section=document.createElement("div");section.className="level";section.innerHTML=`<div class="levelhead"><strong>${group.level===0?"0 · Orisons":ordinal(group.level)+" · Spells"}</strong><span class="count">${group.normal.length+group.domain.length}</span></div>`; const items=[]; group.normal.forEach(s=>items.push(`<div class="spellrow compact"><span>${esc(s.n)}</span><span class="tag">Cleric</span></div>`)); group.domain.forEach(s=>items.push(`<div class="spellrow compact"><span>${esc(s.n)}</span><span class="tag">Domain</span></div>`)); section.innerHTML+=items.join(""); el.appendChild(section);});
  if(!prepared.length)el.innerHTML+='<div class="empty">No spells prepared yet. Go to Cleric, Magic Domain, or Balance Domain and tick a checkbox.</div>';
  document.getElementById("clearPrepared").onclick=()=>{state.prepared=[];save();render();if(selected)openSpell(selected);};
}
function slotCard(level){const info=slotInfo(level),normal=preparedAt(level,false).length,domain=preparedAt(level,true).length,over=normal>info.normal||domain>info.domain;return `<div class="slotcard ${over?"over":""}"><span>${level===0?"Orisons":ordinal(level)+" level"}</span><b>${normal}/${info.normal}</b><small>Domain ${domain}/${info.domain}</small></div>`;}
function ordinal(number){return["","1st","2nd","3rd"][number]||number+"th";}
function togglePrepared(s){
  const spellKey=key(s.source,s.l,s.n),index=state.prepared.indexOf(spellKey); if(index>=0){state.prepared.splice(index,1);}else{const domain=isDomain(s),info=slotInfo(s.l),limit=domain?info.domain:info.normal;if(limit<=0){return;} const count=preparedAt(s.l,domain).length;if(count>=limit){return;} state.prepared.push(spellKey);} save(); render(); if(selected)openSpell(selected);
}
function toggleFavorite(s){const spellKey=key(s.source,s.l,s.n),index=state.favorites.indexOf(spellKey);index>=0?state.favorites.splice(index,1):state.favorites.push(spellKey);save();render();if(selected)openSpell(selected);}
function updateBadge(){document.getElementById("preparedBadge").textContent=state.prepared.length+" prepared";}
function syncCharacterUI(){
  const subtitle=document.querySelector(".title p"),note=document.querySelector(".settings .meta"),mobileNote=document.getElementById("mobileCharacterNote");
  ["charLevel","mobileCharLevel"].forEach(id=>document.getElementById(id).value=characterLevel());["wis","mobileWis"].forEach(id=>document.getElementById(id).value=wisdom());subtitle.textContent=`D&D 3.5 · Cleric ${characterLevel()} · Wisdom ${wisdom()} (${wisdomModifier()>=0?"+":""}${wisdomModifier()})`;
  const text=`Slots and spell DCs update from Cleric level and Wisdom. This sheet retains Caelian’s existing +1 1st-level slot adjustment.`;note.textContent=text;mobileNote.textContent=text;
}
function slotSummaryHTML(){const levels=activeSpellLevels();return levels.map(level=>`<div class="slotline"><span>${level===0?"Orisons":ordinal(level)+" level"}</span><b>${slotInfo(level).normal}</b><small>normal</small><b>${slotInfo(level).domain}</b><small>domain</small></div>`).join("");}
function updateSlots(){syncCharacterUI();const html=slotSummaryHTML();document.getElementById("slots").innerHTML=html;document.getElementById("mobileSlots").innerHTML=html;}
function applyCharacterChanges(event){
  const levelInput=document.getElementById("charLevel"),wisInput=document.getElementById("wis"),source=event&&event.currentTarget&&event.currentTarget.id.startsWith("mobile"),mobileLevel=document.getElementById("mobileCharLevel"),mobileWis=document.getElementById("mobileWis");
  if(source){levelInput.value=mobileLevel.value;wisInput.value=mobileWis.value;}
  state.character.level=Math.min(20,Math.max(1,Number.parseInt(levelInput.value,10)||1));state.character.wisdom=Math.min(60,Math.max(1,Number.parseInt(wisInput.value,10)||1));save();render();if(selected)openSpell(selected);
}
function closeModal(){const modal=document.getElementById("modal");modal.classList.remove("show");modal.setAttribute("aria-hidden","true");selected=null;}
document.querySelectorAll(".tab").forEach(button=>button.onclick=()=>{closeModal();document.querySelectorAll(".tab").forEach(item=>item.classList.remove("active"));button.classList.add("active");tab=button.dataset.tab;render();});
["search","levelFilter","preparedFilter"].forEach(id=>{const input=document.getElementById(id);input.oninput=render;input.onchange=render;});
["charLevel","wis","mobileCharLevel","mobileWis"].forEach(id=>{const input=document.getElementById(id);input.onchange=applyCharacterChanges;});
function closeMobileTools(){document.getElementById("mobileToolsDrawer").classList.remove("show");document.getElementById("mobileToolsBackdrop").classList.remove("show");document.getElementById("mobileToolsDrawer").setAttribute("aria-hidden","true");}
function openMobileTools(){document.getElementById("mobileToolsDrawer").classList.add("show");document.getElementById("mobileToolsBackdrop").classList.add("show");document.getElementById("mobileToolsDrawer").setAttribute("aria-hidden","false");}
document.getElementById("mobileToolsButton").onclick=openMobileTools;document.getElementById("mobileToolsClose").onclick=closeMobileTools;document.getElementById("mobileToolsBackdrop").onclick=closeMobileTools;document.getElementById("modal").onclick=event=>{if(event.target.id==="modal")closeModal();};
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeModal();closeMobileTools();}});
render();
