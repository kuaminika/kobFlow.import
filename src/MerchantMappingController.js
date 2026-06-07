function MerchantMappingController({logTool, merchantLookupService }) {

    const self = this;
    self.merchantLookupService = merchantLookupService;
    self.logTool = logTool;

    self.getMappings = async function(req, res) {
        self.logTool.log("getMappings called with ownerId: " + req.params.ownerId);
 
        const ownerId = req.params.ownerId;
        const mappings = await self.merchantLookupService.findAllMappingsForOwner(ownerId);
        self.logTool.log(`Mappings retrieved for ownerId ${ownerId}: ${JSON.stringify(mappings)}`);
        res.json(mappings);
    }

    self.updateMappings = async function(req, res) {
        const ownerId = req.params.ownerId;
        const newMappings = req.body.mappings; // Expecting an array of { description, merchantName }
        self.logTool.log("updateMappings called with ownerId: " + ownerId);
        await self.merchantLookupService.updateMappings(newMappings, ownerId);
        res.json({ message: 'Mappings updated successfully' });
    }


}

export default MerchantMappingController;