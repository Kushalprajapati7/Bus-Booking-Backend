import { Request, Response, NextFunction } from 'express';
import BookingService from '../service/bookingService';
import { IBooking } from '../interface/IBooking';

class BookingController {
    bookSeat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookingData:IBooking = req.body;
            const booking = await BookingService.bookSeat(bookingData);
            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    }
}

export default new BookingController();
