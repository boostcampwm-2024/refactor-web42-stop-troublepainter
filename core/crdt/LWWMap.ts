import { MapState, RegisterState, DrawingData } from '@/types/crdt.types';
import { LWWRegister } from './LWWRegister';

export class LWWMap {
  readonly id: string;
  #data: Map<string, LWWRegister<DrawingData | null>>;

  constructor(id: string, initialState: MapState = {}) {
    this.id = id;
    this.#data = new Map();

    for (const [key, registerState] of Object.entries(initialState)) {
      this.#data.set(key, new LWWRegister(this.id, registerState));
    }
  }

  get state(): MapState {
    const state: MapState = {};
    for (const [key, register] of this.#data.entries()) {
      state[key] = register.state;
    }
    return state;
  }

  get strokes(): { id: string; stroke: DrawingData }[] {
    const result = [];
    for (const [key, register] of this.#data.entries()) {
      const value = register.value;
      if (value !== null) {
        result.push({ id: key, stroke: value });
      }
    }
    return result;
  }

  // 선 생성
  addStroke(stroke: DrawingData): string {
    const timestamp = Date.now();
    const id = `${this.id}-${timestamp}-${Math.random().toString(36).substring(2, 9)}`;
    const register = new LWWRegister<DrawingData | null>(this.id, [this.id, timestamp, stroke]);
    this.#data.set(id, register);
    return id;
  }

  // 선 삭제
  deleteStroke(id: string): boolean {
    const register = this.#data.get(id);
    if (register) {
      register.set(null);
      return true;
    }
    return false;
  }

  // 원격 상태 병합
  merge(remoteState: MapState): string[] {
    const updatedKeys: string[] = [];

    for (const [key, remoteRegisterState] of Object.entries(remoteState)) {
      const localRegister = this.#data.get(key);

      if (localRegister) {
        // 기존 레지스터가 있으면 병합
        if (localRegister.merge(remoteRegisterState)) {
          updatedKeys.push(key);
        }
      } else {
        // 새로운 레지스터면 추가
        this.#data.set(key, new LWWRegister(this.id, remoteRegisterState));
        updatedKeys.push(key);
      }
    }

    return updatedKeys;
  }

  // 단일 레지스터 업데이트
  mergeRegister(key: string, remoteRegisterState: RegisterState<DrawingData | null>): boolean {
    const localRegister = this.#data.get(key);

    if (localRegister) {
      // 기존 stroke에 대한 원격 업데이트 병합
      return localRegister.merge(remoteRegisterState);
    } else {
      // 새로운 stroke 추가
      this.#data.set(key, new LWWRegister(this.id, remoteRegisterState));
      return true;
    }
  }
}
