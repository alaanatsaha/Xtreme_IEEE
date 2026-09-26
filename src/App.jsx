import {useState} from 'react';
import {AppProvider,useApp} from './store';
import Display from './Display';import Organizer from './Organizer';import {Modal,LoginDialog} from './Dialogs';
function Shell(){
  const {org,msg}=useApp(),[disp,setDisp]=useState(location.hash==='#display'),[login,setLogin]=useState(false);
  return <>
    {!org||disp
      ?<Display onBack={org?()=>{setDisp(false);history.replaceState(null,'',location.pathname)}:null} onLogin={()=>setLogin(true)}/>
      :<Organizer onDisplay={()=>{setDisp(true);location.hash='display'}}/>}
    {login&&!org&&<Modal onClose={()=>setLogin(false)}><LoginDialog onClose={()=>setLogin(false)} onDone={()=>{setLogin(false);setDisp(false)}}/></Modal>}
    <div id="ts" className={msg?'o':''}>{msg}</div>
  </>;
}
export default function App(){return <AppProvider><Shell/></AppProvider>}
