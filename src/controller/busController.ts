import { NextFunction, Request, Response } from 'express';
import busService from '../service/busService';

class BusController {
  addBus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const newBus = await busService.addBus(req.body);
      res.status(201).json(newBus);
    } catch (error) {
      next(error);
    }
  }

  getAllBuses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buses = await busService.getAllBuses();
      res.status(200).json(buses);
    } catch (error) {
      next(error);
    }
  }

  getBusById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const busId = req.params.id;
      const bus = await busService.getBusById(busId);
      if (!bus) {
        res.status(404).json({ error: 'Bus Not Found' });
        return;
      }
      res.status(200).json(bus);
    } catch (error) {
      next(error);
    }
  }

  updateBus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const busId = req.params.id;
      const updatedBus = await busService.updateBus(busId, req.body);
      if (!updatedBus) {
        res.status(404).json({ error: 'Bus Not Found' });
        return;
      }
      res.status(200).json(updatedBus);
    } catch (error) {
      next(error);
    }
  }

  deleteBus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const busId = req.params.id;
      await busService.deleteBus(busId);
      res.status(200).json({ message: 'Bus Deleted' });
    } catch (error) {
      next(error);
    }
  }

  getBusBySearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to, scheduledDate } = req.query;
      const fromStation = (from as string || "").trim();
      const toStation = (to as string || "").trim();
      const sDate = (new Date(scheduledDate as string)).toISOString().split('T')[0];
      const bus = await busService.getBusBySearch(fromStation.trim(), toStation.trim(), sDate as any);
      res.status(200).json(bus);
    } catch (error) {
      next(error);
    }
  }
}

export default new BusController();
