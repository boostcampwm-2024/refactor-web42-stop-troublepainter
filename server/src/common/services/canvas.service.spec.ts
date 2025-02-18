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
                y: index * 62.5,
              },
              {
                x: (index + 1) * 100,
                y: (index + 1) * 62.5,
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
      CRDT_DATAS.forEach((crdtData) => service.applyDrawing('room1', crdtData.drawingData));

      expect(service['crdtMap'].get('room1').getActiveStrokes().length).toBe(10);
    });
  });

  describe('generateBase64ImageSprite', () => {
    it('should return base64 encoded images', async () => {
      service.createRoom('room1');
      CRDT_DATAS.forEach((crdtData) => service.applyDrawing('room1', crdtData.drawingData));

      const result = await service.generateBase64ImageSprite('room1');
      expect(typeof result).toBe('string');
    }, 20000);
  });

  describe('getEraseLineMessage', () => {
    it('erase player1 data', () => {
      service.createRoom('room1');
      CRDT_DATAS.forEach((crdtData) => service.applyDrawing('room1', crdtData.drawingData));

      const crdtMessage = service.getEraseLineMessage('room1', [
        [
          { x: 500, y: 0 },
          { x: 500, y: 313 },
          { x: 1000, y: 313 },
          { x: 1000, y: 0 },
        ],
      ]);
      expect(Object.keys(crdtMessage.state).length).toBe(4);
    });

    it('remove all strokes by shared boundary', () => {
      service.createRoom('room1');
      CRDT_DATAS.forEach((crdtData) => service.applyDrawing('room1', crdtData.drawingData));

      const crdtMessage = service.getEraseLineMessage(
        'room1',
        PLAYER_IDS.map(() => [
          { x: 0, y: 0 },
          { x: 500, y: 0 },
          { x: 500, y: 313 },
          { x: 0, y: 313 },
        ]),
      );
      expect(Object.keys(crdtMessage.state).length).toBe(10);
    });

    it('remove some strokes by shared boundary', () => {
      service.createRoom('room1');
      CRDT_DATAS.forEach((crdtData) => service.applyDrawing('room1', crdtData.drawingData));

      const crdtMessage = service.getEraseLineMessage(
        'room1',
        PLAYER_IDS.map(() => [
          { x: 10, y: 10 },
          { x: 10, y: 300 },
          { x: 490, y: 300 },
          { x: 490, y: 10 },
        ]),
      );
      expect(Object.keys(crdtMessage.state).length).toBe(8);
    });

    it('remove shared boundary', () => {
      service.createRoom('room1');
      CRDT_DATAS.forEach((crdtData) => service.applyDrawing('room1', crdtData.drawingData));

      const crdtMessage = service.getEraseLineMessage('room1', [
        [
          { x: 0, y: 0 },
          { x: 500, y: 0 },
          { x: 500, y: 313 },
          { x: 0, y: 313 },
        ],
        [
          { x: 500, y: 0 },
          { x: 500, y: 313 },
          { x: 1000, y: 313 },
          { x: 1000, y: 0 },
        ],
      ]);
      expect(Object.keys(crdtMessage.state).length).toBe(4);
    });
  });
});
