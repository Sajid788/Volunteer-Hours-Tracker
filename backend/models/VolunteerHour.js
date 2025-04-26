const mongoose = require('mongoose');

const VolunteerHourSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please add a description of the volunteer work'],
    trim: true,
    maxlength: [200, 'Description can not be more than 200 characters']
  },
  hours: {
    type: Number,
    required: [true, 'Please add the number of hours'],
    min: [0.25, 'Hours must be at least 15 minutes (0.25 hours)']
  },
  date: {
    type: Date,
    required: [true, 'Please add the date of volunteer work'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VolunteerHour', VolunteerHourSchema); 