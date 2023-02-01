import HistoryCache from './HistoryCache';

type Obj = Record<string, unknown>;

type Constructor<T> = new (...args: any[]) => T;

export default function RememberCache<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    values: Obj = {};
    caches: Record<string, RememberCache | HistoryCache> = {};

    constructor(...args: any[]) {
      super(...args);
    }

    public addHistory(key, options): HistoryCache {
      return (this[key] = new HistoryCache(key, options));
    }

    public addCache(key, options?: Obj): RememberCache {
      return (this[key] = new RememberCache(key, options));
    }

    public clear(key, keyValue) {
      console.log('TODO - implement this');
    }

    public put(key: string, value: unknown): unknown {
      const ret = this.values[key];
      this.values[key] = value;
      return ret;
    }

    public get(key: string): unknown {
      return this.values[key];
    }
  };
}
