export interface CacheMetadata {
  cachedAt: string;
  freshnessWindowSeconds: number;
  providerSource: string;
}

export interface CacheEntry<T> {
  data: T;
  meta: CacheMetadata;
}

// In-Memory & Redis Adapter Storage with Freshness Expiry Rules
class NovaRedisCacheAdapter {
  private cacheStore = new Map<string, { value: any; expiresAt: number; meta: CacheMetadata }>();

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    const entry = this.cacheStore.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cacheStore.delete(key);
      return null;
    }

    return {
      data: entry.value,
      meta: entry.meta,
    };
  }

  async set<T>(key: string, data: T, ttlSeconds: number = 60, providerSource: string = 'NOVA Cache Adapter'): Promise<void> {
    const now = Date.now();
    this.cacheStore.set(key, {
      value: data,
      expiresAt: now + ttlSeconds * 1000,
      meta: {
        cachedAt: new Date(now).toISOString(),
        freshnessWindowSeconds: ttlSeconds,
        providerSource,
      },
    });
  }

  async invalidate(keyPattern?: string): Promise<void> {
    if (!keyPattern) {
      this.cacheStore.clear();
      return;
    }
    const keys = Array.from(this.cacheStore.keys());
    keys.forEach((key) => {
      if (key.includes(keyPattern)) {
        this.cacheStore.delete(key);
      }
    });
  }
}

export const novaCache = new NovaRedisCacheAdapter();
