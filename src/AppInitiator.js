import express from "express";
import ImportServiceCreator from "./factories/ImportServiceCreator.js";
import ExpenseServiceCreator from "./factories/ExpenseServiceCreator.js"; 
import LogTool from "./LogTool.js";
import ExpenseImportController from "./ExpenseImportController.js";
import MerchantMappingController from "./MerchantMappingController.js";
import cors from "cors";
import { Router } from "express";
import MerchantLookupServiceCreator from "./factories/MerchantLookupServiceCreator.js";
import HealthStatusController from "./HealthStatusController.js";
import DBConnector_Mongoose from "./util/DBConnector_Mongoose.js";
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

        // Connect before building services so a database failure stops startup.
        const dbConnector = new DBConnector_Mongoose({ logTool, config: configs });
        await dbConnector.connect();

     
        const importServiceCreator = new ImportServiceCreator({ logTool,configs });
        const expenseServiceCreator = new ExpenseServiceCreator({ logTool,configs });
        const merchantLookupServiceCreator = new MerchantLookupServiceCreator({ logTool, configs });
        const healthStatusController = new HealthStatusController({ logTool, configs });
        const importService = await importServiceCreator.create({ ownerId: config.OWNER_ID, defaultValues });
        
        logTool.log("Import Service created successfully");
    
        const merchantLookupService =await  merchantLookupServiceCreator.create({ ownerId: config.OWNER_ID,dbKonnector:dbConnector, defaultValues });
        const expenseService = expenseServiceCreator.create();
          logTool.log("Expense Service created successfully");
          logTool.log("Merchant Lookup Service created successfully");
       const expenseImportController = new ExpenseImportController({ logTool, importService, expenseService });
       const merchantMappingController = new MerchantMappingController({ logTool, merchantLookupService });

       router.post("/parse-csv-expenses", expenseImportController.parseCSVExpenses);
       router.post("/bulk-insert-expenses", expenseImportController.doBulkInsert);
       router.get("/mappings/:ownerId", merchantMappingController.getMappings);
       router.post("/mappings/:ownerId", merchantMappingController.addMapping);
       router.put("/mappings/:ownerId", merchantMappingController.updateMapping);
       router.delete("/mappings/:ownerId", merchantMappingController.deleteMapping);
       router.get("/health", healthStatusController.health);
       router.post("/updateMappings/:ownerId", merchantMappingController.updateMappings);
 
        const app = express();
     
        app.use(cors({origin:config.corsOrigin}));
        logTool.log("CORS origin: " + config.corsOrigin);
        app.use(express.json());
        app.use("/",router);
        const server = app.listen(config.port,()=>{
            logTool.log(`service running  ${config.serviceName} at port ${config.port}`)

        })
        server.on("error", error => {
            logTool.critical(`HTTP server error: ${error.message}`, { stack: error.stack });
            process.exit(1);
        });


    }
}

export {AppInitiator}
