import Fuse from 'fuse.js';

class MerchantClassifier {

    constructor({ merchants, logTool,merchantMappingRepository,ownerId }) {
        this.logTool = logTool;
        this.merchantMappingRepository = merchantMappingRepository;
        this.ownerId = ownerId;
        this.fuse = new Fuse(merchants, {
            keys: ['name'],
            threshold: 0.4,
            includeScore: true,
        });
    }

    async checkInRepository(description) {



            this.logTool.log(`No merchant match for checking repository: ${description}, checking repository...`);
         let   results = await this.merchantMappingRepository.findByDescription(description, this.ownerId);
          
            if(results== null) 
            {
                this.logTool.log(`No merchant match in repository for: ${description}`);
                return [];
            }
            else 
                results= [results]; // convert to array for uniform processing
            this.logTool.log(`Repository results: ${JSON.stringify(results)}`);
            return results;
    }
    async classify(description) {
        let results = this.fuse.search(description);
         if (results.length > 0) 
            results = [ {
                    merchantId: results[0].item.id,
                    merchantName: results[0].item.name,
                    score: results[0].score,
                }];

        if (results.length === 0) {
            results = await this.checkInRepository(description);
        }
 

        if (results.length === 0) {
            this.logTool.log(`No merchant match for: ${description}`);
            return null;
        }

        const best = results[0];
        this.logTool.log(`Matched "${description}" → "${best.merchantName}" (score: ${best.score})`);

        return best;
    }
}

export default MerchantClassifier;