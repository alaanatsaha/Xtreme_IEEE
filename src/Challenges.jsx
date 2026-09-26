import {useState} from 'react';
import {useApp} from './store';import {CT,cp,ft,award,uid} from './lib';
function AwardRow({c}){
  const {S,commit}=useApp(),[tid,setTid]=useState(''),id=S.teams.find(t=>t.id===tid)?tid:S.teams[0]?.id;
  const give=()=>{const t=S.teams.find(x=>x.id===id);if(!t)return;
    commit(d=>{const x=d.ch.find(y=>y.id===c.id);if(x.mult===1)x.st='ended';award(d,id,cp(x),`${x.ty}: ${x.ti}`,`${t.name} won the Challenge — ${x.ti}`)})};
  return <><div className="r2"><select value={id||''} onChange={e=>setTid(e.target.value)}>{S.teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select><button className="b" onClick={give}>Award winner</button></div>
    <button className="g2 sm" style={{marginTop:8}} onClick={()=>commit(d=>{d.ch.find(y=>y.id===c.id).st='ended'})}>End challenge</button></>;
}
export default function Challenges(){
  const {S,commit,now}=useApp(),[f,setF]=useState({ty:'Double Points',ti:'',base:S.rates.Hard,bonus:150,mult:2,mins:10});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const create=()=>{commit(d=>{d.ch.push({id:uid(),ty:f.ty,ti:f.ti.trim()||f.ty,base:+f.base||0,mult:+f.mult||1,bonus:+f.bonus||0,mins:+f.mins||10,st:'ready'})});set('ti','')};
  const activate=id=>commit(d=>{d.ch.forEach(c=>{if(c.st==='on')c.st='ended'});const c=d.ch.find(x=>x.id===id);c.st='on';c.end=Date.now()+c.mins*60000});
  return <div className="pn"><h3>Live challenges</h3><div className="f">
    <select value={f.ty} onChange={e=>setF(p=>({...p,ty:e.target.value,mult:CT[e.target.value]}))}>{Object.keys(CT).map(x=><option key={x}>{x}</option>)}</select>
    <input placeholder="Title, e.g. Problem C" value={f.ti} onChange={e=>set('ti',e.target.value)}/>
    <div className="r2"><label>Normal points<input type="number" value={f.base} onChange={e=>set('base',e.target.value)}/></label><label>Bonus points<input type="number" value={f.bonus} onChange={e=>set('bonus',e.target.value)}/></label></div>
    <div className="r2"><label>Multiplier<select value={f.mult} onChange={e=>set('mult',e.target.value)}><option value="1">1× (bonus only)</option><option value="2">2×</option><option value="3">3×</option></select></label>
      <label>Duration (minutes)<input type="number" value={f.mins} onChange={e=>set('mins',e.target.value)}/></label></div></div>
    <button className="b" onClick={create}>Create challenge</button>
    {S.ch.filter(c=>c.st!=='ended').map(c=><div className={'ch '+c.st} key={c.id}><b>{c.ty}</b> · {c.ti}
      <div className="mu">{c.mult>1?`${c.base} × ${c.mult} = `:'Bonus '}<b className="mono">{cp(c)}</b> points · {c.mins} min · {c.st==='on'?<span className="warn">ACTIVE <span className="mono">{ft(c.end-now)}</span></span>:'ready'}</div>
      {c.st==='on'?<AwardRow c={c}/>:<div className="r2"><button className="b sm" onClick={()=>activate(c.id)}>Activate</button><button className="g2 sm" onClick={()=>commit(d=>{d.ch=d.ch.filter(x=>x.id!==c.id)})}>Delete</button></div>}</div>)}
  </div>;
}
