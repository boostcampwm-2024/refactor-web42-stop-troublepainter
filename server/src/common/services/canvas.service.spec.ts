import { Test, TestingModule } from '@nestjs/testing';
import { CanvasService } from './canvas.service';
import { CRDTMessage, CRDTMessageTypes } from '@troublepainter/core';

const PLAYER_IDS = ['1', '2', '3'];
const CRDT_DATAS = Array.from({ length: 10 }, (_, index) => {
  return {
    playerId: PLAYER_IDS[index % 3],
    drawingData: {
      type: CRDTMessageTypes.UPDATE,
      state: {
        key: `${PLAYER_IDS[index % 3]}-${index * 10}-${index}`,
        register: {
          peerId: PLAYER_IDS[index % 3],
          timestamp: index * 10,
          value: {
            points: [
              {
                x: index * 100,
                y: index * 60,
              },
              {
                x: (index + 1) * 100,
                y: (index + 1) * 60,
              },
            ],
            style: {
              color: '#ff0000',
              width: 4,
            },
            timestamp: index * 10,
          },
          isDeactivated: false,
        },
      },
    },
  };
}) as { playerId: string; drawingData: CRDTMessage }[];

describe('CanvasService', () => {
  let service: CanvasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanvasService],
    }).compile();

    service = module.get<CanvasService>(CanvasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create a new room', () => {
      service.createRoom('room1');
      expect(service['crdtMap'].has('room1')).toBe(true);
    });
  });

  describe('removeRoom', () => {
    it('should remove the existing room', () => {
      service.createRoom('room1');
      service.removeRoom('room1');
      expect(service['crdtMap'].has('room1')).toBe(false);
    });
  });

  describe('applyDrawing', () => {
    it('should update CRDT state when a drawing is applied', () => {
      service.createRoom('room1');

      for (const crdtDate of CRDT_DATAS) {
        service.applyDrawing('room1', crdtDate.drawingData);
      }
      expect(service['crdtMap'].get('room1').getActiveStrokes().length).toBe(10);
    });
  });

  describe('getImagesByBase64', () => {
    it('should return base64 encoded images', async () => {
      service.createRoom('room1');

      for (const crdtDate of CRDT_DATAS) {
        service.applyDrawing('room1', crdtDate.drawingData);
      }

      const result = await service.getImagesByBase64('room1');
      // 개인 캔버스
      PLAYER_IDS.forEach((playerId) => {
        expect(typeof result[playerId]).toBe('string');
      });
      // 공용 캔버스
      expect(typeof result['shared']).toBe('string');
    }, 20000);
  });
});
