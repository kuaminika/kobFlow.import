


import LogTool from "../LogTool.js";
import APIClient from "../util/APIClient.js";
import ExpenseService from "../services/ExpenseService.js";
import ImportServiceCreator from "../factories/ImportServiceCreator.js";
import ExpenseServiceCreator from "../factories/ExpenseServiceCreator.js";
const logTool = new LogTool();



 
const csvContent = `ï»¿Filter,Date,Description,Sub-description,Status,Type of Transaction,Amount
"March 2026, From date=2026-03-01, To date=2026-03-31",2026-03-28,scotiabank transit,Toronto On,posted,Debit,15
,2026-03-27,adobe,San Jose 065,posted,Debit,29.88
,2026-03-26,youtube premium,G.Co/Helppay#019,posted,Debit,26.43
,2026-03-26,bell canada,Montreal 022,posted,Debit,79.1
,2026-03-24,linkedin,Mountain View065,posted,Debit,40.35
,2026-03-23,scotia credit card protec,Tion Tax,posted,Debit,0.64
,2026-03-23,scotia credit card protec,Tion,posted,Debit,8.06
,2026-03-22,netflix,844-505-2993 015,posted,Debit,27.58
,2026-03-21,thank you tan,Gerine,posted,Credit,-300
,2026-03-20,thank you tan,Gerine,posted,Credit,-1000
,2026-03-17,best buy,866-237-8289 020,posted,Debit,30.5
,2026-03-16,sonnet insurance,Waterloo 020,posted,Debit,29.85
,2026-03-15,a2webhost,Ann Arbor 082,posted,Debit,42.28
,2026-03-14,hp instant ink,855-785-2777 019,posted,Debit,2.59
,2026-03-14,payment from - *****05*84,27,posted,Credit,-104
,2026-03-13,photobucket,3032285130066,posted,Debit,6.82
,2026-03-13,bell canada,Verdun 022,posted,Debit,56.5
,2026-03-12,walmart,Etobicoke 020,posted,Debit,133.02
,2026-03-12,walmart,Mississauga 020,posted,Debit,14.66
,2026-03-10,chexy,Toronto 020,posted,Debit,1984.13
,2026-03-08,habitify habit,G.Co/Helppay#019,posted,Debit,28.73
,2026-03-07,google one,G.Co/Helppay#019,posted,Debit,4.59
,2026-03-06,thank you tan,Gerine,posted,Credit,-1000
,2026-03-06,thank you tan,Gerine,posted,Credit,-300
,2026-03-06,a2webhost,Ann Arbor 082,posted,Debit,15.75
,2026-03-03,payment from - *****05*84,27,posted,Credit,-4080
,2026-03-03,patreon,Dublin 005,posted,Debit,13.5
,2026-03-02,audible,Amzn.Com/Bill090,posted,Debit,15.7`;

const ownerId = 1;

const defaultValues  = {
    DEFAULT_MERCHANT_ID: 1,
    DEFAULT_CATEGORY_ID: 1,
    KOB_HOLDER_ID: 1    
};
const expenseServiceCreator = new ExpenseServiceCreator({ logTool });
const importServiceCreator = new ImportServiceCreator(logTool);
const importService = await importServiceCreator.create({ ownerId, defaultValues });
const expenses = await importService.handleCSVImport(csvContent, ownerId);
const expenseService = expenseServiceCreator.create();
expenses.forEach(expense => {
    logTool.log(`Expense: ${expense.description}, Amount: ${expense.amount}, MerchantId: ${expense.merchantId}`);
    expense.description = `Test Expense - ${expense.description} ${new Date()}`;

});


 
const expenseCount = await expenseService.getAllExpenses().then(expenses => {{return expenses.length}});
const bulkInsertResult = await expenseService.bulkInsert(expenses);

logTool.log(`Bulk insert result: ${JSON.stringify(bulkInsertResult)}`); 