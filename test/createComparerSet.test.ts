import { createComparerSet } from '../src/ts-hashmap'
import { deepEqualityComparer, EqualityComparer } from 'ts-equality-comparer'
import { range } from './range'
import { getHashCode } from 'ts-gethashcode'

describe('createComparerSet', () => {
  it('works', () => {
    const testSet = (set: Set<number>) => {
      expect(set.size).toBe(0)
      set.add(1)
      expect(set.has(1)).toBeTruthy()
      expect(set.has(0)).not.toBeTruthy()
      expect(set.size).toBe(1)
      set.add(1)
      expect(set.size).toBe(1)
      expect(set.delete(0)).toBeFalsy()
      expect(set.size).toBe(1)
      expect(set.delete(1)).toBeTruthy()
      expect(set.size).toBe(0)
      expect(set.delete(1)).toBeFalsy()

      range(0, 1000).forEach(x => set.add((x / 2) | 0))
      expect(set.size).toBe(500)
      expect([...set.entries()].map(([k]) => k)).toEqual(range(0, 500))
      expect([...set.entries()].map(([, v]) => v)).toEqual(range(0, 500))
      expect([...set[Symbol.iterator]()]).toEqual(range(0, 500))
      expect([...set.keys()]).toEqual(range(0, 500))
      expect([...set.values()]).toEqual(range(0, 500))
      const aaa: number[] = []
      set.forEach(k => aaa.push(k))
      expect(aaa).toEqual(range(0, 500))
      set.clear()
      expect(set.size).toBe(0)
    }
    testSet(createComparerSet<number>(0, deepEqualityComparer))
    testSet(createComparerSet<number>())
  })
  const caseInsensitiveComparer: EqualityComparer<string> = {
    equals: (a, b) => a.toLowerCase() === b.toLowerCase(),
    getHashCode: x => getHashCode(x.toLowerCase())
  }

  it('can be case insensitive', () => {
    const names = ['zebra', 'antelope', 'ardvaark', 'tortoise', 'turtle', 'dog', 'frog']
    const set = createComparerSet(caseInsensitiveComparer)
    names.forEach(n => set.add(n))
    expect(set.has('DOg')).toBeTruthy()
    expect(set.has('badger')).toBeFalsy()
  })
  it('can have a capacity', () => {
    const names = ['zebra', 'antelope', 'ardvaark', 'tortoise', 'turtle', 'dog', 'frog']
    const set = createComparerSet(names.length, caseInsensitiveComparer)
    names.forEach(n => set.add(n))
    expect(set.has('DOg')).toBeTruthy()
    expect(set.has('badger')).toBeFalsy()
  })
})
