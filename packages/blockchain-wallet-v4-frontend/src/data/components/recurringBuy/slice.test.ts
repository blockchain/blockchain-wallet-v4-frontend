import Remote from '@core/remote'
import {
  RecurringBuyItemState,
  RecurringBuyRegisteredList
} from 'data/components/recurringBuy/types'

import { actions, reducer } from './slice'

const makeRecurringBuys = (id: string, isActive: boolean) =>
  ({
    id,
    state: isActive ? RecurringBuyItemState.ACTIVE : RecurringBuyItemState.INACTIVE
  } as RecurringBuyRegisteredList)

describe('Recurring buys reducer', () => {
  describe('when registeredListSuccess action received', () => {
    it('should store only active recurring buys', () => {
      const activeBuys = [makeRecurringBuys('1', true), makeRecurringBuys('2', true)]
      const inactiveBuys = [makeRecurringBuys('3', false), makeRecurringBuys('4', false)]

      expect(
        reducer(undefined, actions.registeredListSuccess([...activeBuys, ...inactiveBuys]))
      ).toEqual(
        expect.objectContaining({
          registeredList: Remote.of(activeBuys)
        })
      )
    })
  })

  it.todo('other cases')
})
