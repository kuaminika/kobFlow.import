import MerchantClassifier from "../util/MerchantClassifier.js";
import MerchantLookupService from "../services/MerchantLookupService.js";
import MerchantMappingRepository from "../MerchantMappingRepository.js";
import LogTool from "../LogTool.js";
import DBConnector_Mongoose from "../util/DBConnector_Mongoose.js";
import MerchantMapping from "../mongooseModels/MerchantMapping.js";
import APIClient from "../util/APIClient.js";
function MerchantLookupServiceCreator({logTool,configs}){


    const self = this;
    const _private = {};
    _private.logTool = logTool || new LogTool();
    const dbConnector = new DBConnector_Mongoose({ logTool: _private.logTool, config: configs });
    const merchantClient = new APIClient({
        clientTypeModel: {
            url: configs.MERCHANT_GETALL_URL
        },
        apiKey: configs.MERCHANT_API_KEY
    });
    self.create =async function({ownerId, defaultValues})
    {

        
        const result = await merchantClient.fetch();
        const merchants = result.subject;
        
        const merchantMappingRepository = new MerchantMappingRepository({logTool,dbConnector,MerchantMappingModel :MerchantMapping});
        const merchantClassifier = new MerchantClassifier({merchants,logTool,ownerId});
        const merchantLookupService = new MerchantLookupService({merchantClassifier,merchantMappingRepository,logTool});
        return merchantLookupService;
    }
}

export default MerchantLookupServiceCreator;