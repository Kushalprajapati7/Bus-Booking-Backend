import { Request, Response, NextFunction } from 'express';
import routesService from '../service/routesService';

class RouteController {
  async addRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newRoute = await routesService.addRoute(req.body);
      res.status(201).json(newRoute);
    } catch (error) {
      next(error);
    }
  }

  async getAllRoutes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allRoutes = await routesService.getAllRoutes();
      res.status(200).json(allRoutes);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routeId = req.params.id;
      await routesService.deleteRoute(routeId);
      res.status(200).json({ message: "Route Deleted" });
    } catch (error) {
      next(error);
    }
  }

  async getRouteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routeId = req.params.id;
      const route = await routesService.getRouteById(routeId);
      if (!route) {
        res.status(404).json({ error: "Route Not Found!" });
        return;
      }
      res.status(200).json(route);
    } catch (error) {
      next(error);
    }
  }

  async updateRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routeId = req.params.id;
      const routeData = req.body;
      const updatedRoute = await routesService.updateRoute(routeId, routeData);
      res.json(updatedRoute);
    } catch (error) {
      next(error);
    }
  }
}

export default new RouteController();
