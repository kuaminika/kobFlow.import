import mongoose from 'mongoose';

const merchantMappingSchema = new mongoose.Schema({
    rawDescription: { type: String, required: true },
    ownerId: { type: Number, required: true },
    merchantId: { type: Number, required: true },
    merchantName: { type: String, required: true },
    confidence: { type: Number },
    confirmedByUser: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

merchantMappingSchema.index({ ownerId: 1, rawDescription: 1 }, { unique: true });

const MerchantMapping = mongoose.model('MerchantMapping', merchantMappingSchema);

export default MerchantMapping;