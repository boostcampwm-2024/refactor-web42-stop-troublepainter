import { RegisterState } from '@/types/crdt.types';

export class LWWRegister<T> {
  readonly id: string;
  #state: RegisterState<T>; // [peerId, timestamp, value]
  #isDeactivated: boolean;

  constructor(id: string, initialState: RegisterState<T>) {
    this.id = id;
    this.#state = initialState;
    this.#isDeactivated = false;
  }

  get value(): T {
    return this.#state[2];
  }

  get state(): RegisterState<T> {
    return this.#state;
  }

  get isDeactivated(): boolean {
    return this.#isDeactivated;
  }

  set(value: T): void {
    this.#state = [this.id, Date.now(), value];
  }

  setDeactivated(value: boolean): void {
    this.#isDeactivated = value;
  }

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
