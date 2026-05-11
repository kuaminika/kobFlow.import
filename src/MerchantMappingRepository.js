function MerchantMappingRepository({ MerchantMappingModel }) {
    const self = this;

    self.createMapping = async function (rawInfo) {
        await MerchantMappingModel.create(rawInfo);
    }

    self.findByDescription = async function (rawDescription, ownerId) {
        return await MerchantMappingModel.findOne({ rawDescription, ownerId });
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

    const operations = Object.entries(mappings).map(([rawDescription, data]) => ({
        updateOne: {
            filter: { rawDescription, ownerId },
            update: { ...data, ownerId, rawDescription, updatedAt: new Date() },
            upsert: true,
        }
    }));

    return await MerchantMappingModel.bulkWrite(operations);
}
}

export default MerchantMappingRepository;