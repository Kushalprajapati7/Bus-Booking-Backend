import { Document } from 'mongoose';

export interface IBooking extends Document {
    userId: string;
    busId: string;
    routeId: string;
    seatNumber: number;
    passengerDetails?: {
        name: String;
        email: String;
        phone: Number;
        age: Number;
        gender: String;
    }
    departureStation: string;
    arrivalStation: string;
    bookingDate: Date;
    travelDate: Date;
    status: string;
    paymentMethod: string;
    paymentDetails?: {
        amountPaid: number;
        additionalCharges?: number;
    };
}
