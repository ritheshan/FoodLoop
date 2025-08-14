// models/joyloop.model.js
import mongoose from 'mongoose';

const joyLoopSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    required: false
  },
  mediaUrl: {
    type: String,
    required: false
  },
  mediaType: {
    type: String, // 'image' | 'video'
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('JoyLoop', joyLoopSchema);
