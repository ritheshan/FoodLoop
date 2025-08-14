import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const foodRequestSchema = new Schema({
  createdBy:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  forSomeoneElse:   { type: Boolean, default: false },
  organizationName: { type: String },
  contactPerson:    { type: String },
  address:          { type: String, required: true },
  phone:            { type: String, required: true },
  requestType:      { type: String, enum: ['general','emergency','event','ongoing'], required: true },
  specialOccasion:  { type: String },
  celebrationName:  { type: String },
  itemsNeeded:      { type: String, required: true },
  urgencyLevel:     { type: String, enum: ['standard','priority','express','urgent'], default: 'standard' },
  additionalNotes:  { type: String },

  status:           { 
    type: String,
    enum: ['pending','matched','in_transit','delivered','cancelled'],
    default: 'pending'
  },
}, { timestamps: true });

export default model('FoodRequest', foodRequestSchema);
