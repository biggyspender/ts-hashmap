import { EqualityComparer } from 'ts-equality-comparer'
import { createHashTable } from './hash-table/createHashTable'
export const createComparerMap = <K, V>(
  capacity: number = 0,
  comparer?: EqualityComparer<K>
): Map<K, V> => {
  if (!comparer) {
    return new Map<K, V>()
  }
  return createHashTable(capacity, comparer)
}
