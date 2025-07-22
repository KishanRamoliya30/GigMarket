import mongoose, { Schema } from 'mongoose';
const BidSchema = new Schema(
    {
      bidAmount: { type: Number, required: true, min: 0 },
      description: { type: String, required: true },
      gigId: { type: Schema.Types.ObjectId, ref: 'gigs', required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    },
    {
      timestamps: true,
    }
  );
  
  const Bids = mongoose.models.bids || mongoose.model('bids', BidSchema);
  export default Bids;