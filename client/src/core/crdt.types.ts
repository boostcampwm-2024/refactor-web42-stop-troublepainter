export type Point = {
  x: number;
  y: number;
};

export type StrokeStyle = {
  color: string;
  width: number;
};

export type Stroke = {
  points: Point[];
  style: StrokeStyle;
};

export type RegisterState<T> = [peerId: string, timestamp: number, value: T];

export type MapState = {
  [key: string]: RegisterState<Stroke | null>;
};

export type CRDTMessage = {
  type: 'sync' | 'update';
  state: MapState | { key: string; register: RegisterState<Stroke | null> };
};
