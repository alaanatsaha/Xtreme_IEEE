import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import {api,setToken} from './api';
export const EMPTY={teams:[],rates:{Easy:50,Medium:100,Hard:200},ch:[],ev:[],act:true};
const Ctx=createContext(null);export const useApp=()=>useContext(Ctx);
export function AppProvider({children}){
  const [S,setS]=useState(EMPTY),[org,setOrg]=useState(false),[msg,setMsg]=useState(''),[now,setNow]=useState(Date.now());
  const ref=useRef(S),inflight=useRef(0),tt=useRef();
  const toast=useCallback(m=>{setMsg(m);clearTimeout(tt.current);tt.current=setTimeout(()=>setMsg(''),2200)},[]);
  const load=useCallback(async()=>{try{
    const r=await api('/api/state');if(r.status===401){setToken('');return load()}
    const {_org,...d}=await r.json();if(inflight.current)return;
    ref.current={...ref.current,...d};setS(ref.current);setOrg(!!_org);
  }catch{}},[]);
  useEffect(()=>{load();const es=new EventSource('/api/stream');es.onmessage=load;const i=setInterval(load,15000);return()=>{es.close();clearInterval(i)}},[load]);
  useEffect(()=>{const i=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(i)},[]);
  // Organizer-only: mutate a copy of the state, show it instantly, then save it on the server.
  const commit=useCallback(fn=>{
    const d=structuredClone(ref.current);fn(d);d.ev=d.ev.slice(0,30);ref.current=d;setS(d);inflight.current++;
    api('/api/state',{method:'PUT',body:JSON.stringify(d)})
      .then(r=>{if(r.status===401){setToken('');setOrg(false);toast('SESSION EXPIRED — LOG IN AGAIN')}else if(!r.ok)toast('SAVE FAILED')})
      .catch(()=>toast('SAVE FAILED — CHECK YOUR CONNECTION')).finally(()=>{inflight.current--});
  },[toast]);
  // End challenges whose time ran out (the organizer's browser does this).
  useEffect(()=>{if(org&&S.ch.some(c=>c.st==='on'&&c.end<=now))commit(d=>d.ch.forEach(c=>{if(c.st==='on'&&c.end<=now)c.st='ended'}))},[org,S.ch,now,commit]);
  const login=async pw=>{try{
    const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
    if(!r.ok)return r.status===429?'Too many attempts — wait a minute.':'Wrong password.';
    setToken((await r.json()).token);await load();return'';
  }catch{return'Cannot reach the server.'}};
  const logout=()=>{setToken('');setOrg(false);load()};
  return <Ctx.Provider value={{S,org,now,commit,toast,login,logout,msg}}>{children}</Ctx.Provider>;
}
