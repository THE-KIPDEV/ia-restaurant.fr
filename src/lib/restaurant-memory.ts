import { z } from "zod";

const text = z.string().trim().max(200);
const id = z.string().min(1).max(100);
const cents = z.number().int().min(0).max(100_000_000);
export const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s, "Date invalide");
export const cashSchema = z.object({ date: daySchema, service: z.enum(["midi","soir","journée"]), ht: cents, vat: cents, ttc: cents, covers: z.number().int().min(0).max(10000), reference: text.default("") }).refine(v => v.ht + v.vat === v.ttc, "Le HT et la TVA doivent correspondre au TTC.");
export const invoiceLineSchema = z.object({ name: text.min(1), quantity: z.number().positive().max(100000), unit: z.enum(["kg","g","L","ml","pièce"]), totalHT: cents });
export const invoiceSchema = z.object({ date: daySchema, supplier: text.min(1), reference: text, ht: cents, vat: cents, ttc: cents, lines: z.array(invoiceLineSchema).max(100), dueDate: daySchema.nullable().default(null) }).refine(v => v.ht + v.vat === v.ttc, "Le HT et la TVA doivent correspondre au TTC.").refine(v => v.lines.length === 0 || Math.abs(v.lines.reduce((s,l)=>s+l.totalHT,0)-v.ht)<=1, "Le total des lignes doit correspondre au HT ; ajoutez les frais ou remises dans les lignes.");
export const noteSchema = z.object({ text: z.string().trim().min(1).max(10000), category: z.enum(["consigne","décision","incident","équipe","autre"]).default("consigne"), date: daySchema });
export const itemInputSchema = z.discriminatedUnion("kind", [z.object({kind:z.literal("cash"),title:text.min(1),payload:cashSchema}),z.object({kind:z.literal("invoice"),title:text.min(1),payload:invoiceSchema}),z.object({kind:z.literal("note"),title:text.min(1),payload:noteSchema})]);
export type Cash = z.infer<typeof cashSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type MemoryItem = { id:string; kind:string; title:string; status:string; payload:unknown; originalName?:string|null; createdAt:string; hasFile?:boolean; history?:Array<{at:string;title:string;status:string;payload:unknown}> };

