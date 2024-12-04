import { DrawingData, MapState, RegisterState } from '@/types/crdt.types';
import { LWWRegister } from './LWWRegister';

export class LWWMap {
  readonly id: string;
  #data: Map<string, LWWRegister<DrawingData | null>>;
  #sortedStrokes: Array<{ id: string; stroke: DrawingData }>;

  constructor(id: string, initialState: MapState = {}) {
    this.id = id;
    this.#data = new Map();
    this.#sortedStrokes = [];

    const entries = Object.entries(initialState)
      .map(([key, state]) => ({
        key,
        register: new LWWRegister(this.id, state),
        timestamp: state.timestamp,
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    for (const entry of entries) {
      this.#data.set(entry.key, entry.register);
      const value = entry.register.value;
      if (value !== null && !entry.register.isDeactivated) {
        this.#sortedStrokes.push({ id: entry.key, stroke: value });
      }
    }
  }

  get state(): MapState {
    const state: MapState = {};
    for (const [key, register] of this.#data.entries()) {
      state[key] = register.state;
    }
    return state;
  }

  get strokes(): Array<{ id: string; stroke: DrawingData }> {
    return this.#sortedStrokes;
  }

  // 정렬된 배열에 새로운 스트로크를 삽입할 인덱스 찾기
  private findSortedInsertIndex(newStroke: DrawingData): number {
    for (let i = this.#sortedStrokes.length - 1; i >= 0; i--) {
      const item = this.#sortedStrokes[i];
      if (item.stroke.timestamp <= newStroke.timestamp) {
        return i + 1;
      }
    }
    return 0;
  }

  // 정렬된 배열에 새로운 스트로크 삽입
  private insertSortedStroke(id: string, stroke: DrawingData): 'end' | 'middle' {
    const index = this.findSortedInsertIndex(stroke);

    if (index === this.#sortedStrokes.length) {
      this.#sortedStrokes.push({ id, stroke });
      return 'end';
    }

    this.#sortedStrokes.splice(index, 0, { id, stroke });
    return 'middle';
  }

  addStroke(stroke: DrawingData): { id: string; position: 'end' | 'middle' } {
    const id = `${this.id}-${stroke.timestamp}-${Math.random().toString(36).substring(2, 9)}`;
    const register = new LWWRegister<DrawingData | null>(this.id, {
      peerId: this.id,
      timestamp: stroke.timestamp,
      value: stroke,
      isDeactivated: false,
    });

    this.#data.set(id, register);
    const position = this.insertSortedStroke(id, stroke);

    return { id, position };
  }

  // 스트로크 삭제
  deleteStroke(id: string): boolean {
    const register = this.#data.get(id);
    if (register) {
      register.set(null);
      const index = this.#sortedStrokes.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.#sortedStrokes.splice(index, 1);
      }
      return true;
    }
    return false;
  }

  deactivateStroke(id: string): boolean {
    const register = this.#data.get(id);
    if (register) {
      register.setDeactivated(true);
      const index = this.#sortedStrokes.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.#sortedStrokes.splice(index, 1);
      }
      return true;
    }
    return false;
  }

  activateStroke(id: string): boolean {
    const register = this.#data.get(id);
    if (register && register.isDeactivated) {
      register.setDeactivated(false);
      const stroke = register.value;
      if (stroke !== null) {
        const position = this.insertSortedStroke(id, stroke);
        return position === 'end';
      }
    }
    return false;
  }

  // 전체 상태 병합
  merge(remoteState: MapState): { updatedKeys: string[]; requiresRedraw: boolean } {
    const updatedKeys: string[] = [];
    let requiresRedraw = false;

    for (const [key, remoteRegisterState] of Object.entries(remoteState)) {
      const result = this.mergeRegister(key, remoteRegisterState);
      if (result.updated) {
        updatedKeys.push(key);
        if (result.position === 'middle') {
          requiresRedraw = true;
        }
      }
    }

    return { updatedKeys, requiresRedraw };
  }

  // 단일 레지스터 병합
  mergeRegister(
    key: string,
    remoteRegisterState: RegisterState<DrawingData | null>,
  ): { updated: boolean; position: 'end' | 'middle' } {
    const localRegister = this.#data.get(key);
    let position: 'end' | 'middle' = 'end';

    if (localRegister) {
      if (
        remoteRegisterState.isDeactivated !== undefined &&
        remoteRegisterState.isDeactivated !== localRegister.isDeactivated
      ) {
        const wasDeactivated = localRegister.isDeactivated;
        localRegister.setDeactivated(remoteRegisterState.isDeactivated);

        const index = this.#sortedStrokes.findIndex((item) => item.id === key);
        if (remoteRegisterState.isDeactivated) {
          if (index !== -1) {
            this.#sortedStrokes.splice(index, 1);
          }
        } else if (remoteRegisterState.value !== null) {
          if (index === -1) {
            position = this.insertSortedStroke(key, remoteRegisterState.value);
          }
        }

        return { updated: true, position };
      }

      const wasUpdated = localRegister.merge(remoteRegisterState);
      if (wasUpdated && !localRegister.isDeactivated) {
        const index = this.#sortedStrokes.findIndex((item) => item.id === key);
        if (index !== -1) {
          this.#sortedStrokes.splice(index, 1);
        }
        if (remoteRegisterState.value !== null) {
          position = this.insertSortedStroke(key, remoteRegisterState.value);
        }
        return { updated: true, position };
      }
      return { updated: false, position };
    } else {
      const newRegister = new LWWRegister(this.id, remoteRegisterState);
      this.#data.set(key, newRegister);

      if (remoteRegisterState.value !== null && !remoteRegisterState.isDeactivated) {
        position = this.insertSortedStroke(key, remoteRegisterState.value);
      }
      return { updated: true, position };
    }
  }

  getActiveStrokes(): Array<{ id: string; stroke: DrawingData }> {
    return this.#sortedStrokes.filter(({ id }) => {
      const register = this.#data.get(id);
      return register && !register.isDeactivated;
    });
  }
}
