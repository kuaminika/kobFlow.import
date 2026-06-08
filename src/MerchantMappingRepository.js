function MerchantMappingRepository({ logTool,dbConnector,MerchantMappingModel }) {
    const self = this;
    dbConnector.connect();

    self.createMapping = async function (rawInfo) {
        await MerchantMappingModel.create(rawInfo);
    }

    self.findByDescription = async function (rawDescription, ownerId) {
        return await MerchantMappingModel.findOne({ rawDescription, ownerId });
    }

    self.findAllByOwnerId = async function (ownerId) {
        return await MerchantMappingModel.find({ ownerId });
    }

    self.updateMapping = async function (rawDescription, ownerId, updateData) {
        return await MerchantMappingModel.findOneAndUpdate(
            { rawDescription, ownerId },
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );
    }

    self.createOrUpdate = async function (rawDescription, ownerId, data) {
        return await MerchantMappingModel.findOneAndUpdate(
            { rawDescription, ownerId },
            { ...data, updatedAt: new Date() },
            { upsert: true, new: true }
        );
    }

    self.getAllMappings = async function (ownerId) {
        const mappings = await MerchantMappingModel.find({ ownerId });

        const mappingMap = {};
        mappings.forEach(m => {
            mappingMap[m.rawDescription] = {
                merchantId: m.merchantId,
                merchantName: m.merchantName,
                confirmedByUser: m.confirmedByUser,
            };
        });

        return mappingMap;
    }

    self.bulkCreateOrUpdate = async function (ownerId, mappings) {

        const operations = Object.entries(mappings).map(([rawDescription, data]) => 
        {
            const {_id, ...dataWithoutId} = data; // Exclude _id if it exists
            const result= {            
                    updateOne: {
                        filter: { rawDescription, ownerId },
                        update: { ...dataWithoutId, ownerId, rawDescription, updatedAt: new Date() },
                        upsert: true,
                    }
                }
            return result;
        });
        

        return await MerchantMappingModel.bulkWrite(operations);
    }


    self.renewMappings = async function (ownerId, newMappings) {
        logTool.log(`Renewing mappings for owner ${ownerId}. Deleting old mappings and inserting new ones.`);
        logTool.log(`New mappings to insert: ${JSON.stringify(newMappings)}`);
        await MerchantMappingModel.deleteMany({ ownerId });
        const mappingsToCreate = newMappings.map(m =>{
            const {_id, ...dataWithoutId} = m; // Exclude _id if it exists
            return {
                ...dataWithoutId,
                ownerId,
                merchantId: m.merchantId||1,
                merchantName: m.merchantName||"Unknown",
                rawDescription: m.rawDescription,
                updatedAt: new Date()
            }

        });
        logTool.log(`Mappings to create after processing: ${JSON.stringify(mappingsToCreate)}`);
        return await MerchantMappingModel.insertMany(mappingsToCreate);


    }
}

export default MerchantMappingRepository;