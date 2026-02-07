import{p as a}from"./index-Jc6aNIQy.js";const n={generar:async()=>(await a.post("/qr/generar")).data,validar:async r=>(await a.post("/qr/validar",{token:r})).data};export{n as q};
