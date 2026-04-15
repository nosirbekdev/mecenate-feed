import { createContext, useContext } from 'react';

import { UiStore } from './ui.store';

export class RootStore {
  readonly ui: UiStore;

  constructor() {
    this.ui = new UiStore();
  }
}

export const rootStore = new RootStore();
export const RootStoreContext = createContext<RootStore>(rootStore);

export function useRootStore(): RootStore {
  return useContext(RootStoreContext);
}
