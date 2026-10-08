export class NoReviewCredits extends Error {}
export async function generateWithReviewCredits<T>(deps:{reserve:()=>Promise<boolean>;generate:()=>Promise<string>;record:(text:string)=>Promise<T>;refund:()=>Promise<unknown>}) {
  if(!await deps.reserve())throw new NoReviewCredits();
  try {const text=await deps.generate();if(typeof text!=="string"||!text.trim())throw new Error("Empty draft");await deps.record(text);return text;}
  catch(error){await deps.refund();throw error;}
}
