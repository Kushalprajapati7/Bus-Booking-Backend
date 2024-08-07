import { IRoute } from '../interface/IRoutes';
import Route from '../model/routesModel';

class RouteService {
  async addRoute(routeData: IRoute): Promise<IRoute> {
    const route = new Route(routeData);
    return await route.save();
  }

  async getAllRoutes(): Promise<IRoute[]> {
    return await Route.find();
  }

  async deleteRoute(id: string): Promise<void> {
    await Route.findByIdAndDelete(id);
  }

  async getRouteById(id: string): Promise<IRoute | null> {
    return await Route.findById(id);
  }

  async updateRoute(id: string, routeData: IRoute): Promise<IRoute | null> {
    const route = await Route.findById(id);
    if (!route) {
      throw new Error("Route Not Found");
    }
    return await Route.findByIdAndUpdate(id, routeData, { new: true });
  }
}

export default new RouteService();
