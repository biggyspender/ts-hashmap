export const range = (start: number, count: number) => [
  ...(function*() {
    for (let i = 0; i < count; ++i) {
      yield start + i
    }
  })()
]
