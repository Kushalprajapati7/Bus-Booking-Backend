import mongoose, { Schema, Document } from 'mongoose';
import { IBus } from '../interface/IBus';
import { ISeat } from '../interface/ISeat';

const seatSchema = new Schema<ISeat>({
  seatNumber: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
}, { _id: false });

const busSchema = new Schema({
  busNumber: { type: String, required: true, unique: true },
  seatingCapacity: { type: Number, required: true },
  scheduledDate: { type: Date, required: true },
  amenities: [{ type: String }],
  routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  stops: [{
    _id: false,
    stationName: { type: String, required: true },
    arrivalTime: { type: Date, required: true },
    departureTime: { type: Date, required: true },
  }],
  seats: [seatSchema],
}, { timestamps: true });


busSchema.pre('save', function (next) {
  if (this.isNew) {
    this.seats = Array.from({ length: this.seatingCapacity }, (_, index) => ({
      seatNumber: index + 1,
      isBooked: false
    })) as any;
  }
  next();
});



const Bus = mongoose.model<IBus & Document>('Bus', busSchema);
export default Bus;
