// models/AuditLog.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const auditLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    default: {}
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info'
  },
  ip: String,
  userAgent: String,
  // Add these fields to auditLogSchema
resource: {
  type: String,
  enum: ['user', 'donation', 'distribution', 'account'],
  required: true
},
resourceId: {
  type: Schema.Types.ObjectId,
  required: false
},
metadata: {
  type: Object,
  default: {}
},
geolocation: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ severity: 1 });

const AuditLog = model('AuditLog', auditLogSchema);

export default AuditLog;
