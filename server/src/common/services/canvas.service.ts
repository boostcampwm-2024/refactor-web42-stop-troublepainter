import { Worker } from 'worker_threads';
import { cpus } from 'os';
import { Injectable } from '@nestjs/common';
import { CRDTMessage, CRDTSyncMessage } from '@troublepainter/core';

const NUM_WORKERS = cpus().length;
const WORKER_PATH = require.resolve('./canvas.worker.js');

@Injectable()
export class CanvasService {
  private workers: Worker[];
  private responseMap: Map<
    string,
    { data: Promise<any>; resolve: (value: unknown) => void; reject: (value: unknown) => void }
  >;

  constructor() {
    this.workers = Array.from({ length: NUM_WORKERS }, () => new Worker(WORKER_PATH));
    this.responseMap = new Map();
    this.workers.forEach((worker) => {
      worker.on('message', ({ requestId, response }) => {
        if (this.responseMap.has(requestId)) {
          this.responseMap.get(requestId).resolve(response);
          this.responseMap.delete(requestId);
        }
      });
    });
  }

  // roomId에 해당하는 워커 반환
  private getWorker(roomId: string) {
    const index = roomId.charCodeAt(0) % NUM_WORKERS;
    return this.workers[index];
  }

  // 요청만 전달
  request(roomId: string, action: string, payload: any) {
    const worker = this.getWorker(roomId);
    worker.postMessage({ action, roomId, payload });
  }

  // 요청하고 응답을 기다림
  async requestAndAwait(roomId: string, action: string, payload: any) {
    const worker = this.getWorker(roomId);
    const requestId = action + Math.random();
    let resolve: (value: unknown) => void;
    let reject: (value: unknown) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.responseMap.set(requestId, { data: promise, reject, resolve });
    worker.postMessage({ action, roomId, payload, requestId });
    return promise;
  }

  createRoom(roomId: string) {
    this.request(roomId, 'createRoom', undefined);
  }

  removeRoom(roomId: string) {
    this.request(roomId, 'removeRoom', undefined);
  }

  // 드로잉 데이터를 적용
  applyDrawing(roomId: string, crdtDrawingData: CRDTMessage) {
    this.request(roomId, 'applyDrawing', crdtDrawingData);
  }

  // 이미지 스프라이트를 생성
  async generateImageBuffer(roomId: string) {
    const arrayBuffer = (await this.requestAndAwait(roomId, 'generateImageBuffer', undefined)) as ArrayBuffer | null;
    if (arrayBuffer) return Buffer.from(arrayBuffer);
    return null;
  }

  // 바운더리에 해당하는 플레이어 아이디를 반환. 없으면 null
  async getPlayerIdByBoundary(roomId: string, boundary: { x: number; y: number }[]) {
    return this.requestAndAwait(roomId, 'getPlayerIdByBoundary', boundary) as Promise<string | null>;
  }

  // 바운더리 내에 선을 지우는 CRDT 메시지 반환
  async getEraseLineMessage(roomId: string, boundaryList: { x: number; y: number }[][]) {
    return this.requestAndAwait(roomId, 'getEraseLineMessage', boundaryList) as Promise<CRDTSyncMessage | null>;
  }
}
