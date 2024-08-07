
import Bus from '../model/busModel';
import { IBus } from '../interface/IBus';
import Route from '../model/routesModel';
import { Types } from 'mongoose';

class BusService {
    addBus = async (busData: IBus): Promise<IBus | any> => {
        const { routeId, scheduledDate } = busData;
        const existingBud = await Bus.findOne({ routeId: routeId, scheduledDate: scheduledDate });
        if (existingBud) {
            throw new Error("Bus is avalible for same route and same date&time");

        }
        const currentDate = new Date();
        const sDate = new Date(scheduledDate);
        if (sDate < currentDate) {
            throw new Error("Bus Can not bt scheduled in Past!");

        }

        const route = await Route.findById(routeId);
        if (!route) {
            throw new Error('Route not found');
        }
        const hasZeroDistance = route?.stations.find(station => station.distanceFromPrevious === 0);
        let newPreviousDistance = hasZeroDistance?.distanceFromPrevious;

        const stops = route.stations.map((station, index) => {

            const previousDistance = index === 0 ? 0 : route.stations[index].distanceFromPrevious;
            newPreviousDistance = newPreviousDistance! + previousDistance;
            let speed = 60;
            const travelTime = newPreviousDistance / speed;
            const arrivalTime = new Date(scheduledDate);
            arrivalTime.setMinutes(arrivalTime.getMinutes() + travelTime * 60);
            const departureTime = new Date(arrivalTime);
            departureTime.setMinutes(departureTime.getMinutes() + 10);
            return {
                stationName: station.stationName,
                arrivalTime: arrivalTime,
                departureTime: departureTime,
            };
        })
        const bus = new Bus({
            ...busData,
            stops: stops
        });
        

        return await bus.save();
        

    }



    updateBus = async (id: string, busData: IBus): Promise<IBus | null> => {
        const bus = await Bus.findById(id);
        if (!bus) {
            throw new Error("Bus Not Found !");
        }
        const { routeId, scheduledDate } = busData;

        const currentDate = new Date();
        const sDate = new Date(scheduledDate);
        if (sDate < currentDate) {
            throw new Error("Bus Can not bt scheduled in Past!");

        }
        const route = await Route.findById(routeId);
        if (!route) {
            throw new Error('Route not found');
        }
        const hasZeroDistance = route?.stations.find(station => station.distanceFromPrevious === 0);
        let newPreviousDistance = hasZeroDistance?.distanceFromPrevious;
        const stops = route.stations.map((station, index) => {

            const previousDistance = index === 0 ? 0 : route.stations[index].distanceFromPrevious;
            newPreviousDistance = newPreviousDistance! + previousDistance;
            let speed = 60;
            const travelTime = newPreviousDistance / speed;
            const arrivalTime = new Date(scheduledDate);
            arrivalTime.setMinutes(arrivalTime.getMinutes() + travelTime * 60);
            const departureTime = new Date(arrivalTime);
            departureTime.setMinutes(departureTime.getMinutes() + 10);
            return {
                stationName: station.stationName,
                arrivalTime: arrivalTime,
                departureTime: departureTime,
            };
        });

        bus.busNumber = busData.busNumber || bus.busNumber;
        bus.seatingCapacity = busData.seatingCapacity || bus.seatingCapacity;
        bus.scheduledDate = busData.scheduledDate || bus.scheduledDate;
        bus.amenities = busData.amenities || bus.amenities;
        bus.routeId = busData.routeId || bus.routeId;
        bus.stops = stops;

        await bus.save();
        return bus;

    }

    getAllBuses = async (): Promise<IBus[]> => {
        const result = [
            {
                $lookup: {
                    from: "routes",
                    localField: "routeId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: {
                    path: "$result"
                }
            },
            {
                $project: {
                    "result.name": 1,
                    scheduledDate: 1,
                    stops: 1,
                    busNumber: 1,
                    seatingCapacity: 1,
                    amenities: 1,
                    seats: 1
                }
            }
        ]
        const buses = await Bus.aggregate(result);
        return buses;
    }

    getBusById = async (id: string): Promise<IBus | null> => {
        const result = [
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "routes",
                    localField: "routeId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: {
                    path: "$result"
                }
            },
            {
                $project: {
                    "result.name": 1,
                    scheduledDate: 1,
                    stops: 1,
                    busNumber: 1,
                    seatingCapacity: 1,
                    amenities: 1,
                    seats: 1
                }
            }
        ]

        const bus: any = await Bus.aggregate(result);
        return bus;
    }

    getBusBySearch = async (from: string, to: string, scheduledDate: Date): Promise<any> => {
        const pipeline = [
            {
                $match: {
                    scheduledDate: {
                        $gte: new Date(scheduledDate),
                        $lt: new Date(new Date(scheduledDate).setDate(new Date(scheduledDate).getDate() + 1))
                    }
                }
            },
            {
                $addFields: {
                    fromStationIndex: {
                        $indexOfArray: ['$stops.stationName', from]
                    },
                    toStationIndex: {
                        $indexOfArray: ['$stops.stationName', to]
                    }
                }
            },
            {
                $match: {
                    fromStationIndex: { $gte: 0 },
                    toStationIndex: { $gte: 0 },
                    $expr: {
                        $lt: ['$fromStationIndex', '$toStationIndex']
                    }
                }
            },
            {
                $lookup: {
                    from: "routes",
                    localField: "routeId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: {
                    path: "$result"
                }
            },
            {
                $project: {
                    "result.name": 1,
                    scheduledDate: 1,
                    stops: 1,
                    busNumber: 1,
                    seatingCapacity: 1,
                    amenities: 1,
                    seats: 1
                }
            }
        ];

        const bus = await Bus.aggregate(pipeline);
        return bus;
    }

    deleteBus = async (id: string): Promise<void> => {
        await Bus.findByIdAndDelete(id);
    }


}


export default new BusService();
