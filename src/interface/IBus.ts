
export interface IBus {
    busNumber: string;
    seatingCapacity: number;
    scheduledDate:Date;
    amenities: string[];
    routeId: string;
    stops?: Array<{
        stationName: string;
        arrivalTime: Date;
        departureTime: Date;
    }>,
    seats?: Array<{
        seatNumber: Number
        isBooked: Boolean
    }>;
}
