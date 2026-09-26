import {useEffect,useRef,useState} from 'react';
import {useApp} from './store';import {ranked,mems,uid} from './lib';import MemberList from './MemberList';
const SAMPLE=[['Team Alpha',['Sara','Omar','Lina']],['Team Codex',['Yazan','Huda','Adam']],['Team Debuggers',['Noor','Khaled','Rami']],['Team Nexus',['Maya','Ziad','Tala']]];
export function TeamsPanel({sel,setSel,onHist,onEdit}){
  const {S,commit}=useApp(),R=ranked(S.teams),[arm,setArm]=useState(null);
  useEffect(()=>{if(!arm)return;const x=setTimeout(()=>setArm(null),3000);return()=>clearTimeout(x)},[arm]);
  const stop=fn=>e=>{e.stopPropagation();fn()};
  const sure=(k,fn)=>stop(()=>{if(arm===k){setArm(null);fn()}else setArm(k)});
  const reset=id=>commit(d=>{const t=d.teams.find(x=>x.id===id);t.h.unshift({d:-t.pts,l:'Score reset',t:Date.now()});t.pts=0});
  const remove=id=>commit(d=>{d.teams=d.teams.filter(x=>x.id!==id)});
  return <div className="pn"><h3>Teams · {R.length}</h3>
    {R.length?<div className="sc"><table><thead><tr><th>RANK</th><th>TEAM</th><th>POINTS</th><th/></tr></thead><tbody>
      {R.map(({t,r})=><tr key={t.id} className={sel===t.id?'sel':''} onClick={()=>setSel(t.id)}>
        <td className="mono rk">{r}</td>
        <td><b>{t.name}</b><div>{mems(t).length?mems(t).map((m,i)=><span className="chip" key={i}>{m}</span>):<span className="mu">No members listed</span>}</div></td>
        <td className="mono pt">{t.pts}</td>
        <td className="ac"><button className="g2 sm" onClick={stop(()=>onHist(t.id))}>History</button>{' '}
          <button className="g2 sm" onClick={stop(()=>onEdit(t.id))}>Edit</button>{' '}
          <button className="g2 sm" onClick={sure('r'+t.id,()=>reset(t.id))}>{arm==='r'+t.id?'Confirm?':'Reset'}</button>{' '}
          <button className="g2 sm" onClick={sure('d'+t.id,()=>remove(t.id))}>{arm==='d'+t.id?'Confirm?':'Remove'}</button></td></tr>)}
    </tbody></table></div>
    :<><p className="mu" style={{marginBottom:12}}>No teams yet. Every new team starts at 0 points.</p>
      <button className="g2" onClick={()=>commit(d=>SAMPLE.forEach(x=>d.teams.push({id:uid(),name:x[0],mem:x[1],pts:0,h:[]})))}>Load 4 sample teams</button></>}
  </div>;
}
export function AddTeam(){
  const {S,commit,toast}=useApp(),[name,setName]=useState(''),[mem,setMem]=useState(['','','']),[err,setErr]=useState(''),nr=useRef();
  const submit=()=>{const n=name.trim();
    const e=!n?'Enter a team name first.':S.teams.some(t=>t.name.toLowerCase()===n.toLowerCase())?'A team with this name already exists.':'';
    setErr(e);if(e){nr.current.focus();return}
    commit(d=>{d.teams.push({id:uid(),name:n,mem:mem.map(x=>x.trim()).filter(Boolean),pts:0,h:[]})});
    setName('');setMem(['','','']);toast('TEAM ADDED');nr.current.focus()};
  return <div className="pn"><h3>Add team</h3><div className="f">
    <label>Team name<input ref={nr} className={err?'bad':''} value={name} placeholder="e.g. Team Alpha" onChange={e=>{setName(e.target.value);setErr('')}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('nm0')?.focus()}}}/></label>
    <div><div className="mu" style={{marginBottom:6}}>Team members · {mem.filter(x=>x.trim()).length} named</div><MemberList mem={mem} setMem={setMem} prefix="nm" onSubmit={submit}/></div></div>
    {err&&<div className="err">{err}</div>}
    <div className="r2"><button className="b" onClick={submit}>Add team (0 points)</button><button className="g2" onClick={()=>{setName('');setMem(['','','']);setErr('')}}>Clear form</button></div></div>;
}
