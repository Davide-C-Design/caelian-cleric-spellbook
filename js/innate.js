/* Racial and innate spell tracking. Kept separate from prepared cleric slots. */
(function(){
  const STORAGE_KEY="caelianInnateSpells";
  const load=()=>{try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(value)?value:[]}catch(e){return[];}};
  let spells=load();
  const save=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(spells));
  const esc=value=>String(value??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const styles=`
    .innate-panel{margin-top:18px;background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:15px}
    .innate-panel h3{margin:0 0 5px;font:700 17px Georgia,serif}.innate-help{margin:0 0 12px;color:var(--muted)}
    .innate-form{display:grid;grid-template-columns:minmax(150px,1fr) 105px minmax(150px,1fr) auto;gap:8px;align-items:end}
    .innate-form label{display:grid;gap:4px;color:var(--muted);font-size:12px}.innate-form input{width:100%;background:var(--panel2);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:8px}
    .innate-form button,.innate-card button{border:1px solid #77633f;background:#2a251b;color:#f1d69c;border-radius:8px;padding:8px 10px}
    .innate-list{display:grid;gap:8px;margin-top:12px}.innate-card{display:flex;gap:10px;align-items:center;justify-content:space-between;background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:10px}.innate-card strong{display:block}.innate-card small{color:var(--muted)}.innate-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.innate-count{font-weight:700;white-space:nowrap}.innate-empty{color:var(--muted);font-style:italic}
    @media(max-width:800px){.innate-form{grid-template-columns:1fr 90px}.innate-form label:first-child{grid-column:1/-1}.innate-form label:nth-child(3){grid-column:1/-1}.innate-form button{grid-column:1/-1}.innate-card{align-items:flex-start;flex-direction:column}}
  `;
  function render(){
    const panel=document.getElementById("innatePanel"); if(!panel)return;
    panel.innerHTML=`<h3>Racial &amp; Innate Spells</h3><p class="innate-help">Track spells granted by your race, class feature, or another ability. These do not consume prepared cleric or domain slots.</p>
      <form class="innate-form" id="innateForm"><label>Spell or ability<input id="innateName" required maxlength="80" placeholder="Daylight"></label><label>Uses / day<input id="innateMax" required type="number" min="1" max="99" value="1"></label><label>Notes <input id="innateNotes" maxlength="160" placeholder="Aasimar racial ability"></label><button type="submit">Add innate spell</button></form>
      <div class="innate-list">${spells.length?spells.map((spell,index)=>`<div class="innate-card"><div><strong>${esc(spell.name)}</strong><small>${esc(spell.notes||"Racial / innate spell")}</small></div><div class="innate-actions"><span class="innate-count">${spell.remaining} / ${spell.max} today</span><button type="button" data-use="${index}" ${spell.remaining<1?"disabled":""}>Use once</button><button type="button" data-reset="${index}">Reset</button><button type="button" data-remove="${index}" aria-label="Remove ${esc(spell.name)}">Remove</button></div></div>`).join(""):"<div class="innate-empty">No racial or innate spells added yet.</div>"}</div>`;
    panel.querySelector("#innateForm").onsubmit=event=>{event.preventDefault();const max=Math.max(1,Math.min(99,Number.parseInt(panel.querySelector("#innateMax").value,10)||1));spells.push({name:panel.querySelector("#innateName").value.trim(),max,remaining:max,notes:panel.querySelector("#innateNotes").value.trim()});save();render();};
    panel.querySelectorAll("[data-use]").forEach(button=>button.onclick=()=>{const spell=spells[Number(button.dataset.use)];if(spell&&spell.remaining>0){spell.remaining--;save();render();}});
    panel.querySelectorAll("[data-reset]").forEach(button=>button.onclick=()=>{const spell=spells[Number(button.dataset.reset)];if(spell){spell.remaining=spell.max;save();render();}});
    panel.querySelectorAll("[data-remove]").forEach(button=>button.onclick=()=>{spells.splice(Number(button.dataset.remove),1);save();render();});
  }
  function init(){
    if(document.getElementById("innatePanel"))return;
    const panel=document.createElement("section");panel.id="innatePanel";panel.className="innate-panel";
    const settings=document.querySelector(".settings");(settings||document.querySelector("main")).insertAdjacentElement("afterend",panel);
    const style=document.createElement("style");style.textContent=styles;document.head.appendChild(style);render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
