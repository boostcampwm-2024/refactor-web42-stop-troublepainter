export interface Point {
  x: number;
  y: number;
}

export interface StrokeStyle {
  color: string;
  width: number;
}

export interface DrawingData {
  points: Point[];
  style: StrokeStyle;
}

export type RegisterState<T> = [peerId: string, timestamp: number, value: T];

export type MapState = {
  [key: string]: RegisterState<DrawingData | null>;
};

export enum CRDTMessageTypes {
  SYNC = 'sync',
  UPDATE = 'update',
}

export type CRDTSyncMessage = {
  type: CRDTMessageTypes.SYNC;
  state: MapState;
};

export type CRDTUpdateMessage = {
  type: CRDTMessageTypes.UPDATE;
  state: {
    key: string;
    register: RegisterState<DrawingData | null>;
  };
};

export type CRDTMessage = CRDTSyncMessage | CRDTUpdateMessage;
