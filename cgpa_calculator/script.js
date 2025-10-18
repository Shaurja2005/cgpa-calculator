// Extracted script from cgpa.html
const semestersEl = document.getElementById('semesters');
const addSemesterBtn = document.getElementById('addSemester');
const clearAllBtn = document.getElementById('clearAll');
const calcAllBtn = document.getElementById('calcAll');
const totalCreditsEl = document.getElementById('totalCredits');
const cgpaEl = document.getElementById('cgpa');
const saveBtn = document.getElementById('save');
const printBtn = document.getElementById('print');

const defaultMapping = [
  {min:85, max:100, gp:10, label:'S'},
  {min:75, max:84, gp:9, label:'A'},
  {min:65, max:74, gp:8, label:'B'},
  {min:55, max:64, gp:7, label:'C'},
  {min:50, max:54, gp:6, label:'D'},
  {min:45, max:49, gp:5, label:'E'},
  {min:0, max:44, gp:0, label:'F'}
];
let mapping = defaultMapping.slice();

function normalizeMapping(){
  const defaultLabels = ['S','A','B','C','D','E','F'];
  let assigned = 0;
  for(let i=0;i<mapping.length;i++){
    if(mapping[i].label === undefined || mapping[i].label === null){
      if(assigned < defaultLabels.length) mapping[i].label = defaultLabels[assigned++];
      else mapping[i].label = String(mapping[i].gp);
    }
  }
}
normalizeMapping();

function saveMapping(){ }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c;
  });
}

function labelToGp(label){ if(!label) return null; const L=String(label).trim().toUpperCase(); const m=mapping.find(r=>r.label && String(r.label).toUpperCase()===L); return m?m.gp:null; }
function gpForLabelDisplay(label){ if(!label) return null; const L=String(label).trim().toUpperCase(); if(L==='E') return 5; const m=labelToGp(L); if(m!==null) return m; const fb={S:10,A:9,B:8,C:7,D:6,F:0}; return fb[L]!==undefined?fb[L]:0; }
const fallbackLabelMap={S:10,A:9,B:8,C:7,D:6,F:0};

function marksToGp(marks){ const m=mapping.find(r=>marks>=r.min && marks<=r.max); return m?m.gp:0; }
function gradeInputToGp(raw){ if(raw===null||raw===undefined) return 0; const s=String(raw).trim(); if(s==='') return 0; const num=Number(s); if(!isNaN(num)) return marksToGp(num); const L=s.toUpperCase(); if(L==='E') return 5; const gp=labelToGp(L); if(gp!==null) return gp; if(L.length===1 && fallbackLabelMap[L]!==undefined) return fallbackLabelMap[L]; return 0; }

