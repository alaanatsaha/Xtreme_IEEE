import {useEffect,useRef,useState} from 'react';import {MAX_MEMBERS} from './lib';
// One input per member: Enter moves to the next / adds a row, ✕ removes, "+ Add member" appends.
export default function MemberList({mem,setMem,prefix,onSubmit}){
  const refs=useRef([]),[f,setF]=useState(null);
  useEffect(()=>{if(f!==null){refs.current[f]?.focus();setF(null)}},[f]);
  const add=()=>{if(mem.length>=MAX_MEMBERS)return;setMem([...mem,'']);setF(mem.length)};
  const del=i=>{const m=mem.filter((_,j)=>j!==i);setMem(m.length?m:[''])};
  const key=(e,i)=>{if(e.key!=='Enter')return;e.preventDefault();
    if(i<mem.length-1)refs.current[i+1]?.focus();else if(mem[i].trim()&&mem.length<MAX_MEMBERS)add();else onSubmit?.()};
  return <>{mem.map((m,i)=><div className="mr" key={i}><span className="mu mono">{i+1}</span>
    <input id={prefix+i} ref={el=>{refs.current[i]=el}} value={m} placeholder={`Member ${i+1} full name`} onChange={e=>setMem(mem.map((x,j)=>j===i?e.target.value:x))} onKeyDown={e=>key(e,i)}/>
    <button type="button" className="g2" title="Remove member" disabled={mem.length<2} onClick={()=>del(i)}>✕</button></div>)}
    <button type="button" className="g2 sm" disabled={mem.length>=MAX_MEMBERS} onClick={add}>+ Add member</button></>;
}
