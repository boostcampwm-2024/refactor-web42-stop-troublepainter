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

export type CRDTSyncMessage = {
  type: 'sync';
  state: MapState;
};

export type CRDTUpdateMessage = {
  type: 'update';
  state: {
    key: string;
    register: RegisterState<DrawingData | null>;
  };
};

export type CRDTMessage = CRDTSyncMessage | CRDTUpdateMessage;
