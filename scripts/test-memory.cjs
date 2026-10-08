// Domain checks always run. Database/API checks require an explicitly isolated local database.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const originalResolve=Module._resolveFilename;
Module._resolveFilename=function(name,...args){return originalResolve.call(this,name.startsWith('@/')?path.join(root,'src',name.slice(2)):name,...args);};
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);
const d=require('../src/lib/restaurant-memory.ts');
const demo=require('../src/lib/memory-demo.ts');
const date=demo.DEMO_DATE,items=demo.demoItems(),workspace=demo.demoWorkspace();
assert(d.workspaceSchema.safeParse(workspace).success);
assert.equal(d.cashMetrics(items,date).ttc,174600);
assert.equal(d.cashMetrics(items,date).covers,60);
assert(Math.abs(d.cashMetrics(items,date).comparison+16.6666666667)<0.00001);
assert.equal(d.cashMetrics([...items,demo.demoDraft('cash')],date).ttc,174600,'unvalidated drafts cannot change revenue');
const evening={...demo.demoDraft('cash'),status:'validated'};
assert.equal(d.cashMetrics([...items,evening],date).ttc,291000);
assert.equal(d.cashMetrics([...items.filter(i=>i.id!=='demo-prior-soir'),evening],date).comparison,null,'missing equivalent service prevents comparison');
assert.equal(d.cashMetrics([],date).ticket,null);
assert(!d.daySchema.safeParse('2026-02-30').success);
assert(!d.cashSchema.safeParse({...items.find(i=>i.kind==='cash').payload,ttc:1}).success);
assert(d.cashOverlaps({...evening.payload,service:'journée'},evening.payload));
assert.deepEqual(d.normalizeLine({name:'Huile',quantity:150,unit:'ml',totalHT:120}),{name:'Huile',unit:'L',price:800});
const tooSmall=structuredClone(workspace);tooSmall.reservations[0].guests=50;
assert(!d.workspaceSchema.safeParse(tooSmall).success,'table capacity enforced');
const overlap=structuredClone(workspace);overlap.reservations.push({...overlap.reservations[0],id:'overlap',time:'20:15'});
assert(!d.workspaceSchema.safeParse(overlap).success,'overlapping reservations rejected');
assert.equal(d.recipeCost(workspace.recipes[0],workspace),925);
const context=d.memoryContext(items,workspace,'Quel est le CA ?',date);
assert.equal(context.metrics.ttcEUR,1746);assert.equal(context.metrics.ticketEUR,29.1);
assert.equal(context.documents.find(i=>i.id==='demo-midi').payload.htEUR,1560);
assert.equal(context.workspace.ingredients[0].priceEUR,3.5);
assert(!('ttc' in context.metrics),'model context cannot expose ambiguous cent amounts');
console.log('Domain: revenue, equivalent services, validation, units, floor capacity and recipes passed.');

