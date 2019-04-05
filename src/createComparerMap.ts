import { EqualityComparer, isEqualityComparer } from 'ts-equality-comparer'
import { createHashTable } from './hash-table/createHashTable'

export function createComparerMap<K, V>(
  capacity: number,
  comparerOrUndefined?: EqualityComparer<K>
): Map<K, V>
export function createComparerMap<K, V>(comparer?: EqualityComparer<K>): Map<K, V>
export function createComparerMap<K, V>(
  capacityOrComparer: number | EqualityComparer<K> = 0,
  comparerOrUndefined?: EqualityComparer<K>
): Map<K, V> {
  const comparer: EqualityComparer<K> | undefined = isEqualityComparer(capacityOrComparer)
    ? capacityOrComparer
    : comparerOrUndefined
  const capacity: number = typeof capacityOrComparer === 'number' ? capacityOrComparer : 0
  if (!comparer) {
    return new Map<K, V>()
  }
  return createHashTable(capacity, comparer)
}
