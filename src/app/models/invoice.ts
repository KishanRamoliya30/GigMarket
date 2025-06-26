import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    invoiceId: { type: String, required: true }, // Stripe invoice ID
    invoiceNumber: { type: String },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['paid', 'failed', 'open', 'unpaid', 'void', 'draft'],
      default: 'open',
    },
    invoiceUrl: { type: String },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    paidAt: { type: Date },
    createdAtStripe: { type: Date },
  },
  { timestamps: true }
);

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default Invoice;
