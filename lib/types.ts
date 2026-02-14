export interface DistrictInfo {
  name: string;
  zips: string[];
}

export interface ChamberData {
  districts: Record<string, DistrictInfo>;
}

export interface StateData {
  name: string;
  abbreviation: string;
  chambers: {
    upper?: ChamberData;
    lower?: ChamberData;
  };
}

export interface DistrictData {
  states: Record<string, StateData>;
  metadata: {
    generatedAt: string;
    source: string;
    zcta_vintage: string;
    legislative_session: string;
  };
}

export type StateUpdates = Record<string, string>;
