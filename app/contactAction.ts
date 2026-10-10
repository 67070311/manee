"use server";

import {headers} from "next/headers";

type FormInput={
 name?:unknown;
 email?:unknown;
 subject?:unknown;
 message?:unknown;
 website?:unknown;
};
type SendResult={status:"sent"|"unconfigured"|"invalid"|"rate-limited"|"error"};

const CONTACT_INBOX="pimmaneenimitraporn@gmail.com";
const WINDOW_MS=10*60*1000;
const MAX_PER_WINDOW=5;
const attempts=new Map<string,{used:number;until:number}>();

const safe=(value:unknown,max:number)=>typeof value==="string"?value.trim().slice(0,max+1):"";

export async function sendContactMessage(input:FormInput):Promise<SendResult>{
 if(!input||typeof input!=="object")return {status:"invalid"};
 // Hidden field stops basic automated submissions, without disclosing the trap.
 if(input.website)return {status:"sent"};

 const name=safe(input.name,120);
 const email=safe(input.email,254);
 const subject=safe(input.subject,180).replace(/[\r\n]+/g," ");
 const message=safe(input.message,6000);
 if(name.length<2||name.length>120||email.length>254||
   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||
   subject.length<2||subject.length>180||
   message.length<10||message.length>6000){
  return {status:"invalid"};
 }

 const key=process.env.RESEND_API_KEY;
 const from=process.env.CONTACT_FROM_EMAIL;
 if(!key||!from)return {status:"unconfigured"};

 const requestHeaders=await headers();
 const ip=(requestHeaders.get("x-real-ip")||
           requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()||"").slice(0,80);
 if(ip){
  const now=Date.now();
  if(attempts.size>1000){
   for(const [id,item] of attempts)if(item.until<=now)attempts.delete(id);
   if(attempts.size>1000)attempts.clear();
  }
  const entry=attempts.get(ip);
  if(entry&&entry.until>now&&entry.used>=MAX_PER_WINDOW)return {status:"rate-limited"};
  if(!entry||entry.until<=now)attempts.set(ip,{used:1,until:now+WINDOW_MS});
  else entry.used+=1;
 }

 try{
  const response=await fetch("https://api.resend.com/emails",{
   method:"POST",
   headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
   body:JSON.stringify({
    from,
    to:[CONTACT_INBOX],
    reply_to:email,
    subject:`[Portfolio] ${subject}`,
    text:[
     "New message from Manee Portfolio",
     "",
     `Name: ${name}`,
     `Email: ${email}`,
     `Subject: ${subject}`,
     "",
     "Message:",
     message
    ].join("\n")
   }),
   cache:"no-store",
   signal:AbortSignal.timeout(12000)
  });
  if(!response.ok){
   console.error("Portfolio contact email provider returned status",response.status);
   return {status:"error"};
  }
  return {status:"sent"};
 }catch(error){
  console.error("Portfolio contact email request failed",
   error instanceof Error?error.name:"Unknown error");
  return {status:"error"};
 }
}
