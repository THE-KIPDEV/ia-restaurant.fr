import assert from "node:assert/strict";
import {generateWithReviewCredits,NoReviewCredits} from "../src/lib/review-credits.ts";
function fixture(balance=5){let reserve=0,generated=0,recorded=0,refunded=0;const deps={reserve:async()=>{reserve++;if(balance<5)return false;balance-=5;return true;},generate:async()=>{generated++;return "Brouillon fictif";},record:async()=>{recorded++;},refund:async()=>{refunded++;balance+=5;}};return {deps,stats:()=>({balance,reserve,generated,recorded,refunded})};}
let f=fixture();assert.equal(await generateWithReviewCredits(f.deps),"Brouillon fictif");assert.deepEqual(f.stats(),{balance:0,reserve:1,generated:1,recorded:1,refunded:0});
f=fixture(0);await assert.rejects(()=>generateWithReviewCredits(f.deps),NoReviewCredits);assert.equal(f.stats().generated,0);
f=fixture();f.deps.generate=async()=>{throw new Error("provider failure");};await assert.rejects(()=>generateWithReviewCredits(f.deps));assert.equal(f.stats().balance,5);assert.equal(f.stats().refunded,1);
f=fixture();f.deps.record=async()=>{throw new Error("record failure");};await assert.rejects(()=>generateWithReviewCredits(f.deps));assert.equal(f.stats().balance,5);
f=fixture();f.deps.generate=async()=>" ";await assert.rejects(()=>generateWithReviewCredits(f.deps));assert.equal(f.stats().balance,5);
f=fixture();const parallel=await Promise.allSettled([generateWithReviewCredits(f.deps),generateWithReviewCredits(f.deps)]);assert.equal(parallel.filter(p=>p.status==="fulfilled").length,1);assert.equal(f.stats().balance,0);
console.log("6 cas validés : succès, crédits insuffisants, échec IA, échec stockage, sortie vide, demandes concurrentes.");

const {nextCreditMonth}=await import("../src/lib/credit-period.ts");
for(const [input,expected] of [["2026-01-31T23:59:00Z","2026-02-01T00:00:00.000Z"],["2024-02-29T12:00:00Z","2024-03-01T00:00:00.000Z"],["2026-12-31T23:59:00Z","2027-01-01T00:00:00.000Z"]])assert.equal(nextCreditMonth(new Date(input)).toISOString(),expected);
console.log("3 dates de renouvellement validées : fin de mois, année bissextile et changement d’année.");
