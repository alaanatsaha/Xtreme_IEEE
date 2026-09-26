export const uid=()=>Math.random().toString(36).slice(2,8);
export const MAX_MEMBERS=6,DIFFS=['Easy','Medium','Hard'];
export const REASONS=['First Team to Solve','Fastest Solution','Special Challenge','Bonus Round','Custom'];
// Challenge type -> default multiplier (1 = fixed bonus)
export const CT={'Double Points':2,'Triple Points':3,'First Team to Solve':1,'Fastest Solution':1,'Bonus Points':1,'Bonus Round':1,'Custom Challenge':1};
export const ranked=teams=>{const a=[...teams].sort((x,y)=>y.pts-x.pts||x.name.localeCompare(y.name));return a.map(t=>({t,r:a.findIndex(z=>z.pts===t.pts)+1}))};
export const cp=c=>c.mult>1?c.base*c.mult:c.bonus;
export const mems=t=>Array.isArray(t.mem)?t.mem:String(t.mem||'').split(',').map(x=>x.trim()).filter(Boolean);
export const hm=t=>new Date(t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
export const ft=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
export const activeChallenge=(ch,now)=>ch.find(c=>c.st==='on'&&c.end>now);
// Apply a score change to a draft state: updates points, private history and (optionally) the public activity feed.
export const award=(d,id,delta,label,pub)=>{const t=d.teams.find(x=>x.id===id);if(!t)return;t.pts+=delta;t.h.unshift({d:delta,l:label,t:Date.now()});if(pub)d.ev.unshift({t:Date.now(),a:pub,d:delta})};
