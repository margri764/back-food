const { Schema, model } = require('mongoose');

const LoginAttemptSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('LoginAttempt', LoginAttemptSchema);
