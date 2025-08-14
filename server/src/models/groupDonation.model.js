import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const timelineEventSchema = new Schema({
  status: String,
  by: String,
  timestamp: { type: Date, default: Date.now }
});

const groupDonationSchema = new Schema({
  name: String,
  creator: { type: Types.ObjectId, ref: 'User' },
  members: [{ type: Types.ObjectId, ref: 'User' }],
  listings: [{ type: Types.ObjectId, ref: 'FoodListing' }],
  route: [[Number]], // [ [lng, lat], ... ]
  status: { type: String, enum: ['pending', 'en_route', 'completed'], default: 'pending' },
  timeline: [timelineEventSchema]
}, { timestamps: true });

export default mongoose.model('GroupDonation', groupDonationSchema);
