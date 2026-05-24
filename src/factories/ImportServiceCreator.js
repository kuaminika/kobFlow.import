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

function ImportServiceCreator(logTool) 
{
    const self = this;
    const _private = {};
    _private.logTool = logTool || new LogTool();
    const dbConnector = new DBConnector_Mongoose({ logTool: _private.logTool, config: process.env });
    const csvParser = new CSVParser({ logTool: _private.logTool });
    const merchantClient = new APIClient({
        clientTypeModel: {
            url: 'https://dev.korosol.com/kobFlow_dev/KobFlowAPIGateWay/API/index.php?context=Flows&requestAction=getAll&sourceContext=Merchant'
        },
        apiKey: 'test-key'
    });
    self.create = async function({ ownerId, defaultValues }) {
        const result = await merchantClient.fetch();
        const merchants = result.subject;

        const merchantMappingRepository = new MerchantMappingRepository({
            logTool: _private.logTool,
            dbConnector,
            MerchantMappingModel: MerchantMapping
        });

        const merchantClassifier = new MerchantClassifier({ merchants, logTool: _private.logTool, ownerId });
        const merchantLookupService = new MerchantLookupService({ merchantClassifier,
            merchantMappingRepository,
            logTool:_private.logTool });

        return new ImportService({ csvParser, merchantLookupService, logTool: _private.logTool, defaultValues });
    }
}


export default ImportServiceCreator;