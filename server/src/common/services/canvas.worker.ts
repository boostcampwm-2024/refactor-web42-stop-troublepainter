import { parentPort } from 'worker_threads';
import { CRDTMessage, CRDTMessageTypes, CRDTSyncMessage, DrawingData, LWWMap, MapState } from '@troublepainter/core';
import { CanvasRenderingContext2D, createCanvas } from 'canvas';

class CanvasServiceWorker {
  private crdtMap: Map<string, LWWMap> = new Map();
  private offsetMap: Map<string, Record<string, { x: number; y: number }>> = new Map();
  private canvasScale = 0.5 as const;
  private canvasSize = { w: 1000, h: 625 } as const;

  createRoom(roomId: string) {
    this.crdtMap.set(roomId, new LWWMap(roomId));
    this.offsetMap.set(roomId, {});
  }
  removeRoom(roomID: string) {
    this.crdtMap.delete(roomID);
    this.offsetMap.delete(roomID);
  }

  applyScale(position: { x: number; y: number }) {
    return { x: Math.ceil(position.x * this.canvasScale), y: Math.ceil(position.y * this.canvasScale) };
  }

  // 선 그리기
  private drawStroke = (ctx: CanvasRenderingContext2D, drawingData: DrawingData) => {
    const { points, style } = drawingData;
    if (points.length === 0) return;
    ctx.strokeStyle = style.color;
    ctx.fillStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const scaledPoint = this.applyScale(points[0]);
    if (points.length === 1) {
      ctx.arc(scaledPoint.x, scaledPoint.y, style.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.moveTo(scaledPoint.x, scaledPoint.y);
      points.slice(1).forEach((point) => {
        point = this.applyScale(point);
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  };

  // 드로잉 데이터를 적용
  applyDrawing(roomId: string, crdtDrawingData: CRDTMessage) {
    const lwwMap = this.crdtMap.get(roomId);
    const offset = this.offsetMap.get(roomId);
    if (!lwwMap && !offset) return;

    if (crdtDrawingData.type === CRDTMessageTypes.UPDATE) {
      const { key, register } = crdtDrawingData.state;
      lwwMap.mergeRegister(key, register);
      // 오프셋 등록
      if (!(register.peerId in offset)) {
        const registeredPlayerCount = Object.keys(offset).length;
        const offsetX = ((registeredPlayerCount + 1) % 2) * this.canvasSize.w * this.canvasScale;
        const offsetY = Math.floor((registeredPlayerCount + 1) / 2) * this.canvasSize.h * this.canvasScale;
        offset[register.peerId] = { x: offsetX, y: offsetY };
      }
    }
  }

  // 이미지 스프라이트를 생성
  async generateImageBuffer(roomId: string): Promise<Buffer> | null {
    const lwwMap = this.crdtMap.get(roomId);
    const offset = this.offsetMap.get(roomId);
    if (!lwwMap && !offset) return;
    const lwwMapState = lwwMap.state;

    const canvas = createCanvas(this.canvasSize.w + 100, this.canvasSize.h + 100);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 공동 그리기
    const activeStrokes = lwwMap.getActiveStrokes();
    for (const { stroke } of activeStrokes) {
      if (stroke.points.length > 2) continue;
      this.drawStroke(ctx, stroke);
    }
    // 개별 그리기
    // ctx.setTransform를 최소화하기 위해 공동 그리기와 분리함
    let prevPlayerId = null;
    for (const { stroke, id } of activeStrokes) {
      const playerId = lwwMapState[id].peerId;
      if (stroke.points.length > 2) continue; // 채우기는 지나가기
      if (playerId in offset && prevPlayerId !== playerId)
        ctx.setTransform(1, 0, 0, 1, offset[playerId].x, offset[playerId].y);
      prevPlayerId = playerId;
      this.drawStroke(ctx, stroke);
    }

    // JPEG buffer로 변환
    return canvas.toBuffer('image/jpeg');
  }

  // 바운더리에 해당하는 플레이어 아이디를 반환. 없으면 null
  getPlayerIdByBoundary(roomId: string, boundary: { x: number; y: number }[]): string | null {
    if (!boundary && boundary.length < 1) return null;
    const lwwMap = this.crdtMap.get(roomId);
    const offset = this.offsetMap.get(roomId);
    if (!lwwMap && !offset) return null;
    const sumPoint = boundary.reduce((acc, e) => ({ x: acc.x + e.x, y: acc.y + e.y }), { x: 0, y: 0 });
    const mx = sumPoint.x / boundary.length;
    const my = sumPoint.y / boundary.length;
    const w = this.canvasSize.w * this.canvasScale;
    const h = this.canvasSize.h * this.canvasScale;
    const offsetList = Object.entries(offset);
    for (const [plyaerId, { x, y }] of offsetList) {
      if (x < mx && mx <= x + w && y < my && my <= y + h) return plyaerId;
    }
    return null;
  }

  // 바운더리 내에 선을 지우는 CRDT 메시지 반환
  getEraseLineMessage(roomId: string, boundaryList: { x: number; y: number }[][]): CRDTSyncMessage | null {
    const lwwMap = this.crdtMap.get(roomId);
    const offset = this.offsetMap.get(roomId);
    if (!lwwMap && !offset) return;
    const lwwMapState = lwwMap.state;

    // 점이 경계 안에 있는지 확인
    const isPointInBoundary = (point: { x: number; y: number }, boundary: { x: number; y: number }[]) => {
      const C = this.applyScale(point);
      const crossList = boundary.map((A, index) => {
        const B = boundary[(index + 1) % boundary.length];
        return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
      });
      return crossList.every((cross) => cross >= 0) || crossList.every((cross) => cross <= 0);
    };

    // 플레이어아이디: 바운더리배열
    const boundaryMap = boundaryList.reduce(
      (acc: { playerId: string; boundary: { x: number; y: number }[] }[], boundary) => {
        const playerId = this.getPlayerIdByBoundary(roomId, boundary) || 'shared';
        const offsetPos = offset[playerId];
        if (offsetPos) boundary = boundary.map((e) => ({ x: e.x - offsetPos.x, y: e.y - offsetPos.y }));
        acc.push({ playerId, boundary });
        return acc;
      },
      [],
    );

    // 개인 캔버스의 바운더리와 겹치는 공용 캔버스 바운더리 제거
    const sharedBoundaryList = boundaryMap.filter(({ playerId }) => playerId === 'shared');
    const individualBoundaryList = boundaryMap.filter(({ playerId }) => playerId !== 'shared');
    const filteredSharedBoundaryList = sharedBoundaryList.filter(({ boundary: sharedBoundary }) =>
      individualBoundaryList.every(
        ({ boundary: individualBoundary }) =>
          sharedBoundary.every((point) => !isPointInBoundary(point, individualBoundary)) &&
          individualBoundary.every((point) => !isPointInBoundary(point, sharedBoundary)),
      ),
    );

    // 제거할 선 필터링
    const newBoundaryList = [...individualBoundaryList, ...filteredSharedBoundaryList];
    const resultMapState = lwwMap
      .getActiveStrokes()
      .filter(({ stroke, id }) =>
        newBoundaryList.some(({ boundary, playerId }) => {
          if (playerId !== lwwMapState[id].peerId && playerId !== 'shared') return false;
          // 선의 점이 모두 경계 안에 있는지 확인
          return stroke.points.every((strokePoint) => isPointInBoundary(strokePoint, boundary));
        }),
      )
      .reduce((acc: MapState, { id, stroke }) => {
        acc[id] = { peerId: lwwMapState[id].peerId, timestamp: stroke.timestamp, value: stroke, isDeactivated: true };
        return acc;
      }, {});

    return { type: CRDTMessageTypes.SYNC, state: resultMapState };
  }
}

const canvas = new CanvasServiceWorker();
parentPort.on('message', async ({ action, requestId, roomId, payload }) => {
  let response: any;
  let transferable: any;
  try {
    switch (action) {
      case 'createRoom':
        canvas.createRoom(roomId);
        return;
      case 'removeRoom':
        canvas.removeRoom(roomId);
        return;
      case 'applyDrawing':
        canvas.applyDrawing(roomId, payload);
        return;
      case 'generateImageBuffer':
        const buffer = await canvas.generateImageBuffer(roomId);
        const arrayBuffer = buffer.buffer;
        response = arrayBuffer;
        transferable = [arrayBuffer];
        break;
      case 'getPlayerIdByBoundary':
        response = canvas.getPlayerIdByBoundary(roomId, payload);
        break;
      case 'getEraseLineMessage':
        response = canvas.getEraseLineMessage(roomId, payload);
        break;
    }
    if (requestId) parentPort.postMessage({ requestId, response }, transferable);
  } catch (e) {
    console.error(e);
  }
});
