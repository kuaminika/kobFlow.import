import assert from "node:assert/strict";
import MerchantMappingRepository from "../MerchantMappingRepository.js";
import MerchantLookupService from "../services/MerchantLookupService.js";

const mappings = [];
const logTool = { log() {}, error() {} };
const dbConnector = { connect: async () => {} };
const merchantMappingModel = {
    async create(mapping) {
        mappings.push({ ...mapping });
        return mappings[mappings.length - 1];
    },
    async findOneAndUpdate(filter, update) {
        const mapping = mappings.find(item =>
            item.rawDescription === filter.rawDescription && item.ownerId === filter.ownerId
        );
        if (!mapping) return null;
        Object.assign(mapping, update);
        return mapping;
    },
    async findOneAndDelete(filter) {
        const index = mappings.findIndex(item =>
            item.rawDescription === filter.rawDescription && item.ownerId === filter.ownerId
        );
        if (index === -1) return null;
        return mappings.splice(index, 1)[0];
    },
    async find(filter) {
        return mappings.filter(mapping => mapping.ownerId === filter.ownerId);
    }
};

const repository = new MerchantMappingRepository({
    logTool,
    dbConnector,
    MerchantMappingModel: merchantMappingModel
});
const service = new MerchantLookupService({
    merchantClassifier: {},
    merchantMappingRepository: repository,
    logTool
});

const addedMapping = await service.addMapping({
    rawDescription: "  Coffee Shop  ",
    merchantId: 10,
    merchantName: "Coffee Shop",
    ownerId: 999
}, 1);
assert.equal(addedMapping.rawDescription, "Coffee Shop");
assert.equal(addedMapping.ownerId, 1);

await service.addMapping({
    rawDescription: "Coffee Shop",
    merchantId: 20,
    merchantName: "Another Owner's Shop"
}, 2);

const updatedMapping = await service.updateMapping({
    rawDescription: " Coffee Shop ",
    merchantId: 11,
    confirmedByUser: true,
    ownerId: 999
}, 1);
assert.equal(updatedMapping.merchantId, 11);
assert.equal(updatedMapping.confirmedByUser, true);
assert.equal(updatedMapping.ownerId, 1);
assert.equal((await service.findAllMappingsForOwner(2))[0].merchantId, 20);

const deletedMapping = await service.deleteMapping({ rawDescription: " Coffee Shop " }, 1);
assert.equal(deletedMapping.ownerId, 1);
assert.equal(await service.deleteMapping({ rawDescription: "Coffee Shop" }, 1), null);
assert.equal((await service.findAllMappingsForOwner(2)).length, 1);

await assert.rejects(
    service.addMapping({ merchantId: 1, merchantName: "Missing description" }, 1),
    /rawDescription/
);
await assert.rejects(
    service.updateMapping({ rawDescription: "Coffee Shop" }, 1),
    /at least one field/
);

console.log("Merchant mapping CRUD checks passed.");
