import { Injectable } from '@nestjs/common';
import { LWWMap, CRDTMessage, CRDTMessageTypes, CRDTSyncMessage, MapState } from '@troublepainter/core';
import { DrawingData } from '@troublepainter/core';
import * as PImage from 'pureimage';
import { PassThrough } from 'stream';

@Injectable()
export class CanvasService {
  private crdtMap: Map<string, LWWMap> = new Map();

  createRoom(roomId: string) {
    this.crdtMap.set(roomId, new LWWMap(roomId));
  }
  removeRoom(roomID: string) {
    this.crdtMap.delete(roomID);
  }

  // 선 그리기
  private drawStroke = (ctx: PImage.Context, drawingData: DrawingData) => {
    const { points, style } = drawingData;
    if (points.length === 0) return;
    ctx.strokeStyle = style.color;
    ctx.fillStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.beginPath();
    if (points.length === 1) {
      const point = points[0];
      ctx.arc(point.x, point.y, style.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
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
  async getImagesByBase64(roomId: string): Promise<Record<string, string>> {
    const lwwMap = this.crdtMap.get(roomId);
    if (!lwwMap) return;
    const lwwMapState = lwwMap.state;

    const MAINCANVAS_RESOLUTION_WIDTH = 1000;
    const MAINCANVAS_RESOLUTION_HEIGHT = 625;

    const sharedCanvas = PImage.make(MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
    const sharedCtx = sharedCanvas.getContext('2d');
    sharedCtx.fillStyle = 'white';
    sharedCtx.fillRect(0, 0, MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
    const individualCanvasMap: Record<string, { canvas: PImage.Bitmap; ctx: PImage.Context }> = {};

    // 그림 그리기
    const activeStrokes = lwwMap.getActiveStrokes();
    for (const { stroke, id } of activeStrokes) {
      const playerId = lwwMapState[id].peerId;
      if (stroke.points.length > 2) return; // 채우기는 제외
      this.drawStroke(sharedCtx, stroke);
      if (!individualCanvasMap[playerId]) {
        const canvas = PImage.make(MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, MAINCANVAS_RESOLUTION_WIDTH, MAINCANVAS_RESOLUTION_HEIGHT);
        individualCanvasMap[playerId] = { canvas, ctx };
      }
      this.drawStroke(individualCanvasMap[playerId].ctx, stroke);
    }

    //그림을 base64 이미지로 변환
    const canvasList = [sharedCanvas, ...Object.values(individualCanvasMap).map(({ canvas }) => canvas)];
    const resultKeyList = ['shared', ...Object.keys(individualCanvasMap)];
    const resultValueList = await Promise.all(
      canvasList.map(async (canvas) => {
        const passThroughStream = new PassThrough();
        const pngData = [];
        passThroughStream.on('data', (chunk) => pngData.push(chunk));
        await PImage.encodeJPEGToStream(canvas, passThroughStream);
        const buf = Buffer.concat(pngData);
        return buf.toString('base64');
      }),
    );

    return resultKeyList.reduce((acc, key, idx) => {
      acc[key] = resultValueList[idx];
      return acc;
    }, {});
  }

  // 지워야하는 CRDT 메시지 반환
  getEraseLineMessage(
    roomId: string,
    boundaryList: { playerId: string; boundary: { x: number; y: number }[] }[],
  ): CRDTSyncMessage {
    const lwwMap = this.crdtMap.get(roomId);
    if (!lwwMap) return;
    const lwwMapState = lwwMap.state;

    // 점이 경계 안에 있는지 확인
    const isPointInBoundary = (point: { x: number; y: number }, boundary: { x: number; y: number }[]) => {
      const C = point;
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
