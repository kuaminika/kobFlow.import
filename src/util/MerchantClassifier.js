import Fuse from 'fuse.js';

class MerchantClassifier {
    constructor({ logTool,merchantClient }) {
        this.logTool = logTool; 
        this.merchantClient = merchantClient;
        this.cachedMerchants = new Map(); // Cache merchants by ownerId
        this.fuseMap= new Map(); // Cache Fuse instances by ownerId
        this.fuseOptions = {
            keys: ['name'],
            threshold: 0.4,
            includeScore: true,
        };
    }
    
    async getMerchantsForOwner(ownerId) {
       this.logTool.log(`Fetching merchants for ownerId ${ownerId}...`);
        if (this.cachedMerchants.has(ownerId)) {
            this.logTool.log(`Returning cached merchants for ownerId ${ownerId}`);
            return this.cachedMerchants.get(ownerId);
        }
        this.logTool.log(`No cached merchants for ownerId ${ownerId}. Fetching from merchantClient...`);
        try {
            const merchants = await this.merchantClient.fetch().then(r => r.subject);
         
            const result = merchants ||[];
            this.logTool.log(`Fetched ${result.length} merchants for ownerId ${ownerId}`);
             this.cachedMerchants.set(ownerId, result);
             this.logTool.log(`Fetched and cached ${this.cachedMerchants.get(ownerId).length} merchants for ownerId ${ownerId}`);
            return result;
        } catch (error) {
            this.logTool.log(`Error fetching merchants: ${error.message}`);
            return []; // not cached — next call will retry
        }
    }
    invalidateOwner(ownerId) {
        this.cachedMerchants.delete(ownerId);
        this.fuseMap.delete(ownerId);
    }
     _runClassify({ description, fuse }) {
        const results = fuse.search(description);
        if (results.length === 0)
        {
            this.logTool.log(`No merchant found matching description "${description}"`);
            return null;
        }
        this.logTool.log(`===>Found ${results.length} potential merchants for description "${description}". Best match: "${results[0].item.name}" with score ${results[0].score}`);
        const best = results[0];
        return { merchantId: best.item.id, merchantName: best.item.name, score: best.score };
    }
    classifyWithGivenMerchants({ description,merchants })
    {
        if(!merchants?.length)
        {
            this.logTool.log("No merchants are provided. Will return null");
            return null;
        }

      
        let fuse =   new Fuse(merchants, this.fuseOptions);    
        return this._runClassify({ description, fuse });
    } 
    classify({ description, ownerId }) {      
        this.logTool.log(`Classifying merchant for description "${description}" and ownerId ${ownerId}...`);
        const merchants = this.cachedMerchants.get(ownerId) || [];
        let fuse = this.fuseMap.get(ownerId);
        if (!fuse) {
            fuse = new Fuse(merchants, this.fuseOptions);
            this.fuseMap.set(ownerId, fuse);
        }
        return this._runClassify({ description, fuse });
       
    }
}
export default MerchantClassifier;