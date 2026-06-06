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

    //TODO : needs to handle multiple owners — currently it will cache merchants for the first owner and return the same for all subsequent calls, even if they are for different owners. To fix this, we can change the cache structure to store merchants separately for each ownerId.
    _private.cachedMerchants = {fetched: false, data: []};
    const dbConnector = new DBConnector_Mongoose({ logTool: _private.logTool, config: configs });
    const csvParser = new CSVParser({ logTool: _private.logTool });
    const merchantClient = new APIClient({
        clientTypeModel: {
            url: configs.MERCHANT_GETALL_URL
        },
        apiKey: configs.MERCHANT_API_KEY
    });
   self.getMerchantsForOwner = async function(ownerId) {
        if (_private.cachedMerchants.fetched) {
            _private.logTool.log(`Returning cached merchants for ownerId ${ownerId}`);
            return _private.cachedMerchants.data;
        }

        try {
            const merchants = await merchantClient.fetch().then(r => r.subject);
            _private.cachedMerchants = { fetched: true, data: merchants };
            return merchants;
        } catch (error) {
            _private.logTool.log(`Error fetching merchants: ${error.message}`);
            return []; // not cached — next call will retry
        }
    }
    self.create = async function({ ownerId, defaultValues }) {
        const result = await self.getMerchantsForOwner(ownerId);
        const merchants = result || [];
         _private.logTool.log(`Fetched ${merchants.length} merchants for ownerId ${ownerId}`);

  
        const merchantLookupService =   self.createOnlyMerchantLookupService({ ownerId ,merchants});

        return new ImportService({ csvParser, merchantLookupService, logTool: _private.logTool, defaultValues });
    }


    self.createOnlyMerchantLookupService =  async function({ ownerId ,merchants}) {
         
        const merchantMappingRepository = new MerchantMappingRepository({
            logTool: _private.logTool,
            dbConnector,
            MerchantMappingModel: MerchantMapping
        });

        const merchantClassifier = new MerchantClassifier({ merchants, logTool: _private.logTool, ownerId });
        const merchantLookupService = new MerchantLookupService({ merchantClassifier,
            merchantMappingRepository,
            logTool:_private.logTool });

        return merchantLookupService;

    }

     


}


export default ImportServiceCreator;