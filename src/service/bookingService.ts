import Booking from '../model/bookingModel';
import Bus from '../model/busModel';
import { IBooking } from '../interface/IBooking';
import { IRoute } from '../interface/IRoutes';
import Route from '../model/routesModel';

class BookingService {
    bookSeat = async (bookingData: IBooking): Promise<IBooking> => {
        const { userId, busId, seatNumber, passengerDetails, departureStation, arrivalStation, travelDate, paymentMethod } = bookingData;

        const bus = await Bus.findById(busId).populate('routeId');
        if (!bus) {
            throw new Error("Bus not found");
        }
        const busScheduleDate = new Date(bus.scheduledDate);
        const PassengertravelDate = new Date(travelDate);

        if (busScheduleDate.getTime() !== PassengertravelDate.getTime()) {
            throw new Error(`Bus is not avalibale on date ${travelDate}.`)
        }

        const existingBookings = await Booking.find({
            busId: busId,
            travelDate: travelDate
        });

        const routeId = bus.routeId;

        const route = await Route.findById(routeId);
        if (!route) {
            throw new Error("Route not found");
        }

        const departureIndex = route.stations.findIndex(station => station.stationName === departureStation);
        const arrivalIndex = route.stations.findIndex(station => station.stationName === arrivalStation);

        const conflictingBooking = existingBookings.some(booking => {
            return booking.seatNumber === seatNumber && this.chekSationsConflict(booking, departureIndex, arrivalIndex, route);
        });

        if (conflictingBooking) {
            throw new Error("Seat is already booked for this segment");
        }
        if (this.isSeatBookingRestricted(seatNumber, passengerDetails?.gender as string, existingBookings)) {
            throw new Error("Booking restriction: Cannot book a seat next to a single lady");
        }
        const fare = this.calculateFare(route, departureStation, arrivalStation);
        const additionalCharges = paymentMethod === 'cash' ? 0 : 26;
        const booking = new Booking({
            userId,
            busId,
            routeId,
            seatNumber,
            passengerDetails,
            departureStation,
            arrivalStation,
            travelDate,
            status: 'confirmed',
            paymentMethod,
            paymentDetails: {
                amountPaid: fare + additionalCharges,
                additionalCharges
            },

        });

        await Bus.updateOne(
            { _id: busId, 'seats.seatNumber': seatNumber },
            { $set: { 'seats.$.isBooked': true } }
        );
        const totalBookings = existingBookings.length + 1;

        let bookingPercentage = (totalBookings / bus.seatingCapacity) * 100;

        if (bookingPercentage >= 70) {
            console.log(`Notification: Bus ${busId} is ${bookingPercentage}% booked.`);
        }

        return await booking.save();
    }


    chekSationsConflict = (booking: IBooking, newDepartureIndex: number, newArrivalIndex: number, route: IRoute): boolean => {
        const { departureStation, arrivalStation } = booking;
        const departureIndex = route.stations.findIndex(station => station.stationName === departureStation);
        const arrivalIndex = route.stations.findIndex(station => station.stationName === arrivalStation);

        if (
            (newDepartureIndex >= departureIndex && newDepartureIndex < arrivalIndex) ||
            (newArrivalIndex > departureIndex && newArrivalIndex <= arrivalIndex) ||
            (newDepartureIndex < departureIndex && newArrivalIndex > arrivalIndex)
        ) {
            return true;
        }
        return false;
    }



    calculateFare = (route: IRoute, departureStation: string, arrivalStation: string): number => {
        if (!route) {
            throw new Error("Route not found");
        }
        const departureIndex = route.stations.findIndex(station => station.stationName === departureStation);
        const arrivalIndex = route.stations.findIndex(station => station.stationName === arrivalStation);

        if (departureIndex === -1 || arrivalIndex === -1 || departureIndex >= arrivalIndex) {
            throw new Error("Invalid station names or order");
        }

        const totalDistance = route.stations.slice(departureIndex, arrivalIndex + 1)
            .reduce((total, station, index, arr) => {
                if (index > 0) {
                    total += station.distanceFromPrevious;
                }
                return total;
            }, 0);

        const fareRate = 2;
        const taxRate = 0.05;

        const fare = totalDistance * fareRate;
        return fare + (fare * taxRate);
    }

    isSeatBookingRestricted = (seatNumber: number, gender: string, existingBookings: IBooking[]): boolean => {
        const adjacentSeats = [seatNumber - 1, seatNumber + 1];

        const singleLadies = existingBookings.filter(booking => adjacentSeats.includes(booking.seatNumber) && booking.passengerDetails?.gender === 'female');

        if (gender === 'male' && singleLadies.length > 0) {
            return true;
        }

        return false;
    }


}

export default new BookingService();
