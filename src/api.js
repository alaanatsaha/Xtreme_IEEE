let token=localStorage.getItem('xt')||'';
export const setToken=t=>{token=t;t?localStorage.setItem('xt',t):localStorage.removeItem('xt')};
export const api=(p,o={})=>fetch(p,{...o,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})}});
