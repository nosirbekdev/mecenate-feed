import { makeAutoObservable } from 'mobx';

import type { FeedTier } from '../api/types';

export class UiStore {
  tierFilter: FeedTier = 'all';
  simulateError = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTierFilter(nextTier: FeedTier) {
    this.tierFilter = nextTier;
  }

  setSimulateError(enabled: boolean) {
    this.simulateError = enabled;
  }

  toggleSimulateError() {
    this.simulateError = !this.simulateError;
  }
}
