// IEEE Xtreme University Scoreboard — zero-dependency Node.js server (Node 18+)
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,PW=process.env.ORGANIZER_PASSWORD,FILE=process.env.DATA_FILE||path.join(__dirname,'data.json'),PUB=path.join(__dirname,'..','dist');
if(!PW){console.error('Set ORGANIZER_PASSWORD first, e.g.:  ORGANIZER_PASSWORD=mysecret node server.js');process.exit(1)}
const sha=s=>crypto.createHash('sha256').update(s).digest(),TOKEN=crypto.createHmac('sha256',PW).update('xtreme-organizer').digest('hex');
const same=(a,b)=>{try{return crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b))}catch{return false}};
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
let S={teams:[],rates:{Easy:50,Medium:100,Hard:200},ch:[],ev:[],act:true};
try{S=JSON.parse(fs.readFileSync(FILE,'utf8'))}catch{}
const persist=()=>{fs.writeFileSync(FILE+'.tmp',JSON.stringify(S));fs.renameSync(FILE+'.tmp',FILE)};
// Public viewers only ever receive: team name + points, the ACTIVE challenge, and (optionally) recent events.
const pub=()=>({teams:S.teams.map(t=>({id:t.id,name:t.name,pts:t.pts,mem:[],h:[]})),act:S.act,ch:S.ch.filter(c=>c.st=='on'),ev:S.act?S.ev.slice(0,10):[]});
const clients=new Set(),ping=()=>clients.forEach(r=>r.write('data: 1\n\n'));
setInterval(()=>clients.forEach(r=>r.write(': ka\n\n')),25000).unref();
const fails=new Map();
const body=req=>new Promise((ok,no)=>{let b='';req.on('data',c=>{b+=c;if(b.length>1e6){no(new Error('big'));req.destroy()}});req.on('end',()=>ok(b));req.on('error',no)});
http.createServer(async(req,res)=>{
  const u=new URL(req.url,'http://x'),send=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(o))};
  const auth=(req.headers.authorization||'').replace('Bearer ',''),isOrg=!!auth&&same(auth,TOKEN);
  try{
    if(u.pathname=='/api/state'&&req.method=='GET'){if(auth&&!isOrg)return send(401,{});return send(200,isOrg?{...S,_org:true}:pub())}
    if(u.pathname=='/api/state'&&req.method=='PUT'){
      if(!isOrg)return send(401,{});
      const d=JSON.parse(await body(req));
      if(!Array.isArray(d.teams)||!Array.isArray(d.ch)||!Array.isArray(d.ev)||typeof d.rates!='object')return send(400,{});
      S={teams:d.teams,rates:d.rates,ch:d.ch,ev:d.ev.slice(0,30),act:!!d.act};persist();ping();return send(200,{ok:1});
    }
    if(u.pathname=='/api/login'&&req.method=='POST'){
      const ip=req.socket.remoteAddress,f=fails.get(ip)||{n:0,t:Date.now()};if(Date.now()-f.t>60000){f.n=0;f.t=Date.now()}
      if(f.n>=8)return send(429,{});
      const p=String(JSON.parse(await body(req)).password||'');
      if(crypto.timingSafeEqual(sha(p),sha(PW))){fails.delete(ip);return send(200,{token:TOKEN})}
      f.n++;fails.set(ip,f);return send(401,{});
    }
    if(u.pathname=='/api/stream'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive','X-Accel-Buffering':'no'});res.write('retry: 3000\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return}
    if(req.method!='GET')return send(405,{});
    const f=path.normalize(path.join(PUB,u.pathname=='/'?'index.html':decodeURIComponent(u.pathname)));
    if(!f.startsWith(PUB+path.sep)){res.writeHead(403);return res.end()}
    fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found — run npm run build first')}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(d)});
  }catch{send(400,{})}
}).listen(PORT,()=>console.log('Scoreboard running on http://localhost:'+PORT));
