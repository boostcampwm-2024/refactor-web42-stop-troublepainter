import { RegisterState } from '@/types/crdt.types';

export class LWWRegister<T> {
  readonly id: string;
  #state: RegisterState<T>;

  constructor(id: string, initialState: RegisterState<T>) {
    this.id = id;
    this.#state = initialState;
  }

  get value(): T {
    return this.#state.value;
  }

  get state(): RegisterState<T> {
    return this.#state;
  }

  get isDeactivated(): boolean {
    return this.#state.isDeactivated ?? false;
  }

  set(value: T): void {
    this.#state = {
      peerId: this.id,
      timestamp: Date.now(),
      value,
      isDeactivated: this.#state.isDeactivated,
    };
  }

  setDeactivated(value: boolean): void {
    this.#state = {
      ...this.#state,
      isDeactivated: value,
    };
  }

  merge(remoteState: RegisterState<T>): boolean {
    if (remoteState.isDeactivated !== this.#state.isDeactivated) {
      this.#state = {
        ...this.#state,
        isDeactivated: remoteState.isDeactivated,
      };
      return true;
    }

    if (
      remoteState.timestamp > this.#state.timestamp ||
      (remoteState.timestamp === this.#state.timestamp && remoteState.peerId > this.#state.peerId)
    ) {
      this.#state = remoteState;
      return true;
    }
    return false;
  }
}