async function integration(){
  const url=new URL(process.env.DATABASE_URL);
  assert(['localhost','127.0.0.1'].includes(url.hostname)&&url.port==='56432'&&url.pathname==='/ia_restaurant_test','Only the isolated test database is permitted');
  const {prisma}=require('../src/lib/prisma.ts');
  const {reserveAI,refundAI}=require('../src/lib/memory-ai.ts');
  const {resetMonthlyTokens,debitCredits}=require('../src/lib/tokens.ts');
  const {creditPurchase,syncSubscription,subscriptionPeriodEnd}=require('../src/lib/subscription.ts');
  const {createToken}=require('../src/lib/auth.ts');
  const prefix='integration-memory-';
  const ids=[];let base=process.env.MEMORY_TEST_URL||'http://localhost:3107';
  assert(new URL(base).hostname==='localhost');
  try{
    for(const [name,plan] of [['paid','PRO'],['other','PRO'],['free','FREE']]){
      const user=await prisma.user.create({data:{email:prefix+name+'-'+Date.now()+'@example.test',password:'unused',plan,tokenBalance:plan==='FREE'?0:2000,stripeCurrentPeriodEnd:new Date(Date.now()+86400000*35),tokenResetAt:new Date(Date.now()+86400000*30),stripeCustomerId:'cus_'+name+'_'+Date.now()}});ids.push(user.id);
    }
    const [userId,otherId,freeId]=ids;
    const restaurant=await prisma.restaurant.create({data:{name:'Restaurant de test',userId}});
    const cookie='token='+await createToken(userId),other='token='+await createToken(otherId),free='token='+await createToken(freeId);
    async function api(route,method='GET',body,auth=cookie){const response=await fetch(base+route,{method,headers:{cookie:auth,origin:base,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();return {status:response.status,data};}
    const route='/api/memory/'+restaurant.id;
    assert.equal((await api(route,'GET',null,'')).status,401);
    assert.equal((await api(route,'GET',null,other)).status,404);
    assert.equal((await api('/api/restaurants','POST',{name:'Forbidden'},free)).status,402);
    let loaded=await api(route);assert.equal(loaded.status,200);
    const doc={kind:'cash',title:'Caisse midi',payload:items.find(i=>i.kind==='cash'&&i.payload.date===date).payload};
    assert.equal((await api(route+'/items','POST',{...doc,payload:{...doc.payload,ttc:0}})).status,400);
    const added=await api(route+'/items','POST',doc);assert.equal(added.status,201);
    const id=added.data.item.id;
    assert.equal((await api(route+'/items','POST',doc)).status,409);
    assert.equal((await api(route+'/items','POST',{...doc,payload:{...doc.payload,service:'journée'}})).status,409);
    const changed=await api(route+'/items/'+id,'PATCH',{...doc,title:'Caisse corrigée'});assert.equal(changed.status,200);assert.equal(changed.data.item.history.length,1);
    assert.equal((await api(route+'/items/'+id+'/file','GET',null,other)).status,404);
    const actualWorkspace={...workspace,ingredients:workspace.ingredients.map(i=>({...i,sourceId:null}))};
    const save=await api(route,'PUT',{revision:0,workspace:actualWorkspace});assert.equal(save.status,200);
    assert.equal((await api(route,'PUT',{revision:0,workspace:actualWorkspace})).status,409);
    loaded=await api(route);assert.equal(loaded.data.items[0].title,'Caisse corrigée');assert.equal(loaded.data.workspace.tables.length,6);
    // No paid provider calls: missing API configuration must refund the reserved credits.
    const failed=await api(route+'/copilot','POST',{question:'Quel est mon CA ?',date,requestId:crypto.randomUUID()});assert.equal(failed.status,503);
    assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,2000);
    await prisma.user.update({where:{id:userId},data:{tokenBalance:20}});
    const holds=await Promise.allSettled(Array.from({length:10},()=>reserveAI(userId,restaurant.id,'COPILOT',crypto.randomUUID())));
    const successful=holds.filter(v=>v.status==='fulfilled').map(v=>v.value);
    assert.equal(successful.length,4);assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,0);
    await Promise.all(successful.flatMap(h=>[refundAI(h.id),refundAI(h.id)]));assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,20);
    await creditPurchase(userId,500,9,'pi_test_'+userId);await creditPurchase(userId,500,9,'pi_test_'+userId);
    assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,520,'payment replay cannot duplicate credits');
    await prisma.user.update({where:{id:userId},data:{tokenResetAt:new Date(0)}});await resetMonthlyTokens(userId);
    let current=await prisma.user.findUnique({where:{id:userId}});assert.equal(current.tokenBalance,2500);assert.equal(current.purchasedTokenBalance,500);
    await prisma.$transaction(tx=>debitCredits(tx,userId,2000));
    const purchasedHold=await reserveAI(userId,restaurant.id,'COPILOT',crypto.randomUUID());
    assert.equal((await prisma.user.findUnique({where:{id:userId}})).purchasedTokenBalance,495);
    await refundAI(purchasedHold.id);assert.equal((await prisma.user.findUnique({where:{id:userId}})).purchasedTokenBalance,500);
    const subscription={id:'sub_test_'+userId,customer:current.stripeCustomerId,status:'active',metadata:{site:'ia-restaurant.fr'},current_period_end:Math.floor(Date.now()/1000)+864000,items:{data:[{price:{id:process.env.STRIPE_PRICE_PRO_MONTHLY}}]}};
    assert.equal(subscriptionPeriodEnd(subscription).getTime(),subscription.current_period_end*1000);
    assert.equal(subscriptionPeriodEnd({...subscription,current_period_end:undefined,items:{data:[{current_period_end:subscription.current_period_end}]}}).getTime(),subscription.current_period_end*1000);
    await syncSubscription(subscription,userId);assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,2500);
    await prisma.$transaction(tx=>debitCredits(tx,userId,10));await syncSubscription(subscription,userId);
    assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,2490,'subscription replay cannot replenish spent credits');
    const renewal={...subscription,current_period_end:subscription.current_period_end+864000};
    await syncSubscription(renewal,userId,false);assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,2490,'subscription status update alone cannot grant credits');
    await syncSubscription(renewal,userId);assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,2500,'paid renewal grants new allocation once');
    await prisma.$transaction(tx=>debitCredits(tx,userId,7));await syncSubscription(renewal,userId);assert.equal((await prisma.user.findUnique({where:{id:userId}})).tokenBalance,2493);

    await prisma.user.update({where:{id:userId},data:{stripeCurrentPeriodEnd:new Date(0)}});
    assert.equal((await api(route+'/copilot','POST',{question:'Quel est mon CA ?',date,requestId:crypto.randomUUID()})).status,402);
    assert.equal((await api(route)).status,200,'existing memory accessible after expiry');
    assert.equal((await api(route+'/items','POST',{kind:'note',title:'Consigne',payload:{date,category:'consigne',text:'La mémoire reste accessible'}})).status,201);
    console.log('Database/API: ownership, paywall, persistence, duplicate protection, corrections, conflicts, atomic credits, refunds and payment replay passed.');
  }finally{await prisma.user.deleteMany({where:{id:{in:ids}}});await prisma.$disconnect();}
}
if(process.env.MEMORY_INTEGRATION==='1')integration().catch(e=>{console.error(e);process.exitCode=1;});
