import { getCountdownColor } from './template'

describe('countdownTimer', () => {
  describe('get countdown color', () => {
    it('should return correct color', () => {
      expect(getCountdownColor('2012-03-29T10:05:45.455Z')).toEqual('error')
    })
  })
})
