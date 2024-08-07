import { Types } from "mongoose";

export interface ISeat {
    _id?:Types.ObjectId;
    seatNumber: number;
    isBooked: boolean;
  }