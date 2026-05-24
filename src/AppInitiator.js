import express from "express";
import ImportServiceCreator from "./factories/ImportServiceCreator.js";
import ExpenseServiceCreator from "./factories/ExpenseServiceCreator.js"; 
import LogTool from "./LogTool.js";
import ExpenseImportController from "./ExpenseImportController.js";
import cors from "cors";
import { Router } from "express";
const router = Router();
 function AppInitiator(configs)
{
    const self = this;
    const config = configs;
    const logTool = new LogTool();
    const defaultValues  = {
        DEFAULT_MERCHANT_ID: config.DEFAULT_MERCHANT_ID || 1,
        DEFAULT_CATEGORY_ID: config.DEFAULT_CATEGORY_ID || 1,
        KOB_HOLDER_ID: config.KOB_HOLDER_ID || 1    
    };
    self.init =async  function(){

        logTool.log("Initializing application with configs: " + JSON.stringify(configs));

        const importServiceCreator = new ImportServiceCreator({ logTool });
        const expenseServiceCreator = new ExpenseServiceCreator({ logTool });
        
        const importService = await importServiceCreator.create({ ownerId: config.OWNER_ID, defaultValues }).then(importService => {
            logTool.log("Import Service created successfully");
            // You can now use the importService instance to handle imports
        }).catch(error => {
            logTool.log(`Error creating Import Service: ${error.message}`);
        });
        
        const expenseService =  expenseServiceCreator.create();
          logTool.log("Expense Service created successfully");

       const expenseImportController = new ExpenseImportController({ logTool, importService, expenseService });


       router.post("/parse-csv-expenses", expenseImportController.parseCSVExpenses);
       router.post("/bulk-insert-expenses", expenseImportController.doBulkInsert);
      
 
        const app = express();
        app.use("/",router);
        app.listen(config.port,()=>{
            logTool.log(`service running  ${config.serviceName} at port ${config.port}`)

        })


    }
}

export {AppInitiator}