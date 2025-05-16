const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  availableSpots: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set availableSpots equal to capacity before saving
EventSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableSpots = this.capacity;
  }
  next();
});

// Delete all registrations when an event is deleted
EventSchema.pre('deleteOne', { document: true }, async function(next) {
  const Registration = mongoose.model('Registration');
  await Registration.deleteMany({ event: this._id });
  next();
});

module.exports = mongoose.model('Event', EventSchema);