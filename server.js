const express=require('express');
const app=express();
app.use(express.static('public'));
app.get('/api/dashboard',(req,res)=>{
 res.json({vix:17.2,vixRisk:'NEUTRAL',sp500:6500,bias:'LONG',regime:'TREND BULL',divergence:'NONE',confidence:82,action:'BUY PULLBACKS'});
});
app.listen(process.env.PORT||3000);
