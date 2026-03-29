import CSVParser from "../util/CSVParser.js"
import LogTool from "../LogTool.js";

const logTool = new LogTool();
const csvContent = `ï»¿Filter,Date,Description,Sub-description,Status,Type of Transaction,Amount
"February 2026, From date=2026-02-01, To date=2026-02-28",2026-02-28,scotiabank transit,Toronto On,posted,Debit,15
,2026-02-27,adobe,San Jose 065,posted,Debit,29.88
,2026-02-26,youtube premium,G.Co/Helppay#019,posted,Debit,26.43
,2026-02-26,bell canada,Montreal 022,posted,Debit,79.1
,2026-02-24,linkedin,Mountain View065,posted,Debit,40.35
,2026-02-23,scotia credit card protec,Tion Tax,posted,Debit,0.64
,2026-02-23,scotia credit card protec,Tion,posted,Debit,8.06
,2026-02-22,netflix,844-505-2993 015,posted,Debit,27.58
,2026-02-21,thank you tan,Gerine,posted,Credit,-300
,2026-02-20,thank you tan,Gerine,posted,Credit,-1000
,2026-02-17,best buy,866-237-8289 020,posted,Debit,30.5
,2026-02-16,sonnet insurance,Waterloo 020,posted,Debit,29.85
,2026-02-15,a2webhost,Ann Arbor 082,posted,Debit,42.28
,2026-02-14,hp instant ink,855-785-2777 019,posted,Debit,2.59
,2026-02-14,payment from - *****05*84,27,posted,Credit,-104
,2026-02-13,photobucket,3032285130066,posted,Debit,6.82
,2026-02-13,bell canada,Verdun 022,posted,Debit,56.5
,2026-02-12,walmart,Etobicoke 020,posted,Debit,133.02
,2026-02-12,walmart,Mississauga 020,posted,Debit,14.66
,2026-02-10,chexy,Toronto 020,posted,Debit,1984.13
,2026-02-08,habitify habit,G.Co/Helppay#019,posted,Debit,28.73
,2026-02-07,google one,G.Co/Helppay#019,posted,Debit,4.59
,2026-02-06,thank you tan,Gerine,posted,Credit,-1000
,2026-02-06,thank you tan,Gerine,posted,Credit,-300
,2026-02-06,a2webhost,Ann Arbor 082,posted,Debit,15.75
,2026-02-03,payment from - *****05*84,27,posted,Credit,-4080
,2026-02-03,patreon,Dublin 005,posted,Debit,13.5
,2026-02-02,audible,Amzn.Com/Bill090,posted,Debit,15.7`;


const csvParser = new CSVParser({logTool});

const content = csvParser.parseCSVContent(csvContent);

console.log("result:",content);