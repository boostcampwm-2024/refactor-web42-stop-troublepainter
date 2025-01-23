interface SharedWorkerGlobalScope {
  onconnect: (this: SharedWorkerGlobalScope, ev: MessageEvent) => void;
  close: () => void;
  postMessage: (message: any) => void;
  location: Location;
}

declare var self: SharedWorkerGlobalScope;

declare module '*?worker' {
  const workerConstructor: {
    new (): SharedWorker;
  };
  export default workerConstructor;
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): SharedWorker;
  };
  export default workerConstructor;
}

export {};
