## A hashtable-based implementation of `Map<K,V>` and `Set<V>`

An implementation `Map<TKey, TValue>` and `Set<TValue>` that can use custom `equals` and `getHashCode` functions.

### A case-insensitve set, using [`EqualityComparer<T>`](https://github.com/biggyspender/ts-equality-comparer)

    const names = ["zebra", "antelope", "ardvaark", "tortoise", "turtle", "dog", "frog"]
    const comparer: EqualityComparer<string> = {
        equals: (a, b) => a.toLowerCase() === b.toLowerCase(),
        getHashCode: (x) => hashString(x.toLowerCase())
    }
    const set = createComparerSet(comparer)
    names.forEach(n => set.add(n))
    expect(set.has("DOg")).toBeTruthy()

### acknowledgements

Created using the wonderful [https://github.com/alexjoverm/typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
