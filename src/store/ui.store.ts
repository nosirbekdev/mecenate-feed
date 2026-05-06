import { makeAutoObservable } from 'mobx';

import type { FeedTier } from '../api/types';

export class UiStore {
  tierFilter: FeedTier = 'all';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTierFilter(nextTier: FeedTier) {
    this.tierFilter = nextTier;
  }
}
