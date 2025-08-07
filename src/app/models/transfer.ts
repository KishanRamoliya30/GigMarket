import mongoose, { Schema } from 'mongoose';

const TransferHistorySchema = new Schema(
  {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    providerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    gigId: { type: Schema.Types.ObjectId, ref: 'gigs', required: true },
    transferId: { type: String, required: true }, 
    accountId: { type: String, required: true },  
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed'],
      default: 'Pending',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true }, // Admin or system user
  },
  {
    timestamps: true,
  }
);

const TransferHistory =
  mongoose.models.transferhistories ||
  mongoose.model('transferhistories', TransferHistorySchema);

export default TransferHistory;
