import {useState} from 'react';
import {useApp} from './store';import {hm,mems} from './lib';import MemberList from './MemberList';
export const Modal=({onClose,children})=><div className="md o" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="mb">{children}</div></div>;
export function LoginDialog({onClose,onDone}){
  const {login}=useApp(),[pw,setPw]=useState(''),[err,setErr]=useState('');
  const go=async()=>{const e=await login(pw);e?setErr(e):onDone()};
  return <><h2>Organizer login</h2><div className="f"><label>Password<input autoFocus type="password" value={pw} className={err?'bad':''} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}/></label></div>
    {err&&<div className="err">{err}</div>}<div className="r2"><button className="b" onClick={go}>Log in</button><button className="g2" onClick={onClose}>Cancel</button></div></>;
}
export function HistoryDialog({id,onClose}){
  const {S}=useApp(),t=S.teams.find(x=>x.id===id);if(!t)return null;
  return <><h2>{t.name} — score history</h2>
    {t.h.length?t.h.map((x,i)=><div className="mv" key={i}><span className="mono">{x.d>0?'+':''}{x.d}</span><span style={{flex:1}}>{x.l}</span><span className="mu">{hm(x.t)}</span></div>):<p className="mu">No score changes yet.</p>}
    <p style={{margin:'16px 0'}}><span className="lb">Current total</span><br/><b className="mono pt">{t.pts}</b> points</p><button className="g2" onClick={onClose}>Close</button></>;
}
export function EditDialog({id,onClose}){
  const {S,commit}=useApp(),t=S.teams.find(x=>x.id===id);
  const [name,setName]=useState(t?.name||''),[mem,setMem]=useState(()=>{const m=t?[...mems(t)]:[];return m.length?m:['']}),[pts,setPts]=useState(t?.pts??0),[err,setErr]=useState('');
  if(!t)return null;
  const save=()=>{const n=name.trim(),p=+pts||0;
    if(!n)return setErr('Enter a team name.');
    if(S.teams.some(x=>x.id!==id&&x.name.toLowerCase()===n.toLowerCase()))return setErr('A team with this name already exists.');
    commit(d=>{const x=d.teams.find(y=>y.id===id);x.name=n;x.mem=mem.map(m=>m.trim()).filter(Boolean);
      if(p!==x.pts){x.h.unshift({d:p-x.pts,l:'Manual adjustment',t:Date.now()});x.pts=p}});onClose()};
  return <><h2>Edit team</h2><div className="f">
    <label>Team name<input value={name} className={err?'bad':''} onChange={e=>{setName(e.target.value);setErr('')}}/></label>
    <div><div className="mu" style={{marginBottom:6}}>Team members</div><MemberList mem={mem} setMem={setMem} prefix="em"/></div>
    <label>Total points<input type="number" value={pts} onChange={e=>setPts(e.target.value)}/></label></div>
    {err&&<div className="err">{err}</div>}<div className="r2"><button className="b" onClick={save}>Save changes</button><button className="g2" onClick={onClose}>Cancel</button></div></>;
}
