
const express=require('express');
const yahooFinance=require('yahoo-finance2').default;
const path=require('path');
const app=express();
app.use(express.static(path.join(__dirname,'public')));

async function getQuote(symbol){
 const q=await yahooFinance.quote(symbol);
 return {price:q.regularMarketPrice, change:q.regularMarketChangePercent||0};
}
app.get('/api/dashboard', async(req,res)=>{
 try{
  const vix=await getQuote('^VIX');
  const sp=await getQuote('^GSPC');
  const vixRisk=vix.price<16.5?'RISK ON':(vix.price<18.5?'NEUTRAL':'RISK OFF');
  const spBias=sp.change>=0?'BUY':'SELL';
  let action='WAIT';
  if((vixRisk==='RISK ON'||vixRisk==='NEUTRAL')&&spBias==='BUY') action='BUY PULLBACKS';
  if(vixRisk==='RISK OFF'&&spBias==='SELL') action='SELL RALLIES';
  const confidence=Math.min(95,Math.round((Math.abs(sp.change)*10)+(vixRisk==='RISK ON'?70:vixRisk==='NEUTRAL'?55:40)));
  res.json({vix:vix.price,sp500:sp.price,vixRisk,spBias,regime:(spBias==='BUY'&&vixRisk!=='RISK OFF')?'TREND BULL':'TREND BEAR',divergence:'NONE',confidence,action});
 }catch(e){res.status(500).json({error:e.message});}
});
app.get('/api/health',(req,res)=>res.json({status:'ok'}));
const PORT=process.env.PORT||3000;app.listen(PORT,()=>console.log('Server running on '+PORT));
