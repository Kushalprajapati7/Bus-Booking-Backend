import mongoose, { Schema, Document } from 'mongoose';
import { IBooking } from '../interface/IBooking';

const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    seatNumber: { type: Number, required: true },
    passengerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true, length:10 },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true},
        age: { type: Number, required: true },
    },
    departureStation: { type: String, required: true },
    arrivalStation: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now },
    travelDate: { type: Date, required: true },
    status: { type: String, enum: ['confirmed', 'canceled'], default: 'confirmed' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'UPI'], required: true },
    paymentDetails: {
        amountPaid: { type: Number, required: true },
        additionalCharges: { type: Number }
    }
}, { timestamps: true });

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