function createSemester(title){
  const sid = Date.now()+Math.random();
  const sem=document.createElement('div'); sem.className='card'; sem.dataset.sid=sid; sem.style.marginTop='12px';
  sem.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <strong>${escapeHtml(title||'Semester')}</strong>
      <div class="muted">(semester)</div>
      <div style="margin-left:auto;display:flex;gap:8px">
        <button class="addSub btn-secondary">+ Subject</button>
        <button class="rmSem btn-secondary">Remove semester</button>
      </div>
    </div>
    <table class="semTable"><thead><tr><th style="width:36px">#</th><th>Subject</th><th style="width:120px">Credits</th><th style="width:140px">Grade/Marks</th><th style="width:120px" class="right">Points</th><th style="width:90px"></th></tr></thead><tbody></tbody></table>
    <div style="display:flex;gap:16px;align-items:center;margin-top:10px"><div><div class="small">Semester credits</div><div class="semCredits big">0</div></div><div><div class="small">Semester GPA</div><div class="semGpa big">0.00</div></div></div>
  `;
  semestersEl.appendChild(sem);
  const tbody=sem.querySelector('tbody');
  sem.querySelector('.addSub').addEventListener('click', ()=>{ createSubRow(tbody); renumber(tbody); updateSemester(tbody); refreshAllGradeSelects(); });
  sem.querySelector('.rmSem').addEventListener('click', ()=>{ if(confirm('Remove this semester?')){ sem.remove(); calcAll(); } });
  createSubRow(tbody,'Subject 1',3,'');
  createSubRow(tbody,'Subject 2',3,'');
  renumber(tbody); refreshAllGradeSelects();
  return sem;
}

function createSubRow(tbody, subject='', credits='', grade=''){
  const tr=document.createElement('tr');
  tr.innerHTML = `
    <td></td>
    <td><input type="text" class="subj" placeholder="Subject" value="${escapeHtml(subject)}"></td>
    <td><input type="number" class="cred" min="0" step="0.5" value="${credits}"></td>
    <td><input type="text" class="grade" placeholder="Grade (S/A/B/...) or marks" value="${escapeHtml(grade)}" style="width:60%"><select class="gradeSel" style="margin-left:8px;display:inline-block;width:30%"></select></td>
    <td class="right points">0.00</td>
    <td class="right"><button class="rm">Remove</button></td>
  `;
  tbody.appendChild(tr);
  const inpCred=tr.querySelector('.cred');
  const inpGrade=tr.querySelector('.grade');
  const selGrade=tr.querySelector('.gradeSel');
  function populateSelectOptions(){ selGrade.innerHTML=''; const standard=['S','A','B','C','D','E','F']; const empty=document.createElement('option'); empty.value=''; empty.textContent='Select'; selGrade.appendChild(empty); standard.forEach(l=>{ const gp=gpForLabelDisplay(l); const o=document.createElement('option'); o.value=l; o.textContent=`${l} (${gp})`; selGrade.appendChild(o); }); selGrade.style.display='inline-block'; }
  populateSelectOptions();
  try{ console.log('populateSelectOptions ->', Array.from(selGrade.options).map(o=>o.value + ':' + o.textContent)); }catch(e){}
  if(grade){ inpGrade.value=String(grade).toUpperCase(); const opt=Array.from(selGrade.options).find(o=>o.value && o.value.toUpperCase()===String(grade).toUpperCase()); if(opt) opt.selected=true; }
  updateRowPoints(tr); updateSemester(tbody);
  selGrade.addEventListener('change', ()=>{
    console.log('grade select changed ->', selGrade.value);
    if(selGrade.value) inpGrade.value = selGrade.value;
    updateRowPoints(tr);
    updateSemester(tbody);
  });
  selGrade.addEventListener('input', ()=>{
    console.log('grade select input ->', selGrade.value);
    if(selGrade.value) inpGrade.value = selGrade.value;
    updateRowPoints(tr);
    updateSemester(tbody);
  });
  inpGrade.addEventListener('input', ()=>{
    console.log('grade input typed ->', inpGrade.value);
    const cur = inpGrade.value||'';
    const up = cur.toUpperCase();
    if(cur !== up) inpGrade.value = up;
    const val = String(inpGrade.value||'').trim().toUpperCase();
    if(val.length===1 && !['S','A','B','C','D','E','F'].includes(val)){
      alert('Invalid grade letter. Please enter only S, A, B, C, D, E, or F.');
      inpGrade.value = '';
      selGrade.selectedIndex = 0;
      updateRowPoints(tr);
      updateSemester(tbody);
      return;
    }
    let matched = false;
    Array.from(selGrade.options).forEach(opt=>{ if(opt.value && opt.value.toUpperCase()===val){ opt.selected = true; matched = true; } });
    if(!matched) selGrade.selectedIndex = 0;
    updateRowPoints(tr);
    updateSemester(tbody);
    calcAll();
  });
  
  inpGrade.addEventListener('change', ()=>{ console.log('grade input change ->', inpGrade.value); updateRowPoints(tr); updateSemester(tbody); calcAll(); });
  inpCred.addEventListener('input', ()=>{ updateRowPoints(tr); updateSemester(tbody); calcAll(); });
  tr.querySelector('.rm').addEventListener('click', ()=>{ tr.remove(); renumber(tbody); updateSemester(tbody); calcAll(); });
  return tr;
}

(function initGradeInputs(){ const rows=Array.from(document.querySelectorAll('input.grade')); rows.forEach(inp=>{ inp.placeholder='Grade (S/A/B/...) or marks'; }); refreshAllGradeSelects(); })();
function updateRowPoints(tr){
  const cred = parseFloat(tr.querySelector('.cred').value) || 0;
  const rawGrade = tr.querySelector('.grade').value;
  const grade = gradeInputToGp(rawGrade);
  const pts = cred * grade;
  const ptsCell = tr.querySelector('.points');
  if(ptsCell){
    ptsCell.textContent = pts.toFixed(2);
    try{ ptsCell.setAttribute('data-gp', String(grade)); }catch(e){}
  }
  try{
    console.log('updateRowPoints:', {cred, rawGrade, grade, pts});
    try{ console.log('mapping lookup label->gp:', rawGrade ? labelToGp(rawGrade) : '(no rawGrade)'); }catch(e){}
  }catch(e){}
  return {cred, rawGrade, grade, pts};
}
function renumber(tbody){ Array.from(tbody.querySelectorAll('tr')).forEach((r,i)=>r.children[0].textContent=i+1); }
function updateSemester(tbody){ const rows=Array.from(tbody.querySelectorAll('tr')); let sc=0, sp=0; rows.forEach(r=>{ const c=parseFloat(r.querySelector('.cred').value)||0; const raw=r.querySelector('.grade').value; const g=gradeInputToGp(raw); sc+=c; sp+=c*g; }); const semEl=tbody.closest('.card'); semEl.querySelector('.semCredits').textContent=sc.toFixed(2).replace(/\.00$/,''); const sg=sc>0?(sp/sc):0; semEl.querySelector('.semGpa').textContent=sg.toFixed(2); }
function refreshAllGradeSelects(){ const sels=Array.from(document.querySelectorAll('.gradeSel')); sels.forEach(sel=>{ const tr=sel.closest('tr'); const tbody=tr.closest('tbody'); sel.innerHTML=''; const empty=document.createElement('option'); empty.value=''; empty.textContent='Select'; sel.appendChild(empty); ['S','A','B','C','D','E','F'].forEach(l=>{ const gp=gpForLabelDisplay(l); const o=document.createElement('option'); o.value=l; o.textContent=`${l} (${gp})`; sel.appendChild(o); }); sel.style.display='inline-block'; }); }
function calcAll(){ const semCards=Array.from(semestersEl.querySelectorAll('.card')); console.log('calcAll starting for', semCards.length, 'semesters'); let totalCred=0, totalPoints=0; semCards.forEach(card=>{ const tbody=card.querySelector('tbody'); const rowsCount=tbody.querySelectorAll('tr').length; console.log(' processing semester', card.querySelector('strong')?card.querySelector('strong').textContent:'(unnamed)', 'rows=', rowsCount); Array.from(tbody.querySelectorAll('tr')).forEach(r=>updateRowPoints(r)); updateSemester(tbody); const sc=parseFloat(card.querySelector('.semCredits').textContent)||0; const sg=parseFloat(card.querySelector('.semGpa').textContent)||0; totalCred+=sc; totalPoints+=sc*sg; }); totalCreditsEl.textContent=totalCred.toFixed(2).replace(/\.00$/,''); const overall=totalCred>0?(totalPoints/totalCred):0; cgpaEl.textContent=overall.toFixed(2); return {totalCred, overall}; }
function clearAll(){ semestersEl.innerHTML=''; totalCreditsEl.textContent='0'; cgpaEl.textContent='0.00'; }
function save(){ }
function load(){ }
// clear stored data and reset the UI to defaults (no persistent storage present)
function resetSaved(){ mapping = defaultMapping.slice(); normalizeMapping(); clearAll(); createSemester('Semester 1'); refreshAllGradeSelects(); calcAll(); }
let _lastCalcAt=0; if(calcAllBtn){ function runCalc(evt){ try{ const now=Date.now(); if(now-_lastCalcAt<400) return; _lastCalcAt=now; console.log('Calculate triggered', evt&&evt.type); cgpaEl.textContent='Calculating...'; setTimeout(()=>{ calcAll(); }, 10); }catch(e){ console.error(e); alert('Calculation error: '+(e&&e.message?e.message:e)); } } calcAllBtn.addEventListener('click', runCalc); calcAllBtn.addEventListener('pointerdown', runCalc); calcAllBtn.onclick=runCalc; }else{ console.warn('Calculate button not found'); }
if(saveBtn){ saveBtn.addEventListener('click', ()=>{ const old=saveBtn.textContent; saveBtn.textContent='Saved'; setTimeout(()=> saveBtn.textContent=old, 900); save(); }); }
if(printBtn) printBtn.addEventListener('click', ()=>{ window.print(); });
// hook resetSaved button if present (will only reset UI; no persistent data)
const resetBtn = document.getElementById('resetSaved'); if(resetBtn){ resetBtn.addEventListener('click', ()=>{ if(confirm('Reset to defaults?')) resetSaved(); }); }
// wire up Add semester and Clear all buttons
if(addSemesterBtn){
  function runAddSemester(evt){
    try{
      console.log('Add semester triggered', evt && evt.type);
      // determine next semester number
      function getNextSemesterNumber(){
        const cards = Array.from(semestersEl.querySelectorAll('.card'));
        let max = 0;
        cards.forEach(card=>{
          const s = card.querySelector('strong');
          if(!s) return;
          const txt = (s.textContent||'').trim();
          const m = txt.match(/(\d+)\s*$/);
          if(m) max = Math.max(max, parseInt(m[1],10));
        });
        return max + 1;
      }
      const n = getNextSemesterNumber();
      const sem = createSemester('Semester ' + n);
      sem.scrollIntoView({behavior:'smooth'});
      calcAll();
    }catch(e){ console.error('add semester handler error', e); }
  }
  addSemesterBtn.addEventListener('click', runAddSemester);
}
if(clearAllBtn){
  function runClearAll(evt){
    try{
      console.log('Clear all triggered', evt && evt.type);
      if(confirm('Clear all semesters?')){ clearAll(); }
    }catch(e){ console.error('clearAll handler error', e); }
  }
  clearAllBtn.addEventListener('click', runClearAll);
}

// Seed a single default semester on startup
createSemester('Semester 1');
refreshAllGradeSelects(); calcAll();

