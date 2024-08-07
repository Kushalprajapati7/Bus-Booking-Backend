export interface IStation {
    stationName: string;
    distanceFromPrevious: number;
    uniqueIdentifier: string;
  }
  
  export interface IRoute {
    name: string;
    stations: IStation[];
  }
  