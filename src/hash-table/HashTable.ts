import { EqualityComparer } from 'ts-equality-comparer'
import { KeyValuePair } from './KeyValuePair'
import { getBucket } from './getBucket'
import { resize } from './resize'
export class HashTable<TKey, TValue> implements Map<TKey, TValue> {
  buckets: KeyValuePair<TKey, TValue>[][]
  count: number
  avgBucketFill: number
  comparer: EqualityComparer<TKey>
  insertCount: number
  initialCapacity: number
  hashTableFactory: (cap: number, comparer: EqualityComparer<TKey>) => HashTable<TKey, TValue>
  constructor(
    buckets: KeyValuePair<TKey, TValue>[][],
    count: number,
    avgBucketFill: number,
    initialCapacity: number,
    comparer: EqualityComparer<TKey>,
    hashTableFactory: (cap: number, comparer: EqualityComparer<TKey>) => HashTable<TKey, TValue>
  ) {
    this.buckets = buckets
    this.count = count
    this.avgBucketFill = avgBucketFill
    this.comparer = comparer
    this.insertCount = 0
    this.initialCapacity = initialCapacity
    this.hashTableFactory = hashTableFactory
  }
  [Symbol.iterator]() {
    return this.entries()
  }
  entries(): IterableIterator<[TKey, TValue]> {
    const buckets = this.buckets
    const bucketItems = Array.from(
      (function*() {
        for (const b of buckets) {
          if (b) {
            for (const x of b) {
              yield x
            }
          }
        }
      })()
    )
    const sortedBucketItems = bucketItems.sort(([, , i1], [, , i2]) => i1 - i2)
    const r = sortedBucketItems.map<[TKey, TValue]>(([k, v]) => [k, v])
    return r[Symbol.iterator]()
  }
  keys(): IterableIterator<TKey> {
    const r = [...this.entries()].map<TKey>(([k]) => k)
    return r[Symbol.iterator]()
  }
  values(): IterableIterator<TValue> {
    const r = [...this.entries()].map(([, v]) => v)
    return r[Symbol.iterator]()
  }
  clear() {
    const buckets = this.hashTableFactory(this.initialCapacity, this.comparer).buckets
    this.buckets = buckets
    this.count = 0
    this.insertCount = 0
  }
  delete(key: TKey) {
    const bucket = getBucket(key, this.buckets, this.comparer)
    if (bucket === null) {
      return false
    }
    const comparer = this.comparer
    const items = [
      ...(function*() {
        let c = 0
        for (const [k] of bucket) {
          const i = c++
          if (comparer.equals(k, key)) {
            yield i
          }
        }
      })()
    ]

    if (items.length > 1) {
      throw Error('too many items')
    }
    if (items.length === 0) {
      return false
    }
    const idx = items[0]

    bucket.splice(idx, 1)
    --this.count
    return true
  }
  forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: any) {
    const cb = thisArg ? callbackfn.bind(thisArg) : callbackfn
    for (const [k, v] of this.entries()) {
      cb(v, k, this)
    }
    // blinq(this.entries()).forEach(([k, v]) => cb(v, k, this))
  }
  set(key: TKey, value: TValue) {
    this.add(key, value)
    return this
  }
  has(key: TKey) {
    const bucket = getBucket(key, this.buckets, this.comparer)
    if (bucket === null) {
      return false
    }
    for (const [k] of bucket) {
      if (this.comparer.equals(k, key)) {
        return true
      }
    }
    return false
  }
  get size() {
    return this.count
  }
  add(key: TKey, value: TValue, insertIndex?: number) {
    const idealNumBuckets = (this.count / this.avgBucketFill) | 0
    if (idealNumBuckets >= this.buckets.length) {
      this.buckets = resize(this.count * 2, this.buckets, this.comparer, this.hashTableFactory)
    }
    const bucket = getBucket(key, this.buckets, this.comparer, true)!
    const keyExists = !bucket.every(([bkey]) => !this.comparer.equals(key, bkey))
    if (keyExists) {
      return false
    }
    this.count++
    bucket.push([key, value, typeof insertIndex === 'undefined' ? this.insertCount++ : insertIndex])
    return true
  }
  get(key: TKey) {
    const bucket = getBucket(key, this.buckets, this.comparer)
    if (!bucket) {
      return undefined
    }
    const comparer = this.comparer
    for (const [k, v] of bucket) {
      if (comparer.equals(k, key)) {
        return v
      }
    }
    return undefined
  }
  [Symbol.toStringTag]: 'Map'
  /* istanbul ignore next */
  toString() {
    const counts = this.buckets.map(b => (b ? b.length : 0))
    const avgBucketFill =
      counts.length === 0 ? 0 : counts.reduce((a, c) => a + c, 0) / counts.length
    return JSON.stringify({ counts: [...counts].join(','), avgBucketFill }, null, 2)
  }
}
