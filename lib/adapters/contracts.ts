export type Coordinates={latitude:number;longitude:number};

export type ProviderReference={
  id:string;
  label:string;
  documentationUrl:string;
};

export type EnvironmentalObservation={
  temperature:number;
  precipitation:number;
  windSpeed:number;
  waveHeight:number;
  waterTemperature:number;
  weatherObservedAt:string;
  marineObservedAt:string;
  providers:ProviderReference[];
};

export interface ConditionsAdapter{
  readonly id:string;
  getCurrent(coordinates:Coordinates):Promise<EnvironmentalObservation>;
}

export type ExternalPlace={
  providerId:string;
  title:string;
  address:string;
  latitude:number;
  longitude:number;
  contentTypeId:string;
  imageUrl:string|null;
  modifiedTime:string|null;
};

export interface PlaceSearchAdapter{
  readonly id:string;
  searchNearby(input:Coordinates&{radiusMeters:number;limit:number}):Promise<ExternalPlace[]>;
}