export const workspaceSchema = z.object({
  tables:z.array(z.object({id,label:text.min(1),seats:z.number().int().min(1).max(50),x:z.number().min(0).max(100),y:z.number().min(0).max(100),shape:z.enum(["square","round"]),zone:text.default("Salle")})).max(100),
  reservations:z.array(z.object({id,name:text.min(1),date:daySchema,time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),guests:z.number().int().min(1).max(500),tableIds:z.array(id).max(20),status:z.enum(["attendue","installée","terminée","annulée"]),note:text.default("")})).max(500),
  ingredients:z.array(z.object({id,name:text.min(1),unit:z.enum(["kg","L","pièce"]),price:cents,sourceId:id.nullable().default(null)})).max(500),
  recipes:z.array(z.object({id,name:text.min(1),portions:z.number().int().min(1).max(1000),instructions:z.string().max(10000),items:z.array(z.object({ingredientId:id,quantity:z.number().positive().max(100000)})).max(100)})).max(200),
  tasks:z.array(z.object({id,text:text.min(1),date:daySchema,assignee:text,done:z.boolean()})).max(500),
  team:z.array(z.object({id,name:text.min(1),role:text,notes:z.string().max(2000)})).max(100),
}).superRefine((s,ctx)=>{
  for(const key of ["tables","reservations","ingredients","recipes","tasks","team"] as const) if(new Set(s[key].map(v=>v.id)).size!==s[key].length)ctx.addIssue({code:"custom",message:"Identifiants dupliqués",path:[key]});
  const tableMap=new Map(s.tables.map(t=>[t.id,t]));
  s.reservations.forEach((r,i)=>{
    if(new Set(r.tableIds).size!==r.tableIds.length||r.tableIds.some(id=>!tableMap.has(id)))ctx.addIssue({code:"custom",message:"Tables invalides",path:["reservations",i]});
    if(r.tableIds.length && r.tableIds.reduce((n,id)=>n+(tableMap.get(id)?.seats??0),0)<r.guests)ctx.addIssue({code:"custom",message:"Capacité insuffisante pour cette réservation",path:["reservations",i]});
    if(["terminée","annulée"].includes(r.status))return;
    if(s.reservations.slice(0,i).some(o=>o.date===r.date&&!['terminée','annulée'].includes(o.status)&&Math.abs(timeMinutes(o.time)-timeMinutes(r.time))<120&&o.tableIds.some(id=>r.tableIds.includes(id))))ctx.addIssue({code:"custom",message:"Une table est déjà affectée à un service qui se chevauche (2 h).",path:["reservations",i]});
  });
  s.recipes.forEach((r,i)=>{if(r.items.some(it=>!s.ingredients.some(v=>v.id===it.ingredientId)))ctx.addIssue({code:"custom",message:"Ingrédient introuvable",path:["recipes",i]});});
});
export type Workspace = z.infer<typeof workspaceSchema>;
export const emptyWorkspace = ():Workspace => ({tables:[],reservations:[],ingredients:[],recipes:[],tasks:[],team:[]});
export const parisDay = (now=new Date()) => new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Paris"}).format(now);
export const timeMinutes = (time:string) => Number(time.slice(0,2))*60+Number(time.slice(3));
export function cashOverlaps(a:Cash,b:Cash){return a.date===b.date&&(a.service===b.service||a.service==="journée"||b.service==="journée");}
export function cashMetrics(items:MemoryItem[],date:string){
  const reports=items.filter(d=>d.kind==="cash"&&d.status==="validated").flatMap(d=>{const v=cashSchema.safeParse(d.payload);return v.success?[{...v.data,id:d.id}]:[];});
  const current=reports.filter(r=>r.date===date);
  const prior=new Date(date+"T12:00:00Z");prior.setUTCDate(prior.getUTCDate()-7);const previousDate=prior.toISOString().slice(0,10);
  const previous=reports.filter(r=>r.date===previousDate&&current.some(c=>c.service===r.service));
  const sum=(rs:typeof reports)=>rs.reduce((a,r)=>({ht:a.ht+r.ht,vat:a.vat+r.vat,ttc:a.ttc+r.ttc,covers:a.covers+r.covers}),{ht:0,vat:0,ttc:0,covers:0});
  const totals=sum(current),reference=sum(previous);
  const comparable=current.length>0&&previous.length===current.length;
  return {...totals,ticket:totals.covers?Math.round(totals.ttc/totals.covers):null,comparison:comparable&&reference.ttc>0?(totals.ttc/reference.ttc-1)*100:null,previousDate,previous:reference,sources:current.map(r=>r.id),referenceSources:previous.map(r=>r.id)};
}
export function normalizeLine(line:z.infer<typeof invoiceLineSchema>){
  const unit=line.unit==="g"?"kg":line.unit==="ml"?"L":line.unit;
  const quantity=["g","ml"].includes(line.unit)?line.quantity/1000:line.quantity;
  return {name:line.name,unit,price:Math.round(line.totalHT/quantity)};
}
export function latestPrices(items:MemoryItem[]){
  const found=new Map<string,ReturnType<typeof normalizeLine>&{sourceId:string;date:string}>();
  items.filter(d=>d.kind==="invoice"&&d.status==="validated").flatMap(d=>{const v=invoiceSchema.safeParse(d.payload);return v.success?[{...v.data,id:d.id}]:[];}).sort((a,b)=>a.date.localeCompare(b.date)).forEach(i=>i.lines.forEach(l=>{const n=normalizeLine(l);found.set(n.name.toLocaleLowerCase("fr")+"|"+n.unit,{...n,sourceId:i.id,date:i.date});}));
  return Array.from(found.values());
}
export function recipeCost(recipe:Workspace["recipes"][number],workspace:Workspace){return Math.round(recipe.items.reduce((sum,item)=>sum+item.quantity*(workspace.ingredients.find(i=>i.id===item.ingredientId)?.price??0),0));}
// Keep integer cents in storage/calculations. Give the model explicitly named euro amounts.
export function euroContext(value:unknown):unknown {
  if(Array.isArray(value))return value.map(euroContext);
  if(value && typeof value==="object")return Object.fromEntries(Object.entries(value).map(([key,v])=>{
    if(["ht","vat","ttc","ticket","totalHT","price"].includes(key) && (typeof v==="number" || v===null))return [key+"EUR",v===null?null:Number(v)/100];
    return [key,euroContext(v)];
  }));
  return value;
}
export function memoryContext(items:MemoryItem[],workspace:Workspace,question:string,date:string){
  const terms=question.toLocaleLowerCase("fr").split(/\W+/).filter(t=>t.length>3);
  const valid=items.filter(i=>i.status==="validated");
  const ranked=valid.map(i=>({i,score:terms.reduce((n,t)=>n+(JSON.stringify(i).toLocaleLowerCase("fr").includes(t)?1:0),0)})).sort((a,b)=>b.score-a.score||b.i.createdAt.localeCompare(a.i.createdAt)).slice(0,20).map(v=>v.i);
  const metrics=cashMetrics(items,date);
  const selected=Array.from(new Map([...ranked,...items.filter(i=>[...metrics.sources,...metrics.referenceSources].includes(i.id))].map(i=>[i.id,i])).values());
  return {date,amountUnit:"EUR (euros, pas centimes)",metrics:euroContext(metrics),documentCount:items.length,selectedDocumentCount:selected.length,documents:selected.map(i=>({id:i.id,title:i.title,kind:i.kind,payload:euroContext(i.payload)})),workspace:euroContext(workspace)};
}
