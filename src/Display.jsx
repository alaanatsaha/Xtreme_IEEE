import {useEffect,useRef,useState} from 'react';
import {useApp} from './store';import {ranked,cp,activeChallenge,ft} from './lib';import logo from './assets/logo.png';
// Returns the ids of teams whose points just changed (used for the row highlight animation).
function useFlash(teams){
  const prev=useRef({}),[fl,setFl]=useState(new Set());
  useEffect(()=>{const ch=new Set();teams.forEach(t=>{const p=prev.current[t.id];if(p!==undefined&&p!==t.pts)ch.add(t.id);prev.current[t.id]=t.pts});
    if(!ch.size)return;setFl(ch);const x=setTimeout(()=>setFl(new Set()),1800);return()=>clearTimeout(x)},[teams]);
  return fl;
}
export default function Display({onBack,onLogin}){
  const {S,now,toast}=useApp(),c=activeChallenge(S.ch,now),R=ranked(S.teams),fl=useFlash(S.teams);
  const full=()=>document.documentElement.requestFullscreen?.().catch(()=>toast('FULL SCREEN BLOCKED — PRESS F11'));
  return <>
    <div className="bar"><div className="lgo"><img src={logo} alt="IEEE Xtreme"/></div>
      <div><b style={{fontSize:20}}>IEEE Xtreme</b><div className="mu">University Competition</div></div><div className="sp"/>
      <span className="lv"><i className="dot"/>LIVE</span><button className="g2 sm" onClick={full}>Full screen</button>
      {onBack?<button className="g2 sm" onClick={onBack}>Back to control</button>:<button className="g2 sm" onClick={onLogin}>Organizer login</button>}</div>
    <div className={'dp'+(S.act?'':' n')}><div>
      {c&&<div className="chb"><div className="lb">Special challenge</div><h2>{c.ty.toUpperCase()}</h2><div style={{fontSize:20}}>{c.ti}</div>
        <div className="cg">{c.mult>1&&<div>Normal Points<b className="mono">{c.base}</b></div>}
          <div>{c.mult>1?'Challenge Points':'Bonus'}<b className="mono" style={{color:'var(--or)'}}>{c.mult>1?'':'+'}{cp(c)}</b></div>
          <div>Time Remaining<b className="mono">{ft(c.end-now)}</b></div></div></div>}
      <div><div className="r h"><span>RANK</span><span>TEAM</span><span>TOTAL POINTS</span></div>
        {R.length?R.map(({t,r})=><div key={t.id} className={'r'+(fl.has(t.id)?' f':'')}><span className="n mono">{r}</span><span>{t.name}</span><span className="p mono">{t.pts}</span></div>)
          :<p className="mu" style={{padding:20}}>The scoreboard appears here once organizers add teams.</p>}</div></div>
    {S.act&&<aside><h3>Live activity</h3>{S.ev.length?S.ev.slice(0,10).map((e,i)=><div className="ev" key={e.t+'-'+i}>{e.a}<span className="mono">+{e.d} Points</span></div>):<p className="mu">Nothing yet.</p>}</aside>}</div>
  </>;
}
