function MerchantMappingController({logTool, merchantLookupService }) {

    const self = this;

    self.getMappings = async function(req, res) {
        const ownerId = req.params.ownerId;
        const mappings = await this.merchantLookupService.repo.findAllByOwnerId(ownerId);
        res.json(mappings);
    }

    self.updateMappings = async function(req, res) {
        const ownerId = req.params.ownerId;
        const newMappings = req.body.mappings; // Expecting an array of { description, merchantName }
        
        await this.merchantLookupService.updateMappings(newMappings, ownerId);
        res.json({ message: 'Mappings updated successfully' });
    }


}

export default MerchantMappingController;