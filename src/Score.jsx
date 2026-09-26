import {useState} from 'react';
import {useApp} from './store';import {DIFFS,REASONS,award} from './lib';
export function Score({sel,setSel}){
  const {S,commit,toast}=useApp(),id=S.teams.find(t=>t.id===sel)?sel:S.teams[0]?.id,t=S.teams.find(x=>x.id===id);
  const [prob,setProb]=useState(''),[ba,setBa]=useState(''),[br,setBr]=useState(REASONS[0]),[bx,setBx]=useState(''),[pa,setPa]=useState(''),[pr,setPr]=useState('');
  const solve=d=>{if(!t)return toast('ADD A TEAM FIRST');const p=prob.trim();
    commit(x=>award(x,id,+S.rates[d],`${d} Problem${p?' '+p:''}`,`${t.name} solved ${p?'Problem '+p:'a '+d+' problem'}`))};
  const bonus=()=>{const a=+ba,r=bx.trim()||br;if(!t||!a)return toast('CHOOSE A TEAM AND AN AMOUNT');
    commit(x=>award(x,id,a,r+' Bonus',`${t.name} received a Bonus — ${r}`));setBa('');setBx('')};
  const pen=()=>{const a=Math.abs(+pa),r=pr.trim();if(!t||!a)return toast('CHOOSE A TEAM AND AN AMOUNT');
    commit(x=>award(x,id,-a,'Penalty'+(r?' — '+r:''),null));setPa('');setPr('')};
  return <div className="pn"><h3>Score a team</h3>
    <div className="f"><select value={id||''} onChange={e=>setSel(e.target.value)}>{S.teams.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
      <input placeholder="Problem (optional), e.g. C" value={prob} onChange={e=>setProb(e.target.value)}/></div>
    <div className="tri">{DIFFS.map(d=><button key={d} onClick={()=>solve(d)}>{d}<br/><b className="mono">+{S.rates[d]}</b></button>)}</div>
    <h4>Bonus</h4><div className="r2"><select value={br} onChange={e=>setBr(e.target.value)}>{REASONS.map(r=><option key={r}>{r}</option>)}</select>
      <input type="number" placeholder="+ points" value={ba} onChange={e=>setBa(e.target.value)}/></div>
    <input placeholder="Custom reason (optional, replaces the list)" style={{marginTop:8}} value={bx} onChange={e=>setBx(e.target.value)}/>
    <button className="g2" style={{marginTop:8}} onClick={bonus}>Add bonus</button>
    <h4>Deduct points</h4><div className="r2"><input type="number" placeholder="− points" value={pa} onChange={e=>setPa(e.target.value)}/><input placeholder="Reason" value={pr} onChange={e=>setPr(e.target.value)}/></div>
    <button className="g2" style={{marginTop:8}} onClick={pen}>Deduct</button></div>;
}
export function Rates(){
  const {S,commit}=useApp();
  return <div className="pn"><h3>Points per difficulty</h3><div className="r2" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
    {DIFFS.map(d=><label className="mu" key={d}>{d}<input type="number" min="0" defaultValue={S.rates[d]} key={d+S.rates[d]} onBlur={e=>commit(x=>{x.rates[d]=Math.max(0,+e.target.value||0)})}/></label>)}</div></div>;
}
