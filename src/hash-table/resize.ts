import { EqualityComparer } from 'ts-equality-comparer'
import { KeyValuePair } from './KeyValuePair'
import { HashTable } from './HashTable'
export const resize = <TKey, TValue>(
  count: number,
  buckets: Iterable<KeyValuePair<TKey, TValue>[] | undefined>,
  { equals, getHashCode }: EqualityComparer<TKey>,
  hashTableFactory: (cap: number, comparer: EqualityComparer<TKey>) => HashTable<TKey, TValue>
) => {
  const keyValuePairs = [
    ...(function*() {
      for (const b of buckets) {
        if (typeof b !== 'undefined') {
          for (const bb of b) {
            yield bb
          }
        }
      }
    })()
  ]
  // const keyValuePairs = blinq(buckets)
  //   .where(b => typeof b !== 'undefined')
  //   .selectMany(b => b!)
  const newHashTable = hashTableFactory(count, { equals, getHashCode })
  keyValuePairs.forEach(([k, v, i]) => newHashTable.add(k, v, i))
  return newHashTable.buckets
}
