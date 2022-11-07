import { padLinearDomain } from './utils'

describe('Chart utils', () => {
  describe('padLinearDomain', () => {
    it.each([
      [[0, 8] as [number, number], 0.5, [-2, 10]],
      [[0, 8] as [number, number], 0.25, [-1, 9]]
    ])('should correctly pad domain %#', (domain, k, expected) => {
      expect(padLinearDomain(domain, k)).toEqual(expected)
    })
  })
})
