import { EqualityComparer, isEqualityComparer } from 'ts-equality-comparer'
import { createHashTable } from './hash-table/createHashTable'
export function createComparerSet<K>(capacity: number, comparer: EqualityComparer<K>): Set<K>
export function createComparerSet<K>(comparer?: EqualityComparer<K>): Set<K>
export function createComparerSet<K>(
  capacityOrComparer: number | EqualityComparer<K> = 0,
  comparerOrUndefined?: EqualityComparer<K>
): Set<K> {
  const comparer: EqualityComparer<K> | undefined = isEqualityComparer(capacityOrComparer)
    ? capacityOrComparer
    : comparerOrUndefined
  const capacity: number = typeof capacityOrComparer === 'number' ? capacityOrComparer : 0
  if (!comparer) {
    return new Set<K>()
  }
  const ht = createHashTable<K, K>(capacity, comparer)
  return toSet(ht)
}
const toSet = <K>(map: Map<K, K>): Set<K> => {
  const set: Set<K> = {
    add(v: K) {
      map.set(v, v)
      return set
    },
    clear() {
      map.clear()
    },
    delete(k: K) {
      return map.delete(k)
    },
    entries() {
      return map.entries()
    },
    forEach(cb: (k1: K, k2: K, s: Set<K>) => void) {
      return map.forEach((v, k) => cb(v, k, set))
    },
    has(v: K) {
      return map.has(v)
    },
    keys() {
      return map.keys()
    },
    get size() {
      return map.size
    },
    values() {
      return map.values()
    },
    [Symbol.iterator]() {
      return set.keys()
    },
    [Symbol.toStringTag]: 'Set'
  }
  return set
}
