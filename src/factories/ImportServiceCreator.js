import 'dotenv/config';
import CSVParser from "../util/CSVParser.js";
import LogTool from "../LogTool.js";
import MerchantClassifier from "../util/MerchantClassifier.js";
import MerchantMappingRepository from "../MerchantMappingRepository.js";
import MerchantMapping from "../mongooseModels/MerchantMapping.js";
import APIClient from "../util/APIClient.js";
import MerchantLookupService from "../services/MerchantLookupService.js";
import ImportService from "../services/ImportService.js";   
import DBConnector_Mongoose from "../util/DBConnector_Mongoose.js";

function ImportServiceCreator({ logTool,configs}) 
{
    const self = this;
    const _private = {};
    _private.logTool = logTool || new LogTool();

  
    _private.cachedMerchants =  new Map();// {fetched: false, data: []};
    const dbConnector = new DBConnector_Mongoose({ logTool: _private.logTool, config: configs });
    const csvParser = new CSVParser({ logTool: _private.logTool });
    const merchantClient = new APIClient({
        clientTypeModel: {
            url: configs.MERCHANT_GETALL_URL
        },
        apiKey: configs.MERCHANT_API_KEY
    });

    
    self.create =  function({ defaultValues }) {
   
  
        const merchantLookupService =   self.createOnlyMerchantLookupService();

        return new ImportService({ csvParser, merchantLookupService, logTool: _private.logTool, defaultValues });
    }


    self.createOnlyMerchantLookupService =   function() {
         
        const merchantMappingRepository = new MerchantMappingRepository({
            logTool: _private.logTool,
            dbConnector,
            MerchantMappingModel: MerchantMapping
        });

        const merchantClassifier = new MerchantClassifier({  logTool: _private.logTool ,merchantClient });
        const merchantLookupService = new MerchantLookupService({ merchantClassifier,
            merchantMappingRepository,
            logTool:_private.logTool });

        return merchantLookupService;

    }

     


}


export default ImportServiceCreator;