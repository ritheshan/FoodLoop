import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const recurringDonationSchema = new Schema({
    donor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    foodType: { type: String, required: true },
    weight: { type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    storage: { type: String, enum: ['refrigerated', 'room temp', 'frozen'], required: true },
    startDate: { type: Date, required: true },
    expirationEstimate: { type: Number }, // predicted shelf-life in hours/days
    nextScheduled: { type: Date },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true });
  
  export default model('RecurringDonation', recurringDonationSchema);