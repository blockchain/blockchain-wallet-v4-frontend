import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import * as actions from './actions.js'
import * as sagas from './sagas'

describe('Alert Sagas', () => {
  describe('handleTimer', () => {
    it('should dismiss alert when timeout expires', () => {
      let id = 1
      let gen = sagas.handleTimer({ payload: { id: id } })

      expect(gen.next().value).toEqual(call(delay, 7000))
      expect(gen.next().value).toEqual(put(actions.dismissAlert(id)))
      expect(gen.next().done).toEqual(true)
    })
    it('should not dismiss if persisted', () => {
      let gen = sagas.handleTimer({ payload: { id: 123, persist: true } })
      expect(gen.next().done).toEqual(true)
    })
  })
})
