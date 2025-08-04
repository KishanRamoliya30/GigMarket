import mongoose, { Schema } from 'mongoose';
const PaymentLogsSchema = new Schema(
    {
      amount: { type: Number, required: true, min: 0 },
      gigId: { type: Schema.Types.ObjectId, ref: 'gigs', required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      providerId:{ type: Schema.Types.ObjectId, ref: 'Users', required: true },
      status: {
        type: String,
        enum: ["Success", "Fail",],
        default: 'Success',
      },
      stripeIntentId: { type: String, required: false },
    },
    {
      timestamps: true,
    }
  );
  
  const paymentLogs = mongoose.models.paymentLogs || mongoose.model('paymentLogs', PaymentLogsSchema);
  export default paymentLogs;