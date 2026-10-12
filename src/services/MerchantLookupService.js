function MerchantLookupService({ merchantClassifier, logTool,merchantMappingRepository }) {

    const self = this;

    self.classifier = merchantClassifier;
    self.repo = merchantMappingRepository;
    self.logTool = logTool;

    self.findAllMappingsForOwner = async function(ownerId)
    {
        self.logTool.log(`Finding all mappings for ownerId ${ownerId}...`);
        return await self.repo.findAllByOwnerId(ownerId);
    }

    self.lookup = async function({ description ,ownerId}) {
        await self.classifier.getMerchantsForOwner(ownerId); // Ensure classifier has the latest merchants for the owner
        self.logTool.log(`Looking up merchant for description "${description}"... and ownerId ${ownerId}`);
        const fromClassifyer =  this.classifier.classify({ description, ownerId: ownerId });
        if (fromClassifyer) return fromClassifyer;

         this.logTool.log(`Nothing from classifier "${description}", checking repository...`);

        const fromRepo = await this.repo.findByDescription(description,ownerId); 
        if(!fromRepo){
            this.logTool.log(`No mapping found for "${description}" in repository`);
            return null;
        }

        this.logTool.log(`Repository match: ${JSON.stringify(fromRepo)}`);
        return fromRepo;
    }

    self.updateMappings = async function(newMappings,ownerId)
    {
        this.logTool.log(`Updating mappings for owner ${ownerId} with new mappings: ${JSON.stringify(newMappings)}`);
        
        await this.repo.renewMappings(ownerId, newMappings);
        this.logTool.log(`Mappings updated in repository for owner ${ownerId}: ${JSON.stringify(newMappings)}`);    
    }

}

export default MerchantLookupService;