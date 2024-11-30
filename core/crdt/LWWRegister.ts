import { RegisterState } from '@/types/crdt.types';

export class LWWRegister<T> {
  readonly id: string;
  #state: RegisterState<T>; // [peerId, timestamp, value]

  constructor(id: string, initialState: RegisterState<T>) {
    this.id = id;
    this.#state = initialState;
  }

  get value(): T {
    return this.#state[2];
  }

  get state(): RegisterState<T> {
    return this.#state;
  }

  set(value: T): void {
    this.#state = [this.id, Date.now(), value];
  }

  // 원격 상태와 병합 (더 새로운 타임스탬프 또는 더 큰 피어 ID 우선)
  merge(remoteState: RegisterState<T>): boolean {
    const [remotePeer, remoteTimestamp] = remoteState;
    const [localPeer, localTimestamp] = this.#state;

    if (remoteTimestamp > localTimestamp || (remoteTimestamp === localTimestamp && remotePeer > localPeer)) {
      this.#state = remoteState;
      return true;
    }
    return false;
  }
}
