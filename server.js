
const express=require('express');
const cors=require('cors');
const yahooFinance=require('yahoo-finance2').default;
const app=express();
app.use(cors());
app.use(express.static('public'));

async function q(symbol){
 const r=await yahooFinance.quote(symbol);
 return r;
}
app.get('/api/dashboard', async(req,res)=>{
 try{
  const vix=await q('^VIX');
  const sp=await q('^GSPC');
  let vixScore=0;
  if(vix.regularMarketPrice<16.5) vixScore+=2;
  if(vix.regularMarketChange<0) vixScore+=3;
  let spScore=0;
  if(sp.regularMarketChange>0) spScore+=3;
  if(sp.regularMarketPrice>sp.regularMarketOpen) spScore+=2;
  const bias=(vixScore>=3 && spScore>=3)?'LONG':(vixScore<3&&spScore<3)?'SHORT':'WAIT';
  const confidence=Math.min(95,50+vixScore*5+spScore*5);
  res.json({vix:vix.regularMarketPrice,sp500:sp.regularMarketPrice,vixScore,spScore,bias,confidence});
 }catch(e){res.status(500).json({error:e.message})}
});
app.listen(process.env.PORT||3000,()=>console.log('running'));
