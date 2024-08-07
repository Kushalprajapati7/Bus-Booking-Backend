import mongoose, { Schema, Document } from 'mongoose';
import { IRoute } from '../interface/IRoutes';

const stationSchema = new Schema({
  stationName: { type: String, required: true },
  distanceFromPrevious: { type: Number, required: true },
  uniqueIdentifier: { type: String, unique: true, required: true }
});

const routeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  stations: [stationSchema]
}, { timestamps: true });

const Route = mongoose.model<IRoute>('Route', routeSchema);
export default Route;
