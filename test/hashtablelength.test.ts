import { createComparerMap } from '../src/createComparerMap'
import { deepEqualityComparer } from 'ts-equality-comparer'
import { range } from './range'
describe('hashtablelength', () => {
  it('has working length', () => {
    const set = createComparerMap<number, number>(0, deepEqualityComparer)
    expect(range(0, 2).length).toBe(2)
    range(0, 2).forEach(x => set.set(x, x))
    console.log(`set size: ${set.size}`)
    expect(set.size).toBe(2)
  })
})
