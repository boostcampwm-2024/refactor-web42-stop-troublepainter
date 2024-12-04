import { DrawingData, MapState, RegisterState } from '@/types/crdt.types';
import { LWWMap } from '@/crdt/LWWMap';

describe('LWWMap', () => {
  const createTestStroke = (color: string = '#000000', width: number = 2): DrawingData => ({
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 4 },
      { x: 6, y: 6 },
      { x: 8, y: 8 },
      { x: 10, y: 10 },
    ],
    style: { color, width },
    timestamp: Date.now(),
  });

  let map: LWWMap;

  beforeEach(() => {
    map = new LWWMap('peer1');
  });

  describe('initialization', () => {
    it('should initialize empty map', () => {
      expect(map.strokes).toHaveLength(0);
      expect(map.state).toEqual({});
    });

    it('should initialize with given state', () => {
      const stroke = createTestStroke();
      const timestamp = Date.now();
      const initialState: MapState = {
        stroke1: {
          peerId: 'peer1',
          timestamp,
          value: stroke,
          isDeactivated: false,
        },
      };

      const newMap = new LWWMap('peer1', initialState);

      expect(newMap.strokes).toHaveLength(1);
      expect(newMap.strokes[0].stroke).toEqual(stroke);
      expect(newMap.state).toEqual(initialState);
    });

    it('should initialize with deactivated strokes', () => {
      const stroke = createTestStroke();
      const initialState: MapState = {
        stroke1: {
          peerId: 'peer1',
          timestamp: Date.now(),
          value: stroke,
          isDeactivated: true,
        },
      };

      const newMap = new LWWMap('peer1', initialState);
      expect(newMap.strokes).toHaveLength(0);
      expect(newMap.state.stroke1.isDeactivated).toBe(true);
    });
  });

  describe('stroke operations', () => {
    it('should add new stroke and generate unique id', () => {
      const stroke1 = createTestStroke('#ff0000');
      const stroke2 = createTestStroke('#00ff00');

      const { id: id1 } = map.addStroke(stroke1);
      const { id: id2 } = map.addStroke(stroke2);

      // ID가 서로 달라야 함
      expect(id1).not.toBe(id2);
      // 총 2개의 stroke가 있어야 함
      expect(map.strokes).toHaveLength(2);
      // 각 stroke 데이터 확인
      expect(map.strokes.find((s) => s.id === id1)?.stroke).toEqual(stroke1);
      expect(map.strokes.find((s) => s.id === id2)?.stroke).toEqual(stroke2);
    });

    it('should delete existing stroke', () => {
      const stroke = createTestStroke();
      const { id } = map.addStroke(stroke);

      // 처음에는 1개의 stroke
      expect(map.strokes).toHaveLength(1);

      const deleted = map.deleteStroke(id);

      // 삭제 성공 확인
      expect(deleted).toBe(true);
      // 삭제 후에는 0개
      expect(map.strokes).toHaveLength(0);
    });

    it('should return false when deleting non-existent stroke', () => {
      const deleted = map.deleteStroke('non-existent-id');
      expect(deleted).toBe(false);
    });

    it('should handle stroke deactivation and activation', () => {
      const stroke = createTestStroke();
      const { id } = map.addStroke(stroke);

      expect(map.strokes).toHaveLength(1);

      const deactivated = map.deactivateStroke(id);
      expect(deactivated).toBe(true);
      expect(map.strokes).toHaveLength(0);

      const activated = map.activateStroke(id);
      expect(activated).toBe(true);
      expect(map.strokes).toHaveLength(1);
    });
  });

  describe('state management', () => {
    it('should maintain correct state after operations', () => {
      const stroke = createTestStroke();
      const { id } = map.addStroke(stroke);

      // 상태 확인
      const state = map.state;
      // stroke 존재 확인
      expect(state[id]).toBeTruthy();
      expect(state[id].value).toEqual(stroke);
      // peer ID 확인
      expect(state[id].peerId).toBe('peer1');
      expect(state[id].isDeactivated).toBe(false);

      // 삭제 후 상태 확인
      map.deleteStroke(id);
      // 삭제된 stroke는 null이어야 함
      expect(map.state[id].value).toBeNull();
    });
  });

  describe('concurrent operations', () => {
    let map1: LWWMap;
    let map2: LWWMap;

    beforeEach(() => {
      map1 = new LWWMap('peer1');
      map2 = new LWWMap('peer2');
    });

    it('should merge states from different peers', () => {
      // 각 맵에 stroke 추가
      const stroke1 = createTestStroke('#ff0000');
      const stroke2 = createTestStroke('#00ff00');

      map1.addStroke(stroke1);
      map2.addStroke(stroke2);

      // 동기화 시뮬레이션
      const { updatedKeys: keys1 } = map1.merge(map2.state);
      const { updatedKeys: keys2 } = map2.merge(map1.state);

      // 두 맵 모두 두 개의 stroke를 가져야 함
      expect(map1.strokes).toHaveLength(2);
      expect(map2.strokes).toHaveLength(2);
      // 상태가 동일해야 함
      expect(map1.state).toEqual(map2.state);
      expect(keys1).toHaveLength(1);
      expect(keys2).toHaveLength(1);
    });

    it('should handle concurrent modifications to same stroke', () => {
      // 가짜 타이머 사용
      vi.useFakeTimers();

      // peer1이 초기 stroke 추가
      const time1 = Date.now();
      vi.setSystemTime(time1);
      const stroke1 = createTestStroke('#ff0000');
      const { id } = map1.addStroke(stroke1);

      // peer2와 동기화
      map2.merge(map1.state);

      // peer1이 stroke 삭제
      const deleteTime = time1 + 1000;
      vi.setSystemTime(deleteTime);
      map1.deleteStroke(id);

      // peer2가 stroke 색상 수정
      const modifyTime = deleteTime + 1000;
      vi.setSystemTime(modifyTime);
      const modifiedStroke = createTestStroke('#0000ff');
      const modifiedState: RegisterState<DrawingData | null> = {
        peerId: 'peer2',
        timestamp: modifyTime,
        value: modifiedStroke,
        isDeactivated: false,
      };

      map2.mergeRegister(id, modifiedState);

      // 양방향 동기화
      map1.merge(map2.state);
      map2.merge(map1.state);

      // 두 맵 모두 수정된 stroke를 가져야 함 (새로운 타임스탬프가 우선)
      expect(map1.strokes).toHaveLength(1);
      expect(map2.strokes).toHaveLength(1);
      expect(map1.strokes[0].stroke.style.color).toBe('#0000ff');
      expect(map2.strokes[0].stroke.style.color).toBe('#0000ff');

      // 실제 타이머로 복원
      vi.useRealTimers();
    });

    it('should handle concurrent additions and deletions', () => {
      // 가짜 타이머 사용
      vi.useFakeTimers();

      // peer1이 stroke를 추가하고 삭제
      const time1 = Date.now();
      vi.setSystemTime(time1);
      const stroke1 = createTestStroke('#ff0000');
      const { id: id1 } = map1.addStroke(stroke1);

      const deleteTime = time1 + 1000;
      vi.setSystemTime(deleteTime);
      map1.deleteStroke(id1);

      // peer2가 다른 stroke 추가
      const time2 = deleteTime + 1000;
      vi.setSystemTime(time2);
      const stroke2 = createTestStroke('#00ff00');
      const { id: id2 } = map2.addStroke(stroke2);

      // 양방향 동기화
      map1.merge(map2.state);
      map2.merge(map1.state);

      // 두 맵 모두 두 번째 stroke만 가져야 함
      expect(map1.strokes).toHaveLength(1);
      expect(map2.strokes).toHaveLength(1);
      expect(map1.strokes[0].id).toBe(id2);
      expect(map2.strokes[0].id).toBe(id2);

      // 실제 타이머로 복원
      vi.useRealTimers();
    });

    it('should handle deactivation state during merge', () => {
      const stroke = createTestStroke();
      const { id } = map1.addStroke(stroke);

      map2.merge(map1.state);

      map1.deactivateStroke(id);
      map2.merge(map1.state);

      expect(map2.strokes).toHaveLength(0);

      map1.activateStroke(id);
      const { updatedKeys } = map2.merge(map1.state);

      expect(updatedKeys).toContain(id);
      expect(map2.strokes).toHaveLength(1);
    });
  });

  describe('active strokes', () => {
    it('should return only active strokes', () => {
      const stroke1 = createTestStroke('#ff0000');
      const stroke2 = createTestStroke('#00ff00');

      const { id: id1 } = map.addStroke(stroke1);
      const { id: id2 } = map.addStroke(stroke2);

      map.deactivateStroke(id1);

      const activeStrokes = map.getActiveStrokes();
      expect(activeStrokes).toHaveLength(1);
      expect(activeStrokes[0].id).toBe(id2);
    });
  });
});
