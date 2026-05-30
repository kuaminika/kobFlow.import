import Fuse from 'fuse.js';

class MerchantClassifier {
    constructor({ merchants, logTool }) {
        this.logTool = logTool;
        this.fuse = new Fuse(merchants, {
            keys: ['name'],
            threshold: 0.4,
            includeScore: true,
        });
    }

    classify(description) {            // now sync — no async needed
        const results = this.fuse.search(description);
           if (results.length === 0) {
            this.logTool.log(`No merchant match for: ${description}`);
            return null;
        }
        const best = results[0];
    
        this.logTool.log(`Matched "${description}" → "${best.item.name}" (score: ${best.score})`);


        return {
            merchantId: best.item.id,
            merchantName: best.item.name,
            score: best.score,
        };
    }
}

export default MerchantClassifier;