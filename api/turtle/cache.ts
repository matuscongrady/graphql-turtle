import * as hash from 'object-hash';

export const getHash = (ruleName: string, requestorObject, args) => {
  return `${ruleName}-${hash(requestorObject)}-${hash(args)}`;
};

class Cache {
  cachedResults = new Map<string, boolean>();

  clear() {
    this.cachedResults.clear();
  }

  set(key: string, cacheValidity: number, value: boolean) {
    if (this.cachedResults.has(key)) return;
    this.cachedResults.set(key, value);
    setTimeout(() => {
      this.cachedResults.delete(key);
    }, cacheValidity * 1000);
  }

  get(key: string): boolean {
    return this.cachedResults.get(key);
  }
}

export const cache = new Cache();
