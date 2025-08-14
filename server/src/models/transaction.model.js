import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const timelineEventSchema = new Schema({
  status: {
    type: String,
    enum: [
      'pending',       // just created/matched
      'requested',     // NGO has requested pickup
      'picked_up',     // volunteer has picked it up
      'in_transit',    // on the way
      'delivered',     // delivered to NGO
      'confirmed'      // blockchain confirmation / NFT minted
    ],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  by: {
    // Who triggered it: 'system', 'ngo', 'volunteer', 'donor'
    type: String,
    enum: ['system','donor','ngo','volunteer'],
    default: 'system'
  },
  note: { type: String } // optional free‐text
}, { _id: false });

const donationTransactionSchema = new Schema({
  foodListing:     { type: Schema.Types.ObjectId, ref: 'FoodListing', required: true },
  donor:           { type: Schema.Types.ObjectId, ref: 'User',        required: true },
  ngo:             { type: Schema.Types.ObjectId, ref: 'User',        required: true },
  volunteer:       { type: Schema.Types.ObjectId, ref: 'User',        default: null },

  // tracks who clicked “Accept”
  confirmedBy:     [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // tracks who clicked “Reject”
  rejectedBy:      [{ type: Schema.Types.ObjectId, ref: 'User' }],

  // high‑level status for quick queries
  status: {
    type: String,
    enum: ['pending',      // just created/matched
    'requested',    // NGO has requested pickup
    'picked_up',    // volunteer picked up
    'in_transit',   // on the way
    'delivered',    // delivered
    'confirmed',    // NFT minted
    'rejected',     // someone rejected
    'on_chain'      // blockchain storage complete,
    ],
    default: 'pending'
  },

  // your blockchain proof fields
  transactionHash: { type: String, default: null },
  blockchainConfirmed: { // indicates NFT mint succeeded
    type: Boolean,
    default: false
  },

  // full history of this transaction
  timeline: {
    type: [timelineEventSchema],
    default: [{ status: 'pending', by: 'system' }]
  },

  // data you embed in the certificate/NFT
  certificateData: {
    transactionHash: String,
    nftTokenId:      String,
    donorName:       String,
    donorEmail:      String,
    foodType:        String,
    weight:          Number,
    location:        String,
    timestamp:       String,
    date:            String,
  },

  // impact metrics
  value:             { type: Number, default: 0 },   // e.g. estimated meal value
  peopleServed:      { type: Number, default: 0 },
  distributionsCount:{ type: Number, default: 0 }

}, { timestamps: true });

export default model('Transaction', donationTransactionSchema);
