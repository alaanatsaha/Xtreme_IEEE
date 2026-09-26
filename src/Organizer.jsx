import {useState} from 'react';
import {useApp} from './store';import logo from './assets/logo.png';
import {TeamsPanel,AddTeam} from './Teams';import {Score,Rates} from './Score';import Challenges from './Challenges';
import {Modal,HistoryDialog,EditDialog} from './Dialogs';
export default function Organizer({onDisplay}){
  const {S,commit,logout}=useApp(),[sel,setSel]=useState(null),[dlg,setDlg]=useState(null),close=()=>setDlg(null);
  return <>
    <div className="bar"><div className="lgo"><img src={logo} alt="IEEE Xtreme"/></div><div><b>Organizer control</b><div className="mu">University competition scoreboard</div></div><div className="sp"/>
      <button className="g2" onClick={logout}>Log out</button><button className="b" onClick={onDisplay}>Open public display</button></div>
    <div className="g"><div><TeamsPanel sel={sel} setSel={setSel} onHist={id=>setDlg({k:'hist',id})} onEdit={id=>setDlg({k:'edit',id})}/><AddTeam/></div>
      <div><Score sel={sel} setSel={setSel}/><Rates/><Challenges/>
        <div className="pn"><label className="mu"><input type="checkbox" style={{width:'auto'}} checked={S.act} onChange={e=>commit(d=>{d.act=e.target.checked})}/> Show live activity on the public screen</label></div></div></div>
    {dlg&&<Modal onClose={close}>{dlg.k==='hist'?<HistoryDialog id={dlg.id} onClose={close}/>:<EditDialog id={dlg.id} onClose={close}/>}</Modal>}
  </>;
}
