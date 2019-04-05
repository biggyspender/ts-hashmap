import { EqualityComparer } from 'ts-equality-comparer'
import { KeyValuePair } from './KeyValuePair'
import { mod } from '../math/mod'
export const getBucket = <TKey, TValue>(
  key: TKey,
  buckets: KeyValuePair<TKey, TValue>[][],
  { getHashCode }: EqualityComparer<TKey>,
  create: boolean = false
) => {
  const h = getHashCode(key)
  const bucketIndex = mod(h, buckets.length)
  const bucket = buckets[bucketIndex]
  return bucket ? bucket : create ? (buckets[bucketIndex] = []) : null
}
