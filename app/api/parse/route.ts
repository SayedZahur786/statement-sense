import {boundedBody} from '@/lib/body';
import {NextResponse} from 'next/server';
import {PDFParse} from 'pdf-parse';
import {parseStatement,type Bank} from '@/lib/statement';
import {rateLimit,metric,sameOrigin} from '@/lib/db';
export const runtime='nodejs';export const maxDuration=30;
const fail=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 if(!sameOrigin(request))return fail('This upload must start from Statement Sense.',403);
 const length=Number(request.headers.get('content-length'));if(!Number.isFinite(length)||length<=0||length>3_300_000)return fail('Choose a PDF smaller than 3 MB.',413);
 try{if(!await rateLimit('parse',20))return fail('The review queue is busy. Try again in a minute.',429);}catch{return fail('Private upload processing is temporarily unavailable. You can still explore the synthetic demo.',503);}
 let parser:PDFParse|undefined;
 try{const data=await boundedBody(request,3_300_000);const form=await new Response(data as BodyInit,{headers:{'content-type':request.headers.get('content-type')||''}}).formData();const file=form.get('file');const bank=form.get('bank');if(!(file instanceof File)||file.size>3_000_000||!['HDFC','ICICI','SBI'].includes(String(bank)))return fail('Choose a supported bank and a PDF under 3 MB.',400);
 const bytes=new Uint8Array(await file.arrayBuffer());if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')return fail('This file is not a PDF.',400);
 parser=new PDFParse({data:bytes});const info=await parser.getInfo();if(info.total>30)return fail('Use a statement with at most 30 pages.',400);
 const result=await parser.getText();const statement=parseStatement(result.text,bank as Bank);
 if(!statement.synthetic){await metric('parsed');if(statement.tieOut==='matched')await metric('matched');}
 return NextResponse.json(statement,{headers:{'Cache-Control':'no-store'}});
 }catch(error){const message=error instanceof Error?error.message:'';const safe=/^(This document|No supported|Use a statement|Statement text)/.test(message)?message:'We could not read this PDF. Export an unlocked, text-based statement and try again. Scans and encrypted PDFs are not supported.';return fail(safe,422);}finally{if(parser)await parser.destroy().catch(()=>{});}
}
