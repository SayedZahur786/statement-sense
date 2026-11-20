import PDFDocument from 'pdfkit';
import {createWriteStream} from 'node:fs';
import {demoText} from '../lib/demo';
for(const bank of ['HDFC','ICICI','SBI'] as const){const pdf=new PDFDocument({margin:40,size:'A4'});const stream=createWriteStream(`public/samples/${bank.toLowerCase()}-synthetic.pdf`);pdf.pipe(stream);pdf.font('Courier').fontSize(10);for(const line of demoText(bank).split('\n'))pdf.text(line,{lineGap:3});pdf.end();await new Promise<void>(resolve=>stream.on('finish',resolve));}
