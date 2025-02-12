import { Injectable } from '@nestjs/common';
import { LWWMap, CRDTMessage, CRDTMessageTypes, CRDTSyncMessage, MapState } from '@troublepainter/core';
import { DrawingData } from '@troublepainter/core';
import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';

@Injectable()
export class CanvasService {
  private crdtMap: Map<string, LWWMap> = new Map();
  private canvasScale = 0.5;

  createRoom(roomId: string) {
    this.crdtMap.set(roomId, new LWWMap(roomId));
  }
  removeRoom(roomID: string) {
    this.crdtMap.delete(roomID);
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
    if (!lwwMap) return;

    if (crdtDrawingData.type === CRDTMessageTypes.UPDATE) {
      const { key, register } = crdtDrawingData.state;
      lwwMap.mergeRegister(key, register);
    }
  }

  // 캔버스 이미지를 base64로 변환
  // shared: 공용 캔버스 / 그외: 각 플레이어의 개인 캔버스
  async getImagesByBase64(roomId: string): Promise<Record<string, string>> {
    const lwwMap = this.crdtMap.get(roomId);
    if (!lwwMap) return;
    const lwwMapState = lwwMap.state;

    const MAINCANVAS_RESOLUTION_WIDTH = Math.ceil(1000 * this.canvasScale);
    const MAINCANVAS_RESOLUTION_HEIGHT = Math.ceil(625 * this.canvasScale);

    const sharedCanvas = createCanvas(MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
    // const ctxStart = performance.now();
    const sharedCtx = sharedCanvas.getContext('2d');
    // console.log('ctx time:', performance.now() - ctxStart);
    sharedCtx.fillStyle = 'white';
    sharedCtx.fillRect(0, 0, MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
    const individualCanvasMap: Record<string, { canvas: Canvas; ctx: CanvasRenderingContext2D }> = {};

    // 그림 그리기
    // const drawStart = performance.now();
    const activeStrokes = lwwMap.getActiveStrokes();
    for (const { stroke, id } of activeStrokes) {
      const playerId = lwwMapState[id].peerId;
      if (stroke.points.length > 2) return; // 채우기는 제외
      this.drawStroke(sharedCtx, stroke);
      if (!individualCanvasMap[playerId]) {
        const canvas = createCanvas(MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
        individualCanvasMap[playerId] = { canvas, ctx };
      }
      this.drawStroke(individualCanvasMap[playerId].ctx, stroke);
    }
    // console.log('draw time:', performance.now() - drawStart);

    //그림을 base64 이미지로 변환
    // const base64Start = performance.now();
    const canvasList = [sharedCanvas, ...Object.values(individualCanvasMap).map(({ canvas }) => canvas)];
    const resultKeyList = ['shared', ...Object.keys(individualCanvasMap)];
    const resultValueList = await Promise.all(
      canvasList.map(async (canvas) => {
        const pngData = [];
        const stream = canvas.createJPEGStream();
        stream.on('data', (chunk) => pngData.push(chunk));
        await new Promise((resolve) => stream.on('end', resolve));
        const buf = Buffer.concat(pngData);
        return buf.toString('base64');
      }),
    );
    // console.log('base64 time:', performance.now() - base64Start);

    return resultKeyList.reduce((acc, key, idx) => {
      acc[key] = resultValueList[idx];
      return acc;
    }, {});
  }

  // 지워야하는 CRDT 메시지 반환
  // 만약 공용 캔버스의 바운더리라면 playerId를 'shared'로 설정
  getEraseLineMessage(
    roomId: string,
    boundaryList: { playerId: string; boundary: { x: number; y: number }[] }[],
  ): CRDTSyncMessage {
    const lwwMap = this.crdtMap.get(roomId);
    if (!lwwMap) return;
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

    // 개인 캔버스의 바운더리와 겹치는 공용 캔버스 바운더리 제거
    const sharedBoundaryList = boundaryList.filter(({ playerId }) => playerId === 'shared');
    const individualBoundaryList = boundaryList.filter(({ playerId }) => playerId !== 'shared');
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
      .reduce((acc, { id, stroke }) => {
        acc[id] = { peerId: lwwMapState[id].peerId, timestamp: stroke.timestamp, value: stroke, isDeactivated: true };
        return acc;
      }, {} as MapState);

    return { type: CRDTMessageTypes.SYNC, state: resultMapState };
  }
}
