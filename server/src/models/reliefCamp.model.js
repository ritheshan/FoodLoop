import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const reliefCampSchema = new Schema({
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true, index: '2dsphere' }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, enum: ['flood', 'heatwave', 'earthquake'], required: true },
    startDate: { type: Date, required: true },
    resourcesNeeded: [{ type: String }],
    volunteersAlerted: { type: Boolean, default: false },
    ngoAlerted: { type: Boolean, default: false },
    demandPrediction: { type: Number, default: 0 }, // from AI forecast
  }, { timestamps: true });

  export default model('Camp', reliefCampSchema);