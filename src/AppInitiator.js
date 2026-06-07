import express from "express";
import ImportServiceCreator from "./factories/ImportServiceCreator.js";
import ExpenseServiceCreator from "./factories/ExpenseServiceCreator.js"; 
import LogTool from "./LogTool.js";
import ExpenseImportController from "./ExpenseImportController.js";
import MerchantMappingController from "./MerchantMappingController.js";
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

        const importServiceCreator = new ImportServiceCreator({ logTool,configs });
        const expenseServiceCreator = new ExpenseServiceCreator({ logTool,configs });
        //TODO: we should remove ownerId from the in the constructor and pass it only to the methods that need it, to avoid confusion and potential bugs. For now, we will keep it as is and refactor later if needed.
        const importService = await importServiceCreator.create({ ownerId: config.OWNER_ID, defaultValues }).then(importService => {
            logTool.log("Import Service created successfully");
            return importService;
            // You can now use the importService instance to handle imports
        }).catch(error => {
            logTool.log(`Error creating Import Service: ${error.message}`);
        });
        
        const expenseService =  expenseServiceCreator.create();
          logTool.log("Expense Service created successfully");
        const merchantLookupService = importServiceCreator.createOnlyMerchantLookupService();
         logTool.log("Merchant Lookup Service created successfully");
       const expenseImportController = new ExpenseImportController({ logTool, importService, expenseService });
       const merchantMappingController = new MerchantMappingController({ logTool, merchantLookupService });

       router.post("/parse-csv-expenses", expenseImportController.parseCSVExpenses);
       router.post("/bulk-insert-expenses", expenseImportController.doBulkInsert);
       router.get("/mappings/:ownerId", merchantMappingController.getMappings);
       router.get("/health", (req, res) => res.send("ok"));
       router.post("/mappings/:ownerId", merchantMappingController.updateMappings);
 
        const app = express();
     
        app.use(cors({origin:config.corsOrigin}));
        logTool.log("CORS origin: " + config.corsOrigin);
        app.use(express.json());
        app.use("/",router);
        app.listen(config.port,()=>{
            logTool.log(`service running  ${config.serviceName} at port ${config.port}`)

        })


    }
}

export {AppInitiator}
