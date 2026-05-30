function MerchantLookupService({ merchantClassifier, logTool,merchantMappingRepository,ownerId }) {

    const self = this;

    self.classifier = merchantClassifier;
    self.repo = merchantMappingRepository;
    self.ownerId = ownerId;
    self.logTool = logTool;

    self.lookup = async function(description) {
        const fromClassifyer = await this.classifier.classify(description);
        if (fromClassifyer) return fromClassifyer;

         this.logTool.log(`Nothing from classifier "${description}", checking repository...`);

        const fromRepo = await this.repo.findByDescription(description,self.ownerId); 
        if(!fromRepo){
            this.logTool.log(`No mapping found for "${description}" in repository`);
            return null;
        }

        this.logTool.log(`Repository match: ${JSON.stringify(fromRepo)}`);
        return fromRepo;
    }

    self.updateMappings = async function(newMappings,ownerId)
    {
        
        await this.repo.bulkCreateOrUpdate(ownerId, newMappings);
        this.logTool.log(`Mappings updated in repository for owner ${ownerId}: ${JSON.stringify(newMappings)}`);    
    }

}

export default MerchantLookupService;