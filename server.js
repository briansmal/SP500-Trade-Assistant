const express=require('express');
const yahooFinance=require('yahoo-finance2').default;
const app=express();
app.use(express.static('public'));
app.get('/api/dashboard', async(req,res)=>{
 try{
 const vix=await yahooFinance.quote('^VIX');
 const sp=await yahooFinance.quote('^GSPC');
 const v=vix.regularMarketPrice||0;
 const vc=((vix.regularMarketChangePercent)||0);
 const spc=((sp.regularMarketChangePercent)||0);
 let risk=v<16.5&&vc<0?'RISK ON':v<18.5?'NEUTRAL':'RISK OFF';
 let bias=spc>0?'LONG':spc<0?'SHORT':'WAIT';
 let regime=(spc>0&&vc<0)?'TREND BULL':(spc<0&&vc>0)?'TREND BEAR':'TRANSITION';
 let conf=Math.min(95,Math.round(50+Math.abs(spc)*10+Math.abs(vc)*2));
 let action=bias==='LONG'&&risk!=='RISK OFF'?'BUY PULLBACKS':bias==='SHORT'&&risk==='RISK OFF'?'SELL RALLIES':'WAIT';
 res.json({vix:v,vixChange:vc,spx:sp.regularMarketPrice,spxChange:spc,risk,bias,regime,confidence:conf,action});
 }catch(e){res.status(500).json({error:e.message})}
});
app.listen(process.env.PORT||3000);
