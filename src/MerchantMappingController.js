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


    self.addMapping = async function (req,res){
        self.logTool.log("addMapping called with ownerId: " + req.params.ownerId);

          const ownerId = req.params.ownerId;
          const newMapping = req.body.mapping;

          self.logTool.log(`Adding mapping ${JSON.stringify(newMapping)}`);

          const mappingAdded  = await self.merchantLookupService.addMapping(newMapping, ownerId);
          res.json({ message: 'Mapping added successfully',mappingAdded  });
    }

    self.deleteMapping = async function(req,res){
        self.logTool.log("deleteMapping called with ownerId: " + req.params.ownerId);

          const ownerId = req.params.ownerId;
          const victim = req.body.mapping;
          self.logTool.log(`Deleting mapping ${JSON.stringify(victim)}`);
          const mappingDeleted  = await self.merchantLookupService.deleteMapping(victim, ownerId);
          if (!mappingDeleted) {
              return res.status(404).json({ message: 'Mapping not found' });
          }
          res.json({ message: 'Mapping deleted successfully',mappingDeleted  });
    }


    self.updateMapping = async function(req,res)
    {
        self.logTool.log("updateMapping called with ownerId: " + req.params.ownerId);

          const ownerId = req.params.ownerId;
          const victim = req.body.mapping;
          self.logTool.log(`Updating mapping ${JSON.stringify(victim)}`);
          const mappingUpdated  = await self.merchantLookupService.updateMapping(victim, ownerId);
          if (!mappingUpdated) {
              return res.status(404).json({ message: 'Mapping not found' });
          }
          res.json({ message: 'Mapping updated successfully',mappingUpdated  });

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